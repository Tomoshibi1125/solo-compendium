-- Add RPC function to update character XP with validation and logging
CREATE OR REPLACE FUNCTION update_character_xp(
    character_id UUID,
    xp_amount INTEGER,
    campaign_id UUID DEFAULT NULL,
    reason TEXT DEFAULT 'XP Reward'
)
RETURNS TABLE(
    success BOOLEAN,
    new_xp_total INTEGER,
    message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_xp INTEGER;
    new_xp INTEGER;
    character_name TEXT;
BEGIN
    -- Get current character data and validate ownership
    SELECT 
        c.experience,
        c.name
    INTO 
        current_xp,
        character_name
    FROM characters c
    WHERE c.id = character_id;
    
    -- Check if character exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0, 'Character not found'::TEXT;
        RETURN;
    END IF;
    
    -- Validate XP amount (must be positive)
    IF xp_amount <= 0 THEN
        RETURN QUERY SELECT false, current_xp, 'XP amount must be positive'::TEXT;
        RETURN;
    END IF;
    
    -- Calculate new XP total
    new_xp := current_xp + xp_amount;
    
    -- Update character XP
    UPDATE characters 
    SET experience = new_xp,
        updated_at = NOW()
    WHERE id = character_id;
    
    -- Log the XP award if campaign is provided
    IF campaign_id IS NOT NULL THEN
        INSERT INTO campaign_session_logs (
            campaign_id,
            log_type,
            title,
            content,
            metadata,
            created_at
        ) VALUES (
            campaign_id,
            'reward',
            'XP Award',
            format('%s gained %s XP', character_name, xp_amount),
            json_build_object(
                'character_id', character_id,
                'xp_amount', xp_amount,
                'previous_xp', current_xp,
                'new_xp', new_xp,
                'reason', reason
            ),
            NOW()
        );
    END IF;
    
    -- Return success result
    RETURN QUERY SELECT 
        true, 
        new_xp, 
        format('%s gained %s XP (Total: %s)', character_name, xp_amount, new_xp)::TEXT;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT 
            false, 
            COALESCE(current_xp, 0), 
            'Error: ' || SQLERRM::TEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_character_xp TO authenticated;
