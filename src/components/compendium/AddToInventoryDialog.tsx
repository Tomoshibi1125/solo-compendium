import { useState } from 'react';
import { ShoppingBag, Loader2, Users, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useEquipment } from '@/hooks/useEquipment';
import { useCampaignInventory } from '@/hooks/useCampaignInventory';
import { useCharacterExtras } from '@/hooks/useCharacterExtras';
import { useCampaignExtras } from '@/hooks/useCampaignExtras';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth/authContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatMonarchVernacular } from '@/lib/vernacular';

export interface CompendiumEntity {
    id: string;
    name: string;
    type?: string;
    item_type?: string;
    description?: string;
    properties?: Json;
    effects?: { passive?: string[] } & Record<string, unknown>;
    weight?: number;
    hp?: number;
    ac?: number;
    stats?: Json;
    speed?: number | string;
}

export function AddToInventoryDialog({
    open,
    onOpenChange,
    entity,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entity: CompendiumEntity | null;
}) {
    const { session } = useAuth();
    const { toast } = useToast();
    const [targetType, setTargetType] = useState<'character' | 'campaign'>('character');
    const [targetId, setTargetId] = useState<string>('');
    const [isAdding, setIsAdding] = useState(false);

    // Fetch user's characters
    const { data: characters = [], isLoading: charsLoading } = useQuery({
        queryKey: ['my-characters', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) return [];
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('user_id', session.user.id);
            if (error) throw error;
            return data;
        },
        enabled: !!session?.user?.id && open,
    });

    // Fetch user's campaigns where they are a member or DM
    const { data: campaigns = [], isLoading: campsLoading } = useQuery({
        queryKey: ['my-campaigns', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) return [];
            const { data: memberData } = await supabase
                .from('campaign_members')
                .select('campaign_id')
                .eq('user_id', session.user.id);

            const campaignIds = memberData?.map(m => m.campaign_id) || [];

            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .or(`dm_id.eq.${session?.user?.id},id.in.(${campaignIds.join(',')})`);

            if (error) throw error;
            return data || [];
        },
        enabled: !!session?.user?.id && open,
    });

    const ddbEnhance = async (action: () => Promise<unknown>) => {
        try {
            setIsAdding(true);
            await action();
            toast({ title: 'Successfully Added', description: `${entity?.name} has been added.` });
            onOpenChange(false);
            setTargetId('');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred';
            toast({ title: 'Error', description: message, variant: 'destructive' });
        } finally {
            setIsAdding(false);
        }
    };

    // We have dynamic hooks, but React requires us to call them unconditionally.
    // We'll call them all, and selectively pick the mutate function based on conditions inside the handler.
    const { addEquipment } = useEquipment(targetType === 'character' ? targetId : '');
    const { addItem: addCampaignItem } = useCampaignInventory(targetType === 'campaign' ? targetId : '');
    const { addExtra: addCharacterExtra } = useCharacterExtras(targetType === 'character' ? targetId : '');
    const { addExtra: addCampaignExtra } = useCampaignExtras(targetType === 'campaign' ? targetId : '');

    const handleAdd = async () => {
        if (!entity || !targetId) return;

        // Check if it's an Extra (Monster/Companion) vs Equipment
        const isMonsterExtra = !!(entity.hp || entity.stats);
        // Determine type string carefully
        const eType = (entity.type || '').toLowerCase();
        const isVehicleItem = eType.includes('vehicle') || eType.includes('mount') || eType.includes('companion') || eType.includes('pet');

        // If it's explicitly a companion/pet/mount/vehicle and it has stats, it goes to Extras.
        // If it lacks stats but is a vehicle, we could still put it in extras or inventory. 
        // We will put it in Inventory if it lacks HP.

        if (isMonsterExtra) {
            // It's a Monster Extra
            const extraPayload = {
                name: entity.name,
                extra_type: eType || 'companion',
                hp_current: entity.hp || 1,
                hp_max: entity.hp || 1,
                ac: entity.ac || 10,
                speed: parseInt(String(entity.speed)) || 30, // some parse logic
                monster_id: entity.id.startsWith('companion-') || entity.id.startsWith('mount-') || entity.id.startsWith('pet-') ? entity.id : null,
                notes: entity.description || null,
                is_active: false,
            };

            if (targetType === 'character') {
                // Because extraPayload is strictly typed to character_id vs campaign_id
                await ddbEnhance(() => addCharacterExtra({ ...extraPayload, character_id: targetId }));
            } else {
                await ddbEnhance(() => addCampaignExtra(extraPayload));
            }
        } else {
            // It's Equipment
            const props: string[] = [];
            if (entity.effects?.passive) {
                props.push(...entity.effects.passive);
            }
            if (entity.properties) {
                props.push(JSON.stringify(entity.properties));
            }

            const itemPayload = {
                name: entity.name,
                item_type: entity.item_type || entity.type || 'gear',
                description: entity.description || null,
                properties: props,
                weight: entity.weight || null,
                quantity: 1,
                is_container: false,
            };

            if (targetType === 'character') {
                await ddbEnhance(() => addEquipment({ ...itemPayload, character_id: targetId }));
            } else {
                await ddbEnhance(() => addCampaignItem(itemPayload));
            }
        }
    };

    if (!entity) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add to Inventory</DialogTitle>
                    <DialogDescription>
                        Where would you like to add <strong className="text-primary">{formatMonarchVernacular(entity.name)}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Tabs value={targetType} onValueChange={(v) => { setTargetType(v as 'character' | 'campaign'); setTargetId(''); }}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="character" className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Character
                            </TabsTrigger>
                            <TabsTrigger value="campaign" className="flex items-center gap-2">
                                <Users className="w-4 h-4" /> Party Stash
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="character" className="mt-4">
                            {charsLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
                            ) : characters.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground p-4">No characters found.</div>
                            ) : (
                                <Select value={targetId} onValueChange={setTargetId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a character..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {characters.map(char => (
                                            <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </TabsContent>

                        <TabsContent value="campaign" className="mt-4">
                            {campsLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin" /></div>
                            ) : campaigns.length === 0 ? (
                                <div className="text-center text-sm text-muted-foreground p-4">No parties found.</div>
                            ) : (
                                <Select value={targetId} onValueChange={setTargetId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a party stach..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {campaigns.map(camp => (
                                            <SelectItem key={camp.id} value={camp.id}>{camp.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleAdd} disabled={!targetId || isAdding}>
                        {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <ShoppingBag className="w-4 h-4 mr-2" /> Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
