import { supabase } from "@/integrations/supabase/client";

/**
 * Test user utilities for development and testing
 * These helpers create and authenticate test accounts for development purposes
 */

// Test user credentials
const TEST_USERS = {
	DM: {
		email: "dm@test.com",
		password: "test1234",
		role: "dm",
		displayName: "Test DM",
	},
	PLAYER: {
		email: "player@test.com",
		password: "test1234",
		role: "player",
		displayName: "Test Player",
	},
} as const;

/**
 * Create test users in Supabase for development/testing
 */
export async function createTestUsers() {
	try {
		// Create DM user
		const { data: dmData, error: dmError } = await supabase.auth.signUp({
			email: TEST_USERS.DM.email,
			password: TEST_USERS.DM.password,
			options: {
				data: {
					role: TEST_USERS.DM.role,
					display_name: TEST_USERS.DM.displayName,
				},
			},
		});

		if (dmError) {
			console.error("DM user creation error:", dmError);
		}

		// Create Player user
		const { data: playerData, error: playerError } = await supabase.auth.signUp(
			{
				email: TEST_USERS.PLAYER.email,
				password: TEST_USERS.PLAYER.password,
				options: {
					data: {
						role: TEST_USERS.PLAYER.role,
						display_name: TEST_USERS.PLAYER.displayName,
					},
				},
			},
		);

		if (playerError) {
			console.error("Player user creation error:", playerError);
		}

		return { dmData, playerData, dmError, playerError };
	} catch (error) {
		console.error("Test user creation failed:", error);
		return { error };
	}
}

/**
 * Authenticate test user
 */
export async function authenticateTestUser(userType: keyof typeof TEST_USERS) {
	const user = TEST_USERS[userType];

	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: user.email,
			password: user.password,
		});

		if (error) {
			console.error(`${userType} login error:`, error);
			return { error };
		}

		return { data };
	} catch (error) {
		console.error(`${userType} login failed:`, error);
		return { error };
	}
}

/**
 * Setup test accounts and authenticate both users
 */
export async function setupTestAccounts() {
	// First create the users
	const createResult = await createTestUsers();

	// Wait a moment for users to be created
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Test DM login
	const dmLoginResult = await authenticateTestUser("DM");

	// Test Player login
	const playerLoginResult = await authenticateTestUser("PLAYER");

	return {
		createResult,
		dmLoginResult,
		playerLoginResult,
	};
}

/**
 * Clean up test users (for teardown)
 */
export async function cleanupTestUsers() {
	try {
		// Sign out current user
		await supabase.auth.signOut();

		// Note: Supabase doesn't provide a direct way to delete users via client-side
		// This would need to be done via admin API or server-side function
		console.log("Test users cleanup completed (sign out only)");
	} catch (error) {
		console.error("Test users cleanup failed:", error);
	}
}
