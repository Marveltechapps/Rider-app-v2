# Icon Conversion Guide

## Current Status
✅ Icons have been downloaded from Figma as SVG files:
- `icon-call-button.svg` (66x66px)
- `icon-hub.svg` (49x49px)
- `icon-dispatch-bay.svg` (14x14px)

## Issue
React Native's `Image` component does not support SVG files directly. The icons need to be converted to PNG format.

## Solution Options

### Option 1: Export as PNG from Figma (Recommended)
1. Open Figma: https://www.figma.com/design/SkUi0997ZLBHlmE9s7KKU6/selorg--Final---12.09.24
2. Navigate to node-id: 13506-2241
3. Select each icon node:
   - Call Button: 13506:2264
   - Hub Icon: 13506:2244
   - Dispatch Bay: 13506:2256
4. Export as PNG:
   - Select the icon
   - Click Export in the right panel
   - Choose PNG format
   - Export at 1x, 2x, and 3x resolutions
   - Use naming: `icon-name.png`, `icon-name@2x.png`, `icon-name@3x.png`

### Option 2: Use Online Converter
1. Use tools like:
   - CloudConvert (https://cloudconvert.com/svg-to-png)
   - Convertio (https://convertio.co/svg-png/)
   - Online-Convert (https://image.online-convert.com/convert-to-png)
2. Upload the SVG files
3. Set resolution:
   - 1x: Original size (42x42, 49x49, 14x14)
   - 2x: Double size (84x84, 98x98, 28x28)
   - 3x: Triple size (126x126, 147x147, 42x42)
4. Download and place in `src/assets/orderDetails/`

### Option 3: Install SVG Transformer (Advanced)
If you want to use SVG files directly:

1. Install transformer:
```bash
npm install --save-dev react-native-svg-transformer
```

2. Update `metro.config.js`:
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
```

3. Then SVG files can be imported directly in components.

## File Structure After Conversion
```
src/assets/orderDetails/
├── icon-call-button.png
├── icon-call-button@2x.png
├── icon-call-button@3x.png
├── icon-hub.png
├── icon-hub@2x.png
├── icon-hub@3x.png
├── icon-dispatch-bay.png
├── icon-dispatch-bay@2x.png
└── icon-dispatch-bay@3x.png
```

## Current Implementation
The `OrderDetailsScreen.tsx` is currently configured to use the SVG files. Once converted to PNG, update the require paths:

```typescript
// Change from:
source={require('../assets/orderDetails/icon-call-button.svg')}

// To:
source={require('../assets/orderDetails/icon-call-button.png')}
```

## Notes
- PNG files will be larger in size but work immediately
- SVG files are smaller and scalable but require transformer setup
- For production, PNG with @2x and @3x is the most reliable approach

