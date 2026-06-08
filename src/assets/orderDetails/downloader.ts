/**
 * Order Details Assets Downloader
 * This file lists all assets downloaded from Figma for the Order Details screen
 * 
 * Assets have been downloaded from Figma node-id: 13506-2241
 * Figma URL: https://www.figma.com/design/SkUi0997ZLBHlmE9s7KKU6/selorg--Final---12.09.24?node-id=13506-2241
 * 
 * Downloaded Assets:
 * - icon-call-button.svg (node: 13506:2264) - 66x66px
 * - icon-hub.svg (node: 13506:2244) - 49x49px  
 * - icon-dispatch-bay.svg (node: 13506:2256) - 14x14px
 * 
 * IMPORTANT: SVG Support
 * React Native's Image component doesn't support SVG files directly.
 * Options:
 * 1. Convert SVG to PNG (recommended for immediate use):
 *    - Export from Figma as PNG at 2x and 3x resolutions
 *    - Use @2x and @3x suffixes (e.g., icon-call-button@2x.png, icon-call-button@3x.png)
 * 
 * 2. Use react-native-svg-transformer (for SVG support):
 *    - Install: npm install --save-dev react-native-svg-transformer
 *    - Configure metro.config.js to handle SVG files
 *    - Then SVG files can be imported directly
 * 
 * 3. Create React Native SVG components:
 *    - Parse SVG content and create components using react-native-svg
 *    - More complex but allows dynamic styling
 */

export const OrderDetailsAssets = {
  // Icons downloaded from Figma node-id: 13506-2243 (Hub Info Section)
  hubIconContainer: {
    svg: require('./icon-hub-container.svg'),
    nodeId: '13506:2244',
    description: 'Hub/store icon container with green background',
    dimensions: { width: 49, height: 49 },
    backgroundColor: 'rgba(35, 114, 39, 0.1)',
    borderRadius: 14,
  },
  dispatchBayIcon: {
    svg: require('./icon-dispatch-bay-badge.svg'),
    nodeId: '13506:2256',
    description: 'Dispatch bay icon for badge',
    dimensions: { width: 14, height: 14 },
  },
  callButton: {
    svg: require('./icon-call-button-green.svg'),
    nodeId: '13506:2264',
    description: 'Green circular call button icon with shadow',
    dimensions: { width: 42, height: 42 },
    shadow: '0px 4px 6px -4px rgba(35, 114, 39, 0.2), 0px 10px 15px -3px rgba(35, 114, 39, 0.2)',
  },
  // Legacy icons (kept for reference)
  iconCallButton: {
    svg: require('./icon-call-button.svg'),
    nodeId: '13506:2264',
    description: 'Call button icon (legacy)',
    dimensions: { width: 66, height: 66 },
  },
  iconHub: {
    svg: require('./icon-hub.svg'),
    nodeId: '13506:2244',
    description: 'Hub icon (legacy)',
    dimensions: { width: 49, height: 49 },
  },
  iconDispatchBay: {
    svg: require('./icon-dispatch-bay.svg'),
    nodeId: '13506:2256',
    description: 'Dispatch bay icon (legacy)',
    dimensions: { width: 14, height: 14 },
  },
} as const;

/**
 * Asset paths for use in components
 * Note: SVG files require react-native-svg-transformer or conversion to PNG
 */
export const OrderDetailsAssetPaths = {
  // SVG Icons from Figma node 13506-2243 (Hub Info Section)
  hubIconContainer: './icon-hub-container.svg',
  dispatchBayBadge: './icon-dispatch-bay-badge.svg',
  callButtonGreen: './icon-call-button-green.svg',
  
  // Legacy SVG Icons (from previous download)
  iconCallButton: './icon-call-button.svg',
  iconHub: './icon-hub.svg',
  iconDispatchBay: './icon-dispatch-bay.svg',
  
  // Map Assets (shared with AcceptedOrderScreen)
  mapBackground: '../acceptedOrder/bg-map.png',
  markerHub: '../acceptedOrder/marker-hub.png',
  markerRider: '../acceptedOrder/marker-rider.png',
  iconLocation: '../acceptedOrder/icon-location.png',
  handleSheet: '../acceptedOrder/handle-sheet.png',
} as const;

/**
 * Instructions for downloading additional assets:
 * 
 * Hub Info Section Icons (from node 13506-2243):
 * 
 * 1. Hub Icon Container (13506:2244)
 *    - Format: SVG or PNG
 *    - Size: 49x49px (export at 2x: 98x98, 3x: 147x147)
 *    - Background: rgba(35, 114, 39, 0.1)
 *    - Border Radius: 14px
 *    - Location: src/assets/orderDetails/icon-hub-container.svg
 *    - ✅ Downloaded
 * 
 * 2. Dispatch Bay Badge Icon (13506:2256)
 *    - Format: SVG or PNG
 *    - Size: 14x14px (export at 2x: 28x28, 3x: 42x42)
 *    - Location: src/assets/orderDetails/icon-dispatch-bay-badge.svg
 *    - ✅ Downloaded
 * 
 * 3. Call Button (13506:2264)
 *    - Format: SVG or PNG
 *    - Size: 42x42px (export at 2x: 84x84, 3x: 126x126)
 *    - Background: #237227 (green)
 *    - Border Radius: 21px (circular)
 *    - Shadow: 0px 4px 6px -4px rgba(35, 114, 39, 0.2), 0px 10px 15px -3px rgba(35, 114, 39, 0.2)
 *    - Location: src/assets/orderDetails/icon-call-button-green.svg
 *    - ✅ Downloaded
 * 
 * To convert SVG to PNG (if needed):
 * - Use online tools like CloudConvert
 * - Or use Figma's export feature to export as PNG directly
 * - Export at 2x and 3x resolutions for retina displays
 */

export default OrderDetailsAssets;

