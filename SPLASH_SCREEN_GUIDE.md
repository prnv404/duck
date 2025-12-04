# Custom Splash Screen Guide for Duck Learning App

## Design Philosophy
The splash screen follows our app's design philosophy:
- **Primary Colors**: Emerald Green (#10b981) and Violet (#8B5CF6)
- **Background**: Light Blue (#E6F4FE) for light mode, Dark (#0a0a0a) for dark mode
- **Typography**: Nunito font family (Bold/ExtraBold)
- **Style**: Clean, modern, educational, and friendly

## Current Configuration

The splash screen is configured in `app.json`:

### Android-Specific Splash
```json
"android": {
  "splash": {
    "image": "./assets/images/splash-icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#E6F4FE",
    "dark": {
      "image": "./assets/images/splash-icon.png",
      "backgroundColor": "#0a0a0a"
    }
  }
}
```

## Creating Custom Splash Screen Assets

### Required Sizes for Android

1. **splash-icon.png** (Main splash image)
   - Recommended size: 1284x1284px (square)
   - Format: PNG with transparency
   - Design: Duck logo with educational elements

### Design Recommendations

1. **Logo Design**:
   - Center the duck mascot
   - Add subtle educational icons (books, stars, graduation cap)
   - Use gradient from #10b981 to #8B5CF6 for accent elements
   - Keep it simple and recognizable

2. **Color Scheme**:
   - Light mode background: #E6F4FE (soft blue)
   - Dark mode background: #0a0a0a (near black)
   - Primary accent: #10b981 (emerald green)
   - Secondary accent: #8B5CF6 (violet)

3. **Typography** (if adding text):
   - Font: Nunito ExtraBold or Black
   - App name: "Duck Learning" or just "Duck"
   - Tagline (optional): "Learn Smarter, Not Harder"

## Generating Splash Screen Assets

### Using Figma/Design Tool:
1. Create a 1284x1284px canvas
2. Design your splash screen
3. Export as PNG with transparency
4. Save to `duck/assets/images/splash-icon.png`

### Using Online Tools:
- [Figma](https://figma.com) - Professional design tool
- [Canva](https://canva.com) - Easy-to-use design tool
- [App Icon Generator](https://appicon.co/) - Generate all sizes

## Rebuilding After Changes

After updating splash screen assets:

```bash
# Navigate to duck directory
cd duck

# Clear cache
npx expo start -c

# For Android build
npx expo prebuild --clean
eas build --platform android
```

## Testing

1. **Development**:
   ```bash
   npx expo start
   # Press 'a' for Android
   ```

2. **Production Build**:
   ```bash
   eas build --platform android --profile preview
   ```

## Animated Splash Screen (Optional)

For a more engaging experience, we've created an animated splash screen component in `src/components/AnimatedSplashScreen.tsx` that shows:
- Fade-in duck logo
- Bouncing animation
- Progress indicator
- Smooth transition to app

This is automatically shown while fonts and assets are loading.

## Notes

- The splash screen shows while the app is initializing
- Keep the design simple for fast loading
- Ensure good contrast for both light and dark modes
- Test on multiple Android devices for consistency
- The splash screen is controlled by `expo-splash-screen` plugin
