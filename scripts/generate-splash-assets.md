# Generate Splash Screen Assets

## Quick Start

### Option 1: Using Figma (Recommended)

1. **Open Figma** and create a new file
2. **Create Frame**: 1284x1284px (name it "Splash Screen")
3. **Design Elements**:
   ```
   Background: #E6F4FE (light) or #0a0a0a (dark)
   
   Center Circle:
   - Size: 240x240px
   - Background: White (#FFFFFF) with shadow
   - Shadow: 0px 8px 24px rgba(16, 185, 129, 0.3)
   
   Duck Icon:
   - Use MaterialCommunityIcons "duck" or custom duck illustration
   - Color: #10b981 (emerald green)
   - Size: 120x120px
   - Position: Center of circle
   
   App Name (Optional):
   - Font: Nunito Black
   - Size: 48px
   - Color: #0f172a (light) or #ffffff (dark)
   - Position: Below circle, 32px gap
   - Text: "Duck Learning"
   
   Tagline (Optional):
   - Font: Nunito SemiBold
   - Size: 18px
   - Color: #64748b (light) or #a3a3a3 (dark)
   - Position: Below app name, 8px gap
   - Text: "Learn Smarter, Not Harder"
   ```

4. **Export**:
   - Select the frame
   - Export as PNG
   - 1x scale (1284x1284px)
   - Save as `duck/assets/images/splash-icon.png`

### Option 2: Using Canva

1. Go to [Canva.com](https://canva.com)
2. Create custom size: 1284x1284px
3. Follow the design guidelines above
4. Download as PNG
5. Save to `duck/assets/images/splash-icon.png`

### Option 3: Using AI Image Generator

1. Use DALL-E, Midjourney, or similar
2. Prompt example:
   ```
   "A minimalist app splash screen with a cute duck mascot in emerald green (#10b981), 
   centered on a soft blue background (#E6F4FE), modern educational app design, 
   clean and friendly, flat design style, high quality"
   ```
3. Download and resize to 1284x1284px
4. Save to `duck/assets/images/splash-icon.png`

## Design Specifications

### Colors
- **Primary Green**: `#10b981` (Emerald)
- **Primary Purple**: `#8B5CF6` (Violet)
- **Light Background**: `#E6F4FE` (Soft Blue)
- **Dark Background**: `#0a0a0a` (Near Black)
- **Text Dark**: `#0f172a`
- **Text Light**: `#ffffff`
- **Text Muted**: `#64748b` (light) / `#a3a3a3` (dark)

### Typography
- **Font Family**: Nunito
- **Weights**: 
  - Regular (400)
  - SemiBold (600)
  - Bold (700)
  - ExtraBold (800)
  - Black (900)

### Layout
```
┌─────────────────────────────┐
│                             │
│                             │
│         ┌─────────┐         │
│         │         │         │
│         │  🦆     │         │  ← Duck Icon (120px)
│         │         │         │     in Circle (240px)
│         └─────────┘         │
│                             │
│      Duck Learning          │  ← App Name (48px)
│                             │
│  Learn Smarter, Not Harder  │  ← Tagline (18px)
│                             │
│                             │
└─────────────────────────────┘
     1284px x 1284px
```

## After Creating Assets

1. **Place the file**:
   ```bash
   # Ensure the file is at:
   duck/assets/images/splash-icon.png
   ```

2. **Clear cache and rebuild**:
   ```bash
   cd duck
   npx expo start -c
   ```

3. **Test on Android**:
   ```bash
   # Development
   npx expo run:android
   
   # Or press 'a' in the Expo CLI
   ```

4. **Build for production**:
   ```bash
   eas build --platform android --profile production
   ```

## Troubleshooting

### Splash screen not updating?
```bash
# Clear all caches
cd duck
rm -rf .expo
rm -rf node_modules/.cache
npx expo start -c
```

### Wrong colors showing?
- Check `app.json` configuration
- Verify `backgroundColor` matches your design
- Ensure PNG has correct transparency

### Image looks blurry?
- Ensure source image is at least 1284x1284px
- Export at 1x scale (not 2x or 3x)
- Use PNG format, not JPEG

## Advanced: Animated Splash

The app includes an animated splash screen component that shows while loading. To customize:

1. Edit `duck/src/components/AnimatedSplashScreen.tsx`
2. Modify animations, colors, or layout
3. Adjust timing in the `setTimeout` calls

## Resources

- [Expo Splash Screen Docs](https://docs.expo.dev/guides/splash-screens/)
- [Material Design Icons](https://materialdesignicons.com/)
- [Figma](https://figma.com)
- [Canva](https://canva.com)
- [Color Palette Tool](https://coolors.co/)
