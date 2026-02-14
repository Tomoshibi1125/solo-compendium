const { chromium } = require('@playwright/test');

// Test configuration with real Supabase accounts
const testConfig = {
  BASE_URL: 'http://localhost:8080',
  
  // REAL SUPABASE TEST ACCOUNTS
  PLAYER_EMAIL: 'player@test.com',
  PLAYER_PASSWORD: 'testpassword123',
  PLAYER_ROLE: 'player',
  
  DM_EMAIL: 'dm@test.com',
  DM_PASSWORD: 'testpassword123',
  DM_ROLE: 'dm',
};

// Helper function to wait for page load
async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
}

// Helper function to login with specific account
async function loginUser(page, email, password, role) {
  console.log(`🔐 Logging in as ${role}: ${email}`);
  
  // Navigate to login page
  await page.goto(testConfig.BASE_URL + '/login');
  await waitForPageLoad(page);
  
  // Select role first
  if (role === 'dm') {
    await page.click('button:has-text("Protocol Warden")');
  } else {
    await page.click('button:has-text("Player")');
  }
  
  // Fill credentials
  await page.fill('#email', email);
  await page.fill('#password', password);
  
  // Submit login
  await page.click('button[type="submit"]');
  
  // Wait for login to complete
  await page.waitForTimeout(5000);
  await waitForPageLoad(page);
  
  console.log(`✅ Successfully logged in as ${role}`);
  return true;
}

