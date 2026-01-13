/**
 * Create Fallback Art
 * Creates Fallback UI art assets when ComfyUI is not available
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Creating Fallback UI Art');
console.log('============================\n');

// UI Art assets to create
const UI_ART_ASSETS = [
  {
    name: 'landing-hero-banner.jpg',
    description: 'Hero banner for landing page featuring shadow energy and gates',
    width: 1920,
    height: 1080,
    color: '#1a1a2e'
  },
  {
    name: 'login-background.jpg',
    description: 'Background for login page with system interface styling',
    width: 1920,
    height: 1080,
    color: '#16213e'
  },
  {
    name: 'shadow-soldier-emblem.png',
    description: 'Emblem for shadow soldiers for 3D components',
    width: 512,
    height: 512,
    color: '#e94560'
  },
  {
    name: 'system-interface-icon.png',
    description: 'System interface icon for UI components',
    width: 256,
    height: 256,
    color: '#0f3460'
  },
  {
    name: 'gate-portal-banner.jpg',
    description: 'Gate portal banner for 3D scenes',
    width: 1920,
    height: 1080,
    color: '#533483'
  },
  {
    name: 'shadow-silhouette.png',
    description: 'Character silhouette for loading screens',
    width: 512,
    height: 512,
    color: '#2d3436'
  }
];

// Create Fallback directory
function createFallbackDir() {
  const outputDir = path.join(process.cwd(), 'public', 'generated', 'ui-art');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }
  return outputDir;
}

// Create SVG fallback
function createSVGFallback(width, height, color, name) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${name})"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">
    ${name.replace(/-/g, ' ').toUpperCase()}
  </text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dy=".3em" opacity="0.8">
    Solo Leveling Style
  </text>
</svg>`;
  return svg;
}

function replaceExtension(filePath, extension) {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}${extension}`);
}

// Create Fallback images
function createFallbackImages(outputDir) {
  let successCount = 0;
  
  UI_ART_ASSETS.forEach(asset => {
    try {
      const svgContent = createSVGFallback(asset.width, asset.height, asset.color, asset.name.replace(/\.[^/.]+$/, ''));
      const outputPath = path.join(outputDir, asset.name);
      
      // Save as SVG fallback
      fs.writeFileSync(replaceExtension(outputPath, '.svg'), svgContent);
      
      // Create a simple text file with info
      const infoContent = `# ${asset.name}
${asset.description}
Dimensions: ${asset.width}x${asset.height}
Style: Solo Leveling Dark Manhwa Anime
Status: Fallback - Replace with ComfyUI generated art

## Instructions
1. Start ComfyUI: run start-comfyui.bat
2. Load SDXL models
3. Generate art using Solo Leveling prompts
4. Replace this fallback asset with generated art
`;
      
      fs.writeFileSync(replaceExtension(outputPath, '.md'), infoContent);
      
      console.log(`✅ Created fallback asset: ${asset.name}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create fallback asset: ${asset.name}`);
    }
  });
  
  return successCount;
}

// Create compendium art Fallbacks
function createCompendiumFallbacks() {
  const compendiumDir = path.join(process.cwd(), 'public', 'generated', 'compendium');
  if (!fs.existsSync(compendiumDir)) {
    fs.mkdirSync(compendiumDir, { recursive: true });
  }
  
  const entityTypes = ['monsters', 'items', 'spells', 'locations', 'jobs', 'backgrounds'];
  let successCount = 0;
  
  entityTypes.forEach(entityType => {
    try {
      const entityDir = path.join(compendiumDir, entityType);
      if (!fs.existsSync(entityDir)) {
        fs.mkdirSync(entityDir, { recursive: true });
      }
      
      // Create Fallback info
      const infoContent = `# ${entityType} Art
Style: Solo Leveling Dark Manhwa Anime
Status: Fallback - Replace with ComfyUI generated art

## Instructions
1. Use the art generator in DM Tools
2. Select entity type: ${entityType}
3. Generate art with Solo Leveling styling
4. Save generated art to this directory
`;
      
      fs.writeFileSync(path.join(entityDir, 'README.md'), infoContent);
      console.log(`✅ Created Fallback directory: ${entityType}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create fallback asset: ${entityType}`);
    }
  });
  
  return successCount;
}

// Main function
function createAllFallbacks() {
  console.log('🎨 Creating Fallback art assets...\n');
  
  // Create UI art Fallbacks
  const uiDir = createFallbackDir();
  const uiSuccess = createFallbackImages(uiDir);
  
  // Create compendium Fallbacks
  const compendiumSuccess = createCompendiumFallbacks();
  
  console.log('\n📊 Fallback Creation Summary:');
  console.log(`✅ UI Art: ${uiSuccess}/${UI_ART_ASSETS.length}`);
  console.log(`✅ Compendium: ${compendiumSuccess}/6`);
  
  console.log('\n🎉 Fallback art created!');
  console.log('📁 Check public/generated/ for Fallback assets');
  console.log('\n📋 Fallback assets:');
  UI_ART_ASSETS.forEach(asset => {
    console.log(`  ✅ ${asset.name} - ${asset.description}`);
  });
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Start ComfyUI: run start-comfyui.bat');
  console.log('2. Load SDXL models');
  console.log('3. Generate art using the art generator');
  console.log('4. Replace Fallbacks with generated art');
  console.log('5. Test the complete art pipeline');
  
  console.log('\n💡 Note: These are SVG Fallbacks with Solo Leveling styling');
  console.log('   Replace them with actual ComfyUI generated art for production');
}

// Run the Fallback creation
createAllFallbacks().catch(console.error);


