const { chromium } = require('@playwright/test');

const testConfig = {
  BASE_URL: 'http://localhost:8080',
  PLAYER_EMAIL: 'player@test.com',
  PLAYER_PASSWORD: 'testpassword123',
  DM_EMAIL: 'dm@test.com',
  DM_PASSWORD: 'testpassword123',
};

async function waitForPageLoad(page) {
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('Page load timeout, continuing...');
  }
}

async function loginUser(page, email, password, role) {
  console.log(`🔐 Logging in as ${role}: ${email}`);
  
  try {
    await page.goto(testConfig.BASE_URL + '/login', { timeout: 15000 });
    await waitForPageLoad(page);
    
    // Select role
    if (role === 'dm') {
      await page.click('button:has-text("Protocol Warden")', { timeout: 5000 });
    } else {
      await page.click('button:has-text("Player")', { timeout: 5000 });
    }
    
    // Fill credentials
    await page.fill('#email', email, { timeout: 5000 });
    await page.fill('#password', password, { timeout: 5000 });
    
    // Submit
    await page.click('button[type="submit"]', { timeout: 5000 });
    
    // Wait for login
    await page.waitForTimeout(5000);
    await waitForPageLoad(page);
    
    console.log(`✅ Successfully logged in as ${role}`);
    return true;
  } catch (error) {
    console.error(`❌ Login failed for ${role}:`, error.message);
    return false;
  }
}

async function runJourney() {
  let browser;
  
  try {
    console.log('🚀 Starting browser...');
    browser = await chromium.launch({
      headless: false,
      slowMo: 300,
      args: ['--start-maximized'],
      channel: 'chrome'
    });

    // ============================================================================
    // DM JOURNEY
    // ============================================================================
    console.log('\n🏰 DM JOURNEY START');
    
    const dmPage = await browser.newPage();
    
    // DM Login
    const dmLoginSuccess = await loginUser(dmPage, testConfig.DM_EMAIL, testConfig.DM_PASSWORD, 'dm');
    if (!dmLoginSuccess) {
      throw new Error('DM login failed');
    }
    
    // Take screenshot to see what we're working with
    await dmPage.screenshot({ path: 'dm-dashboard.png' });
    console.log('📸 DM dashboard screenshot saved');
    
    // Try to find campaign management
    console.log('🔍 Looking for campaign management...');
    
    // Look for various possible campaign-related elements
    const campaignSelectors = [
      'text=Campaigns',
      'text=Campaign Management', 
      'text=Create Campaign',
      'text=New Campaign',
      'a[href*="campaign"]',
      'button:has-text("Campaign")'
    ];
    
    let campaignFound = false;
    for (const selector of campaignSelectors) {
      try {
        const element = dmPage.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 })) {
          console.log(`✅ Found campaign element: ${selector}`);
          await element.click();
          await waitForPageLoad(dmPage);
          campaignFound = true;
          break;
        }
      } catch (e) {
        // Continue trying next selector
      }
    }
    
    if (!campaignFound) {
      console.log('⚠️ Campaign management not found, checking page content...');
      const pageContent = await dmPage.content();
      console.log('Page contains:', pageContent.substring(0, 500));
    }
    
    // ============================================================================
    // PLAYER JOURNEY
    // ============================================================================
    console.log('\n🎮 PLAYER JOURNEY START');
    
    const playerPage = await browser.newPage();
    
    // Player Login
    const playerLoginSuccess = await loginUser(playerPage, testConfig.PLAYER_EMAIL, testConfig.PLAYER_PASSWORD, 'player');
    if (!playerLoginSuccess) {
      throw new Error('Player login failed');
    }
    
    // Take screenshot of player dashboard
    await playerPage.screenshot({ path: 'player-dashboard.png' });
    console.log('📸 Player dashboard screenshot saved');
    
    // Look for character creation
    console.log('🔍 Looking for character creation...');
    
    const charSelectors = [
      'text=Characters',
      'text=Create Character',
      'text=New Character',
      'a[href*="character"]',
      'button:has-text("Character")'
    ];
    
    for (const selector of charSelectors) {
      try {
        const element = playerPage.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 })) {
          console.log(`✅ Found character element: ${selector}`);
          await element.click();
          await waitForPageLoad(playerPage);
          break;
        }
      } catch (e) {
        // Continue trying next selector
      }
    }
    
    console.log('\n🎉 JOURNEY COMPLETED!');
    console.log('📋 Screenshots saved for inspection:');
    console.log('  - dm-dashboard.png');
    console.log('  - player-dashboard.png');
    
    // Keep browsers open for 30 seconds for inspection
    console.log('🌐 Keeping browsers open for 30 seconds...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('❌ Journey failed:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

// Run with timeout
Promise.race([
  runJourney(),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Journey timeout after 2 minutes')), 120000)
  )
]).catch(console.error);
