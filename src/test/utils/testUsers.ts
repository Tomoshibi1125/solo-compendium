import { supabase } from "@/integrations/supabase/client";

/**
 * Test user utilities for development and testing
 * These helpers create and authenticate test accounts for development purposes
 */

// Test user credentials
const TEST_USERS = {
	WARDEN: {
		email: "warden@test.com",
		password: "test1234",
		role: "warden",
		displayName: "Test Warden",
	},
	ASCENDANT: {
		email: "ascendant@test.com",
		password: "test1234",
		role: "ascendant",
		displayName: "Test Ascendant",
	},
} as const;

/**
 * Create test users in Supabase for development/testing
 */
export async function createTestUsers() {
	try {
		// Create Warden user
		const { data: wardenData, error: wardenError } = await supabase.auth.signUp(
			{
				email: TEST_USERS.WARDEN.email,
				password: TEST_USERS.WARDEN.password,
				options: {
					data: {
						role: TEST_USERS.WARDEN.role,
						display_name: TEST_USERS.WARDEN.displayName,
					},
				},
			},
		);

		if (wardenError) {
			console.error("Warden user creation error:", wardenError);
		}

		// Create Ascendant user
		const { data: ascendantData, error: ascendantError } =
			await supabase.auth.signUp({
				email: TEST_USERS.ASCENDANT.email,
				password: TEST_USERS.ASCENDANT.password,
				options: {
					data: {
						role: TEST_USERS.ASCENDANT.role,
						display_name: TEST_USERS.ASCENDANT.displayName,
					},
				},
			});

		if (ascendantError) {
			console.error("Ascendant user creation error:", ascendantError);
		}

		return { wardenData, ascendantData, wardenError, ascendantError };
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

	// Test Warden login
	const wardenLoginResult = await authenticateTestUser("WARDEN");

	// Test Ascendant login
	const ascendantLoginResult = await authenticateTestUser("ASCENDANT");

	return {
		createResult,
		wardenLoginResult,
		ascendantLoginResult,
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
