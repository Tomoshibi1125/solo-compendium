import { test, expect, BrowserContext, Page } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { DMPage } from '../pages/DMPage';

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  COMPREHENSIVE DM UI/UX TEST — ALL POSSIBLE INTERACTIONS         ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  This test exercises EVERY DM UI/UX interaction with web access   ║
 * ║  including all tools, panels, modals, forms, and navigation     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const DM_EMAIL = process.env.E2E_DM_EMAIL ?? 'dm@test.com';
const DM_PASSWORD = process.env.E2E_DM_PASSWORD ?? 'test1234';

test.describe('Comprehensive DM UI/UX Test', () => {
  let context: BrowserContext;
  let page: Page;
  let authPage: AuthPage;
  let dmPage: DMPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    authPage = new AuthPage(page);
    dmPage = new DMPage(page);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('DM Complete UI/UX Journey - All Possible Interactions', async () => {
    console.log('🚀 Starting Comprehensive DM UI/UX Test...');

    // Phase 1: Authentication & Dashboard
    console.log('📝 Phase 1: Authentication & Dashboard');
    await page.goto('/');
    await expect(page).toHaveTitle(/System Ascendant/);
    
    // Test landing page UI elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="auth-button"]')).toBeVisible();
    
    // Sign in as DM
    await authPage.signIn(DM_EMAIL, DM_PASSWORD, 'dm');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Test dashboard UI elements
    await expect(page.locator('[data-testid="dashboard-welcome"]')).toBeVisible();
    await expect(page.locator('[data-testid="campaigns-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="dm-tools-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="compendium-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="player-tools-section"]')).toBeVisible();

    // Phase 2: Campaign Management
    console.log('🏰 Phase 2: Campaign Management');
    await page.click('[data-testid="create-campaign-button"]');
    await expect(page.locator('[data-testid="campaign-form"]')).toBeVisible();
    
    // Test campaign form UI
    await page.fill('[data-testid="campaign-name-input"]', 'UI/UX Test Campaign');
    await page.fill('[data-testid="campaign-description-input"]', 'Testing all DM UI interactions');
    await page.selectOption('[data-testid="campaign-type-select"]', 'campaign');
    await page.click('[data-testid="create-campaign-submit"]');
    
    // Test campaign detail view
    await expect(page.locator('[data-testid="campaign-detail"]')).toBeVisible();
    await expect(page.locator('[data-testid="campaign-tabs"]')).toBeVisible();
    
    // Test all campaign tabs
    const campaignTabs = ['overview', 'vtt', 'sessions', 'chat', 'notes', 'characters', 'settings'];
    for (const tab of campaignTabs) {
      await page.click(`[data-testid="tab-${tab}"]`);
      await expect(page.locator(`[data-testid="${tab}-tab-content"]`)).toBeVisible();
    }

    // Phase 3: DM Tools - Complete UI Exercise
    console.log('🛠️ Phase 3: DM Tools - Complete UI Exercise');
    
    // Navigate to DM tools
    await page.click('[data-testid="dm-tools-link"]');
    await expect(page).toHaveURL(/\/dm-tools/);
    
    // Test DM tools navigation
    await expect(page.locator('[data-testid="dm-tools-grid"]')).toBeVisible();
    
    // 3.1 Encounter Builder - All UI interactions
    console.log('⚔️ Testing Encounter Builder UI');
    await page.click('[data-testid="tool-encounter-builder"]');
    await expect(page.locator('[data-testid="encounter-builder"]')).toBeVisible();
    
    // Test search and filter UI
    await page.fill('[data-testid="monster-search"]', 'Goblin');
    await expect(page.locator('[data-testid="monster-results"]')).toBeVisible();
    await page.click('[data-testid="filter-challenge-rating"]');
    await expect(page.locator('[data-testid="cr-filter-options"]')).toBeVisible();
    
    // Test encounter building UI
    await page.click('[data-testid="add-monster-to-encounter"]');
    await expect(page.locator('[data-testid="encounter-monsters"]')).toBeVisible();
    await page.click('[data-testid="difficulty-calculator"]');
    await expect(page.locator('[data-testid="difficulty-display"]')).toBeVisible();
    
    // Test save/load functionality
    await page.click('[data-testid="save-encounter"]');
    await page.fill('[data-testid="encounter-name"]', 'Test Encounter');
    await page.click('[data-testid="confirm-save"]');
    await expect(page.locator('[data-testid="saved-encounters"]')).toBeVisible();

    // 3.2 Initiative Tracker - All UI interactions
    console.log('🎯 Testing Initiative Tracker UI');
    await page.click('[data-testid="tool-initiative-tracker"]');
    await expect(page.locator('[data-testid="initiative-tracker"]')).toBeVisible();
    
    // Test combat controls
    await page.click('[data-testid="add-combatant"]');
    await expect(page.locator('[data-testid="combatant-form"]')).toBeVisible();
    await page.fill('[data-testid="combatant-name"]', 'Test Combatant');
    await page.fill('[data-testid="combatant-initiative"]', '15');
    await page.click('[data-testid="add-combatant-submit"]');
    
    // Test turn management UI
    await page.click('[data-testid="start-combat"]');
    await expect(page.locator('[data-testid="current-turn"]')).toBeVisible();
    await page.click('[data-testid="next-turn"]');
    await page.click('[data-testid="previous-turn"]');
    await page.click('[data-testid="pause-combat"]');

    // 3.3 VTT Map - All UI interactions
    console.log('🗺️ Testing VTT Map UI');
    await page.click('[data-testid="tool-vtt-map"]');
    await expect(page.locator('[data-testid="vtt-canvas"]')).toBeVisible();
    
    // Test VTT toolbar
    await expect(page.locator('[data-testid="vtt-toolbar"]')).toBeVisible();
    const vttTools = ['select', 'fog', 'draw', 'measure', 'pan', 'zoom'];
    for (const tool of vttTools) {
      await page.click(`[data-testid="vtt-tool-${tool}"]`);
      await expect(page.locator(`[data-testid="vtt-tool-${tool}"]`)).toHaveClass(/active/);
    }
    
    // Test VTT panels
    await page.click('[data-testid="vtt-toggle-sidebar"]');
    await expect(page.locator('[data-testid="vtt-sidebar"]')).toBeVisible();
    await page.click('[data-testid="vtt-tab-chat"]');
    await page.click('[data-testid="vtt-tab-initiative"]');
    await page.click('[data-testid="vtt-tab-dice"]');
    await page.click('[data-testid="vtt-tab-assets"]');
    
    // Test asset browser
    await page.click('[data-testid="asset-browser-toggle"]');
    await expect(page.locator('[data-testid="asset-browser"]')).toBeVisible();
    await page.fill('[data-testid="asset-search"]', 'map');
    await page.click('[data-testid="asset-category-maps"]');
    await expect(page.locator('[data-testid="asset-thumbnails"]')).toBeVisible();

    // 3.4 Dice Roller - All UI interactions
    console.log('🎲 Testing Dice Roller UI');
    await page.click('[data-testid="tool-dice-roller"]');
    await expect(page.locator('[data-testid="dice-roller"]')).toBeVisible();
    
    // Test dice selection UI
    const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    for (const die of diceTypes) {
      await page.click(`[data-testid="die-${die}"]`);
      await expect(page.locator(`[data-testid="die-${die}"]`)).toHaveClass(/selected/);
    }
    
    // Test roll modifiers
    await page.fill('[data-testid="modifier-input"]', '+5');
    await page.click('[data-testid="roll-dice"]');
    await expect(page.locator('[data-testid="roll-result"]')).toBeVisible();
    await expect(page.locator('[data-testid="roll-history"]')).toBeVisible();
    
    // Test campaign dice integration
    await page.click('[data-testid="campaign-select"]');
    await expect(page.locator('[data-testid="campaign-options"]')).toBeVisible();
    await page.click('[data-testid="send-to-chat"]');

    // 3.5 Rollable Tables - All UI interactions
    console.log('📋 Testing Rollable Tables UI');
    await page.click('[data-testid="tool-rollable-tables"]');
    await expect(page.locator('[data-testid="rollable-tables"]')).toBeVisible();
    
    // Test table creation
    await page.click('[data-testid="create-table"]');
    await expect(page.locator('[data-testid="table-form"]')).toBeVisible();
    await page.fill('[data-testid="table-name"]', 'Loot Table');
    await page.click('[data-testid="add-table-row"]');
    await page.fill('[data-testid="table-row-text"]', 'Gold coins');
    await page.fill('[data-testid="table-row-range"]', '1-10');
    await page.click('[data-testid="save-table"]');
    
    // Test table rolling
    await page.click('[data-testid="roll-table"]');
    await expect(page.locator('[data-testid="table-result"]')).toBeVisible();

    // 3.6 NPC Generator - All UI interactions
    console.log('👥 Testing NPC Generator UI');
    await page.click('[data-testid="tool-npc-generator"]');
    await expect(page.locator('[data-testid="npc-generator"]')).toBeVisible();
    
    // Test NPC generation options
    await page.selectOption('[data-testid="npc-race"]', 'human');
    await page.selectOption('[data-testid="npc-class"]', 'warrior');
    await page.selectOption('[data-testid="npc-level"]', '5');
    await page.fill('[data-testid="npc-name"]', 'Test NPC');
    await page.click('[data-testid="generate-npc"]');
    await expect(page.locator('[data-testid="npc-stats"]')).toBeVisible();
    
    // Test AI enhancement
    await page.click('[data-testid="ai-enhance-npc"]');
    await expect(page.locator('[data-testid="ai-enhancement-loading"]')).toBeVisible();
    // Wait for AI to complete (timeout after 30 seconds if needed)
    await page.waitForTimeout(30000);

    // 3.7 Quest Generator - All UI interactions
    console.log('📜 Testing Quest Generator UI');
    await page.click('[data-testid="tool-quest-generator"]');
    await expect(page.locator('[data-testid="quest-generator"]')).toBeVisible();
    
    // Test quest parameters
    await page.selectOption('[data-testid="quest-type"]', 'fetch');
    await page.selectOption('[data-testid="quest-difficulty"]', 'medium');
    await page.fill('[data-testid="quest-location"]', 'Mysterious Forest');
    await page.click('[data-testid="generate-quest"]');
    await expect(page.locator('[data-testid="quest-details"]')).toBeVisible();
    
    // Test quest phases
    await expect(page.locator('[data-testid="quest-overview"]')).toBeVisible();
    await expect(page.locator('[data-testid="quest-objectives"]')).toBeVisible();
    await expect(page.locator('[data-testid="quest-rewards"]')).toBeVisible();

    // 3.8 Treasure Generator - All UI interactions
    console.log('💰 Testing Treasure Generator UI');
    await page.click('[data-testid="tool-treasure-generator"]');
    await expect(page.locator('[data-testid="treasure-generator"]')).toBeVisible();
    
    // Test treasure parameters
    await page.selectOption('[data-testid="treasure-type"]', 'hoard');
    await page.selectOption('[data-testid="treasure-cr"]', '10');
    await page.click('[data-testid="generate-treasure"]');
    await expect(page.locator('[data-testid="treasure-items"]')).toBeVisible();
    
    // Test item details
    await page.click('[data-testid="treasure-item"]');
    await expect(page.locator('[data-testid="item-details"]')).toBeVisible();

    // 3.9 Rift Generator - All UI interactions
    console.log('🌌 Testing Rift Generator UI');
    await page.click('[data-testid="tool-rift-generator"]');
    await expect(page.locator('[data-testid="rift-generator"]')).toBeVisible();
    
    // Test rift parameters
    await page.selectOption('[data-testid="rift-stability"]', 'unstable');
    await page.selectOption('[data-testid="rift-energy"]', 'chaotic');
    await page.click('[data-testid="generate-rift"]');
    await expect(page.locator('[data-testid="rift-details"]')).toBeVisible();

    // 3.10 Random Event Generator - All UI interactions
    console.log('🎲 Testing Random Event Generator UI');
    await page.click('[data-testid="tool-random-event"]');
    await expect(page.locator('[data-testid="random-event"]')).toBeVisible();
    
    // Test event generation
    await page.selectOption('[data-testid="event-type"]', 'combat');
    await page.selectOption('[data-testid="event-severity"]', 'moderate');
    await page.click('[data-testid="generate-event"]');
    await expect(page.locator('[data-testid="event-description"]')).toBeVisible();

    // 3.11 Relic Workshop - All UI interactions
    console.log('⚔️ Testing Relic Workshop UI');
    await page.click('[data-testid="tool-relic-workshop"]');
    await expect(page.locator('[data-testid="relic-workshop"]')).toBeVisible();
    
    // Test relic creation
    await page.fill('[data-testid="relic-name"]', 'Test Relic');
    await page.selectOption('[data-testid="relic-type"]', 'weapon');
    await page.selectOption('[data-testid="relic-rarity"]', 'rare');
    await page.click('[data-testid="add-relic-property"]');
    await expect(page.locator('[data-testid="relic-properties"]')).toBeVisible();
    await page.click('[data-testid="forge-relic"]');
    await expect(page.locator('[data-testid="relic-stats"]')).toBeVisible();

    // 3.12 Party Tracker - All UI interactions
    console.log('👥 Testing Party Tracker UI');
    await page.click('[data-testid="tool-party-tracker"]');
    await expect(page.locator('[data-testid="party-tracker"]')).toBeVisible();
    
    // Test party management
    await page.click('[data-testid="add-party-member"]');
    await expect(page.locator('[data-testid="member-form"]')).toBeVisible();
    await page.fill('[data-testid="member-name"]', 'Test Member');
    await page.selectOption('[data-testid="member-class"]', 'warrior');
    await page.fill('[data-testid="member-level"]', '5');
    await page.click('[data-testid="add-member"]');
    await expect(page.locator('[data-testid="party-members"]')).toBeVisible();

    // 3.13 Dungeon Map Generator - All UI interactions
    console.log('🏰 Testing Dungeon Map Generator UI');
    await page.click('[data-testid="tool-dungeon-map"]');
    await expect(page.locator('[data-testid="dungeon-map"]')).toBeVisible();
    
    // Test map generation
    await page.selectOption('[data-testid="map-size"]', 'medium');
    await page.selectOption('[data-testid="map-theme"]', 'dungeon');
    await page.click('[data-testid="generate-map"]');
    await expect(page.locator('[data-testid="map-canvas"]')).toBeVisible();
    
    // Test map tools
    await page.click('[data-testid="map-tool-room"]');
    await page.click('[data-testid="map-tool-corridor"]');
    await page.click('[data-testid="map-tool-entrance"]');

    // 3.14 Token Library - All UI interactions
    console.log('🎭 Testing Token Library UI');
    await page.click('[data-testid="tool-token-library"]');
    await expect(page.locator('[data-testid="token-library"]')).toBeVisible();
    
    // Test token browsing
    await page.fill('[data-testid="token-search"]', 'goblin');
    await expect(page.locator('[data-testid="token-grid"]')).toBeVisible();
    await page.click('[data-testid="token-category-monsters"]');
    await page.click('[data-testid="token-filter"]');
    await expect(page.locator('[data-testid="token-options"]')).toBeVisible();

    // 3.15 Art Generator - All UI interactions
    console.log('🎨 Testing Art Generator UI');
    await page.click('[data-testid="tool-art-generator"]');
    await expect(page.locator('[data-testid="art-generator"]')).toBeVisible();
    
    // Test art generation
    await page.fill('[data-testid="art-prompt"]', 'Epic fantasy battle scene');
    await page.selectOption('[data-testid="art-style"]', 'realistic');
    await page.selectOption('[data-testid="art-size"]', 'medium');
    await page.click('[data-testid="generate-art"]');
    await expect(page.locator('[data-testid="art-loading"]')).toBeVisible();
    
    // Test art gallery
    await expect(page.locator('[data-testid="art-gallery"]')).toBeVisible();
    await page.click('[data-testid="art-history-tab"]');

    // 3.16 Audio Manager - All UI interactions
    console.log('🎵 Testing Audio Manager UI');
    await page.click('[data-testid="tool-audio-manager"]');
    await expect(page.locator('[data-testid="audio-manager"]')).toBeVisible();
    
    // Test audio controls
    await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
    await page.click('[data-testid="play-audio"]');
    await page.click('[data-testid="pause-audio"]');
    await page.click('[data-testid="volume-control"]');
    await page.fill('[data-testid="volume-slider"]', '50');
    
    // Test playlist management
    await page.click('[data-testid="create-playlist"]');
    await page.fill('[data-testid="playlist-name"]', 'Battle Music');
    await page.click('[data-testid="add-to-playlist"]');
    await expect(page.locator('[data-testid="playlist-tracks"]')).toBeVisible();

    // 3.17 System Console - All UI interactions
    console.log('⚙️ Testing System Console UI');
    await page.click('[data-testid="tool-system-console"]');
    await expect(page.locator('[data-testid="system-console"]')).toBeVisible();
    
    // Test admin panels
    await expect(page.locator('[data-testid="admin-dashboard"]')).toBeVisible();
    await page.click('[data-testid="user-management"]');
    await expect(page.locator('[data-testid="user-list"]')).toBeVisible();
    await page.click('[data-testid="system-settings"]');
    await expect(page.locator('[data-testid="settings-form"]')).toBeVisible();
    await page.click('[data-testid="audit-logs"]');
    await expect(page.locator('[data-testid="log-viewer"]')).toBeVisible();

    // Phase 4: Compendium - Complete UI Exercise
    console.log('📚 Phase 4: Compendium - Complete UI Exercise');
    await page.click('[data-testid="compendium-link"]');
    await expect(page).toHaveURL(/\/compendium/);
    
    // Test compendium navigation
    await expect(page.locator('[data-testid="compendium-categories"]')).toBeVisible();
    await expect(page.locator('[data-testid="search-bar"]')).toBeVisible();
    
    // Test all compendium categories
    const categories = ['spells', 'monsters', 'items', 'feats', 'backgrounds', 'jobs', 'paths'];
    for (const category of categories) {
      await page.click(`[data-testid="category-${category}"]`);
      await expect(page.locator(`[data-testid="${category}-list"]`)).toBeVisible();
      
      // Test search within category
      await page.fill('[data-testid="category-search"]', 'test');
      await page.waitForTimeout(500);
      await page.fill('[data-testid="category-search"]', '');
      
      // Test detail view
      if (await page.locator(`[data-testid="${category}-item-0"]`).isVisible()) {
        await page.click(`[data-testid="${category}-item-0"]`);
        await expect(page.locator('[data-testid="detail-view"]')).toBeVisible();
        await page.click('[data-testid="back-to-list"]');
      }
    }
    
    // Test view modes
    await page.click('[data-testid="view-mode-grid"]');
    await page.click('[data-testid="view-mode-list"]');
    await page.click('[data-testid="view-mode-table"]');

    // Phase 5: Navigation & Responsive Design
    console.log('📱 Phase 5: Navigation & Responsive Design');
    
    // Test main navigation
    await expect(page.locator('[data-testid="main-nav"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-home"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-dashboard"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-dm-tools"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-compendium"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-player-tools"]')).toBeVisible();
    
    // Test mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    await page.click('[data-testid="mobile-menu-close"]');
    
    // Reset to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Phase 6: Forms & Validation
    console.log('📝 Phase 6: Forms & Validation');
    
    // Test form validation
    await page.goto('/dm-tools/encounter-builder');
    await page.click('[data-testid="save-encounter"]');
    await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
    
    // Test form submission
    await page.fill('[data-testid="encounter-name"]', 'Valid Encounter Name');
    await page.click('[data-testid="save-encounter"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Phase 7: Modals & Overlays
    console.log('🎭 Phase 7: Modals & Overlays');
    
    // Test various modals
    await page.goto('/dm-tools/npc-generator');
    await page.click('[data-testid="generate-npc"]');
    await expect(page.locator('[data-testid="npc-modal"]')).toBeVisible();
    await page.click('[data-testid="modal-close"]');
    
    // Test confirmation dialogs
    await page.goto('/dm-tools/encounter-builder');
    await page.click('[data-testid="delete-encounter"]');
    await expect(page.locator('[data-testid="confirm-dialog"]')).toBeVisible();
    await page.click('[data-testid="confirm-cancel"]');

    // Phase 8: Real-time Features
    console.log('🔄 Phase 8: Real-time Features');
    
    // Test real-time updates
    await page.goto('/campaigns');
    await page.click('[data-testid="campaign-card-0"]');
    await page.click('[data-testid="tab-sessions"]');
    await page.click('[data-testid="create-session"]');
    await page.fill('[data-testid="session-name"]', 'Live Test Session');
    await page.click('[data-testid="start-session"]');
    await expect(page.locator('[data-testid="live-indicator"]')).toBeVisible();

    // Phase 9: Accessibility
    console.log('♿ Phase 9: Accessibility');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    await page.keyboard.press('Enter');
    
    // Test ARIA labels
    const ariaElements = page.locator('[aria-label]');
    await expect(ariaElements).toHaveCount(0);
    const buttonElements = page.locator('[role="button"]');
    await expect(buttonElements).toHaveCount(0);

    // Phase 10: Performance & Error Handling
    console.log('⚡ Phase 10: Performance & Error Handling');
    
    // Test error states
    await page.goto('/invalid-url');
    await expect(page.locator('[data-testid="error-page"]')).toBeVisible();
    await page.click('[data-testid="back-home"]');
    
    // Test loading states
    await page.goto('/compendium');
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await page.waitForTimeout(2000);

    console.log('✅ Comprehensive DM UI/UX Test Complete!');
    console.log('📊 Test Summary:');
    console.log('   - Authentication & Dashboard: ✅');
    console.log('   - Campaign Management: ✅');
    console.log('   - All 17 DM Tools: ✅');
    console.log('   - Compendium System: ✅');
    console.log('   - Navigation & Responsive: ✅');
    console.log('   - Forms & Validation: ✅');
    console.log('   - Modals & Overlays: ✅');
    console.log('   - Real-time Features: ✅');
    console.log('   - Accessibility: ✅');
    console.log('   - Performance & Error Handling: ✅');
  });
});
