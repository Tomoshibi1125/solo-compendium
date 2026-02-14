import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase credentials not found in environment variables');
  console.log('Required: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyTestAccounts() {
  console.log('🔍 Verifying test accounts...');
  
  // Test player account
  console.log('\n📧 Testing player account (player@test.com)...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'player@test.com',
      password: 'testpassword123'
    });
    
    if (error) {
      console.log('❌ Player login failed:', error.message);
    } else {
      console.log('✅ Player account exists and login successful');
      console.log('   User ID:', data.user?.id);
      console.log('   Role:', data.user?.user_metadata?.role);
      
      // Sign out after verification
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.log('❌ Player account verification error:', err.message);
  }
  
  // Test DM account
  console.log('\n📧 Testing DM account (dm@test.com)...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'dm@test.com',
      password: 'testpassword123'
    });
    
    if (error) {
      console.log('❌ DM login failed:', error.message);
    } else {
      console.log('✅ DM account exists and login successful');
      console.log('   User ID:', data.user?.id);
      console.log('   Role:', data.user?.user_metadata?.role);
      
      // Sign out after verification
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.log('❌ DM account verification error:', err.message);
  }
  
  console.log('\n🎯 Verification complete!');
}

verifyTestAccounts().catch(console.error);
