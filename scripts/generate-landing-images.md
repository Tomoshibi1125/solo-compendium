# Generate High Detail Painterly Solo Leveling Landing Page Images

## Overview
This document provides prompts for generating high detail painterly Solo Leveling style images for the landing page using DALL-E 3.

## Image Prompts

### Hero Background Image
**Prompt:**
```
High detail painterly digital art, Solo Leveling style, dark fantasy aesthetic, 
epic cinematic composition. A vast shadow realm with swirling dark purple and blue 
energy, floating shadow particles, glowing gate portals in the distance, 
dramatic lighting with deep shadows and vibrant magical glows. The Supreme Deity's 
presence felt through ethereal divine energy. Post-apocalyptic Korean urban 
landscape partially visible through shadow mist. Highly detailed, painterly brush 
strokes, rich colors, atmospheric perspective, cinematic lighting, 4K quality, 
Solo Leveling manhwa art style.
```

### Feature Card Images

#### Shadow Compendium Card
**Prompt:**
```
High detail painterly Solo Leveling art, a massive ancient tome floating in 
shadow energy, glowing runes and symbols, dark purple and blue magical auras, 
shadow particles swirling around it, dramatic lighting, highly detailed, 
cinematic composition, Solo Leveling manhwa style.
```

#### Hunter Awakening Card
**Prompt:**
```
High detail painterly Solo Leveling art, a Hunter awakening with shadow energy, 
glowing System interface elements, shadow particles and dark purple energy 
swirling, dramatic pose, cinematic lighting, highly detailed, Solo Leveling 
manhwa style.
```

#### System's Tools Card
**Prompt:**
```
High detail painterly Solo Leveling art, floating gate portals and shadow 
weapons, dark fantasy aesthetic, glowing magical elements, shadow energy, 
dramatic lighting, highly detailed, cinematic composition, Solo Leveling 
manhwa style.
```

## Usage

1. Use DALL-E 3 API or ChatGPT to generate these images
2. Save images to `public/images/landing/` directory
3. Update `src/components/home/HeroSection.tsx` to use the generated images
4. Ensure images are optimized (WebP format recommended, max 500KB per image)

## Image Specifications

- **Format**: WebP or PNG
- **Resolution**: 1920x1080 minimum (hero), 800x600 (feature cards)
- **Size**: Max 500KB per image
- **Style**: High detail painterly, Solo Leveling manhwa aesthetic
- **Colors**: Dark fantasy palette - deep purples, blues, shadows, with vibrant magical glows

## Integration

After generating images, update the HeroSection component:

```tsx
// Hero background
backgroundImage: `url('/images/landing/hero-background.webp')`

// Feature cards
<img src="/images/landing/compendium-card.webp" alt="Shadow Compendium" />
```

