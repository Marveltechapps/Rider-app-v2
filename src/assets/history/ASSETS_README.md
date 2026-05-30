# History Screen Assets

## 📁 Asset Files

All assets exported from Figma design file: `SkUi0997ZLBHlmE9s7KKU6`

### SVG Icons

#### 1. **icon-package.svg**
- **Source Node**: `13534:33`
- **Size**: 52×52px (includes shadow filter)
- **Usage**: Package icon in order card header
- **Color**: White (#FFFFFF) on green background (#32C96A)
- **Features**: 
  - Box/package shape with 3D perspective
  - Stroke width: 1.458px
  - Includes drop shadow filter
- **Component**: `src/components/icons/PackageIcon.tsx`

#### 2. **icon-location-pin.svg**
- **Source Node**: `13534:51`
- **Size**: 21×21px
- **Usage**: Location/area marker in order details
- **Color**: Green (#32C96A)
- **Features**:
  - Rounded square background (8.75px radius) with 10% opacity
  - Map pin icon with location marker
  - Stroke width: 0.875px
- **Component**: `src/components/icons/LocationPinIcon.tsx`

#### 3. **icon-distance.svg**
- **Source Node**: `13534:59`
- **Size**: 13×13px
- **Usage**: Distance indicator in order meta row
- **Color**: Gray (#99A1AF)
- **Features**:
  - Map pin with location marker
  - Stroke width: 1.02083px
  - Simple outline style
- **Component**: `src/components/icons/DistanceIcon.tsx`

#### 4. **icon-items.svg**
- **Source Node**: `13534:65`
- **Size**: 13×13px
- **Usage**: Item count indicator in order meta row
- **Color**: Gray (#99A1AF)
- **Features**:
  - 3D box/package shape
  - Stroke width: 1.02083px
  - Isometric perspective
- **Component**: `src/components/icons/ItemsIcon.tsx`

---

## 🎨 Icon Specifications

### Package Icon (Header)
```
Size: 17.5×17.5px (scaled from 52×52)
ViewBox: 0 0 17.5 17.5
Color: #FFFFFF
Stroke: 1.458px
Background: #32C96A (42×42px circle)
Shadow: Green tinted, 0.2 opacity
```

### Location Pin Icon (Details)
```
Size: 21×21px
ViewBox: 0 0 21 21
Color: #32C96A
Stroke: 0.875px
Background: rgba(50, 201, 106, 0.1)
Border Radius: 8.75px
```

### Distance Icon (Meta)
```
Size: 12.25×12.25px
ViewBox: 0 0 13 13
Color: #99A1AF
Stroke: 1.02083px
Background: None
```

### Items Icon (Meta)
```
Size: 12.25×12.25px
ViewBox: 0 0 13 13
Color: #99A1AF
Stroke: 1.02083px
Background: None
```

---

## 📐 Usage in Components

### OrderCard Component

```typescript
// Header Icon (Package)
<View style={orderIconContainer}>
  <PackageIcon size={scale(17.5)} color="#FFFFFF" />
</View>

// Store Marker (Green Dot)
<View style={orderDetailIconContainer}>
  <StoreMarkerIcon size={scale(7)} color="#32C96A" />
</View>

// Location Pin (with background)
<LocationPinIcon size={scale(21)} color="#32C96A" />

// Distance Icon
<DistanceIcon size={scale(12.25)} color="#99A1AF" />

// Items Icon
<ItemsIcon size={scale(12.25)} color="#99A1AF" />
```

---

## 🎯 Design System Integration

### Icon Sizes
- **Large (Header)**: 42×42px container, 17.5×17.5px icon
- **Medium (Details)**: 21×21px with background
- **Small (Meta)**: 12.25×12.25px

### Colors
- **Primary Green**: `#32C96A` - Active icons, markers
- **White**: `#FFFFFF` - Header icon on green background
- **Gray**: `#99A1AF` - Meta information icons

### Backgrounds
- **Header Icon**: Solid green circle with shadow
- **Store Marker**: Green dot (7×7px)
- **Location Pin**: Green tinted background (10% opacity)
- **Meta Icons**: No background

---

## 🔄 Export Process

### From Figma
1. Select icon node in Figma
2. Export as SVG
3. Save to `src/assets/history/`
4. Create React Native component in `src/components/icons/`

### SVG to React Native
1. Extract paths from SVG
2. Convert to `react-native-svg` components
3. Add size and color props
4. Apply responsive scaling

---

## 📦 File Structure

```
src/
├── assets/
│   └── history/
│       ├── icon-package.svg          # 52×52px
│       ├── icon-location-pin.svg     # 21×21px
│       ├── icon-distance.svg         # 13×13px
│       ├── icon-items.svg            # 13×13px
│       ├── ASSETS_README.md          # This file
│       └── FIGMA_UPDATES.md          # Design updates log
├── components/
│   └── icons/
│       ├── PackageIcon.tsx           # Header icon
│       ├── StoreMarkerIcon.tsx       # Green dot
│       ├── LocationPinIcon.tsx       # Location with bg
│       ├── DistanceIcon.tsx          # Distance marker
│       ├── ItemsIcon.tsx             # Item count
│       ├── CalendarIcon.tsx          # Date selector
│       ├── ChevronLeftIcon.tsx       # Navigation
│       └── ChevronRightIcon.tsx      # Navigation
```

---

## ✅ Quality Checklist

- [x] All SVG files exported from Figma
- [x] Icons converted to React Native components
- [x] Proper TypeScript types
- [x] Size and color props support
- [x] Responsive scaling applied
- [x] ViewBox dimensions correct
- [x] Stroke widths match Figma
- [x] Colors match design system
- [x] No linter errors

---

## 🔧 Maintenance

### Adding New Icons
1. Export SVG from Figma
2. Save to `src/assets/history/`
3. Create component in `src/components/icons/`
4. Update this README
5. Add to OrderCard or screen as needed

### Updating Existing Icons
1. Re-export from Figma
2. Update SVG file
3. Update component paths/dimensions
4. Test in app
5. Document changes

---

**Last Updated**: December 2, 2025  
**Figma File**: SkUi0997ZLBHlmE9s7KKU6  
**Design Node**: 13534-24  
**Status**: ✅ Complete

