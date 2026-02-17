import { supabase } from '@/integrations/supabase/client';

// Create test users in Supabase
export async function createTestUsers() {
  try {
    // Create DM user
    const { data: dmData, error: dmError } = await supabase.auth.signUp({
      email: 'dm@test.com',
      password: 'test1234',
      options: {
        data: {
          role: 'dm',
          display_name: 'Test DM'
        }
      }
    });

    if (dmError) {
      console.error('DM user creation error:', dmError);
    } else {
      console.log('DM user created:', dmData);
    }

    // Create Player user
    const { data: playerData, error: playerError } = await supabase.auth.signUp({
      email: 'player@test.com',
      password: 'test1234',
      options: {
        data: {
          role: 'player',
          display_name: 'Test Player'
        }
      }
    });

    if (playerError) {
      console.error('Player user creation error:', playerError);
    } else {
      console.log('Player user created:', playerData);
    }

    return { dmData, playerData, dmError, playerError };
  } catch (error) {
    console.error('Test user creation failed:', error);
    return { error };
  }
}

// Test login function
export async function testLogin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return { error };
    }

    console.log('Login successful:', data);
    return { data };
  } catch (error) {
    console.error('Login failed:', error);
    return { error };
  }
}

// Create users and test login
export async function setupTestAccounts() {
  console.log('Creating test users...');
  
  // First create the users
  const createResult = await createTestUsers();
  
  // Wait a moment for users to be created
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test DM login
  console.log('Testing DM login...');
  const dmLoginResult = await testLogin('dm@test.com', 'test1234');
  
  // Test Player login
  console.log('Testing Player login...');
  const playerLoginResult = await testLogin('player@test.com', 'test1234');
  
  return {
    createResult,
    dmLoginResult,
    playerLoginResult
  };
}