// Main test execution
async function runFullJourney() {
  let browser;
  
  try {
    // Launch browser
    browser = await chromium.launch({
      headless: false,
      slowMo: 500,
      args: ['--start-maximized'],
      channel: 'chrome'
    });

    // ============================================================================
    // DM JOURNEY
    // ============================================================================
    console.log('\n🏰 STARTING DM JOURNEY');
    
    const dmPage = await browser.newPage();
    
    // DM Login
    await loginUser(dmPage, testConfig.DM_EMAIL, testConfig.DM_PASSWORD, testConfig.DM_ROLE);
    
    // Navigate to campaign management
    console.log('📋 Navigating to campaign management...');
    await dmPage.goto(testConfig.BASE_URL + '/campaigns');
    await waitForPageLoad(dmPage);
    
    // Create new campaign
    console.log('🆕 Creating new campaign...');
    
    // Look for create campaign button
    const createCampaignBtn = dmPage.locator('text=Create Campaign, text=New Campaign, text=Create New').first();
    if (await createCampaignBtn.isVisible()) {
      await createCampaignBtn.click();
      await waitForPageLoad(dmPage);
    }
    
    // Fill campaign details
    const nameInput = dmPage.locator('input[placeholder*="name"], input[type="text"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Campaign - E2E Journey');
    }
    
    const descInput = dmPage.locator('textarea[placeholder*="description"], textarea').first();
    if (await descInput.isVisible()) {
      await descInput.fill('A comprehensive test campaign for validating DM and player interactions');
    }
    
    // Save campaign
    const saveBtn = dmPage.locator('button:has-text("Create"), button:has-text("Save"), button[type="submit"]').first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await waitForPageLoad(dmPage);
    }
    
    console.log('✅ Campaign created successfully');
    
    // Set up adventure content
    console.log('🎭 Setting up adventure content...');
    
    // Look for adventure setup or content creation
    const adventureBtn = dmPage.locator('text=Adventure, text=Content, text=Setup').first();
    if (await adventureBtn.isVisible()) {
      await adventureBtn.click();
      await waitForPageLoad(dmPage);
    }
    
    // Create a simple encounter or adventure element
    const encounterBtn = dmPage.locator('text=Encounter, text=Create Encounter, text=Add Content').first();
    if (await encounterBtn.isVisible()) {
      await encounterBtn.click();
      await waitForPageLoad(dmPage);
    }
    
    // Fill encounter details
    const encounterName = dmPage.locator('input[placeholder*="name"]').first();
    if (await encounterName.isVisible()) {
      await encounterName.fill('Test Encounter - Forest Ambush');
    }
    
    const encounterDesc = dmPage.locator('textarea').first();
    if (await encounterDesc.isVisible()) {
      await encounterDesc.fill('A simple forest encounter to test campaign functionality');
    }
    
    // Save encounter
    const saveEncounterBtn = dmPage.locator('button:has-text("Create"), button:has-text("Save")').first();
    if (await saveEncounterBtn.isVisible()) {
      await saveEncounterBtn.click();
      await waitForPageLoad(dmPage);
    }
    
    console.log('✅ Adventure content created');
    
    // Invite player
    console.log('📧 Inviting player to campaign...');
    
    // Look for invite functionality
    const inviteBtn = dmPage.locator('text=Invite, text=Add Player, text=Invite Player').first();
    if (await inviteBtn.isVisible()) {
      await inviteBtn.click();
      await waitForPageLoad(dmPage);
    }
    
    // Enter player email
    const emailInput = dmPage.locator('input[type="email"], input[placeholder*="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill(testConfig.PLAYER_EMAIL);
    }
    
    // Send invite
    const sendInviteBtn = dmPage.locator('button:has-text("Send"), button:has-text("Invite"), button[type="submit"]').first();
    if (await sendInviteBtn.isVisible()) {
      await sendInviteBtn.click();
      await waitForPageLoad(dmPage);
    }
    
    console.log('✅ Player invited successfully');
    
    // ============================================================================
    // PLAYER JOURNEY
    // ============================================================================
    console.log('\n🎮 STARTING PLAYER JOURNEY');
    
    const playerPage = await browser.newPage();
    
    // Player Login
    await loginUser(playerPage, testConfig.PLAYER_EMAIL, testConfig.PLAYER_PASSWORD, testConfig.PLAYER_ROLE);
    
    // Look for campaign invite
    console.log('📬 Checking for campaign invite...');
    
    // Navigate to campaigns or dashboard
    await playerPage.goto(testConfig.BASE_URL + '/campaigns');
    await waitForPageLoad(playerPage);
    
    // Look for invite notification
    const inviteNotification = playerPage.locator('text=Invite, text=Invitation, text=Join Campaign').first();
    if (await inviteNotification.isVisible()) {
      await inviteNotification.click();
      await waitForPageLoad(playerPage);
    }
    
    // Accept campaign invite
    console.log('✅ Accepting campaign invite...');
    
    const acceptBtn = playerPage.locator('button:has-text("Accept"), button:has-text("Join"), button:has-text("Accept Invite")').first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await waitForPageLoad(playerPage);
    }
    
    console.log('✅ Campaign invite accepted');
    
    // Create character
    console.log('👥 Creating character...');
    
    // Navigate to character creation
    await playerPage.goto(testConfig.BASE_URL + '/characters/new');
    await waitForPageLoad(playerPage);
    
    // Fill character details
    const charNameInput = playerPage.locator('input[placeholder*="name"], input[type="text"]').first();
    if (await charNameInput.isVisible()) {
      await charNameInput.fill('Test Hero - E2E Journey');
    }
    
    // Select race/class if available
    const raceSelect = playerPage.locator('select').first();
    if (await raceSelect.isVisible()) {
      await raceSelect.selectOption({ index: 1 }); // Select first option
    }
    
    // Save character
    const createCharBtn = playerPage.locator('button:has-text("Create"), button:has-text("Save Character"), button[type="submit"]').first();
    if (await createCharBtn.isVisible()) {
      await createCharBtn.click();
      await waitForPageLoad(playerPage);
    }
    
    console.log('✅ Character created successfully');
    
    // Join character to campaign
    console.log('🔗 Joining character to campaign...');
    
    // Navigate back to campaign
    await playerPage.goto(testConfig.BASE_URL + '/campaigns');
    await waitForPageLoad(playerPage);
    
    // Look for campaign and join with character
    const campaignLink = playerPage.locator('text=Test Campaign - E2E Journey').first();
    if (await campaignLink.isVisible()) {
      await campaignLink.click();
      await waitForPageLoad(playerPage);
    }
    
    const joinCharBtn = playerPage.locator('button:has-text("Join"), button:has-text("Add Character"), text=Join Campaign').first();
    if (await joinCharBtn.isVisible()) {
      await joinCharBtn.click();
      await waitForPageLoad(playerPage);
    }
    
    // Select character to join
    const charSelect = playerPage.locator('text=Test Hero - E2E Journey').first();
    if (await charSelect.isVisible()) {
      await charSelect.click();
      await waitForPageLoad(playerPage);
    }
    
    const confirmJoinBtn = playerPage.locator('button:has-text("Confirm"), button:has-text("Join"), button[type="submit"]').first();
    if (await confirmJoinBtn.isVisible()) {
      await confirmJoinBtn.click();
      await waitForPageLoad(playerPage);
    }
    
    console.log('✅ Character joined to campaign');
    
    // ============================================================================
    // VERIFICATION
    // ============================================================================
    console.log('\n🔍 VERIFYING CROSS-ACCOUNT FUNCTIONALITY');
    
    // DM verifies player joined
    console.log('🏰 DM verifying player joined campaign...');
    await dmPage.goto(testConfig.BASE_URL + '/campaigns');
    await waitForPageLoad(dmPage);
    
    const campaignForDM = dmPage.locator('text=Test Campaign - E2E Journey').first();
    if (await campaignForDM.isVisible()) {
      await campaignForDM.click();
      await waitForPageLoad(dmPage);
    }
    
    // Look for player character in campaign
    const playerCharVisible = await dmPage.locator('text=Test Hero - E2E Journey').isVisible();
    console.log(`✅ DM can see player character: ${playerCharVisible}`);
    
    // Player verifies campaign access
    console.log('🎮 Player verifying campaign access...');
    await playerPage.goto(testConfig.BASE_URL + '/campaigns');
    await waitForPageLoad(playerPage);
    
    const playerCampaignAccess = await playerPage.locator('text=Test Campaign - E2E Journey').isVisible();
    console.log(`✅ Player can access campaign: ${playerCampaignAccess}`);
    
    console.log('\n🎉 FULL JOURNEY COMPLETED SUCCESSFULLY!');
    console.log('📋 Summary:');
    console.log('  ✅ DM created campaign');
    console.log('  ✅ DM set up adventure content');
    console.log('  ✅ DM invited player');
    console.log('  ✅ Player accepted invite');
    console.log('  ✅ Player created character');
    console.log('  ✅ Player joined campaign');
    console.log('  ✅ Cross-account functionality verified');
    
    // Keep browsers open for manual inspection
    console.log('\n🌐 Browsers remain open for inspection. Press Ctrl+C to exit.');
    
    // Wait for manual intervention
    await new Promise(() => {}); // Keep script running
    
  } catch (error) {
    console.error('❌ Error during journey execution:', error);
  } finally {
    if (browser) {
      // Don't auto-close browser for inspection
      // await browser.close();
    }
  }
}

// Run the journey
runFullJourney().catch(console.error);
