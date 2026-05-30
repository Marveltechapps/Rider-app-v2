# Order Details Screen Assets

This directory should contain all assets extracted from the Figma design for the Order Details screen.

## Required Assets

### Map Assets
- `bg-map.png` - Background map image (currently using `../acceptedOrder/bg-map.png`)
- `marker-hub.png` - Hub/store marker icon (currently using `../acceptedOrder/marker-hub.png`)
- `marker-rider.png` - Rider/current location marker (currently using `../acceptedOrder/marker-rider.png`)
- `dotted-line.png` - Dashed/dotted line connecting markers (optional, currently rendered programmatically)

### UI Elements
- `icon-back.png` - Back arrow icon (using BackArrowIcon component)
- `icon-location.png` - Location button icon (currently using `../acceptedOrder/icon-location.png`)
- `icon-call.png` - Call button icon (currently using `../acceptedOrder/icon-call.png`)
- `icon-dispatch-bay.png` - Dispatch bay icon (currently using `../acceptedOrder/icon-dispatch-bay.png`)
- `badge-eta.png` - ETA badge background (optional, currently styled programmatically)
- `handle-sheet.png` - Bottom sheet handle (currently using `../acceptedOrder/handle-sheet.png`)

## Current Implementation

The OrderDetailsScreen currently uses assets from `src/assets/acceptedOrder/` as they share similar design elements. 

To match the Figma design exactly:
1. Export all assets from Figma at 2x and 3x resolution
2. Place them in `src/assets/orderDetails/`
3. Update the `require()` paths in `OrderDetailsScreen.tsx` to point to the new assets

## Asset Naming Convention

- Use lowercase with hyphens: `icon-call.png`
- Include size/resolution if needed: `marker-hub@2x.png`, `marker-hub@3x.png`
- Be descriptive: `badge-eta.png` not `badge1.png`

## Notes

- The dashed route line is currently rendered programmatically using View components
- For a more accurate dashed line, consider using `react-native-svg` with a Path component
- All icons should be exported as PNG with transparent backgrounds
- Map background should match the exact dimensions from Figma

