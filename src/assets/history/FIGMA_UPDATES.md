# Order Card Design - Figma Updates

## Updates Applied (Dec 2, 2025)

### 🎯 Exact Figma Specifications Implemented

Based on Figma node `13534-24`, the following precise measurements and styles have been applied:

---

## 📐 Card Dimensions

### Container
- **Width**: 345px (scaled)
- **Border Radius**: 14px
- **Padding**: 19px
- **Gap**: 14px (vertical spacing between header and details)
- **Background**: `#FFFFFF`
- **Border**: 1px solid `#F3F4F6`
- **Shadow**: `0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)`

---

## 🎨 Header Section

### Icon Container
- **Size**: 42px × 42px
- **Border Radius**: 21px (circular)
- **Background**: `#32C96A`
- **Shadow**: `0px 2px 4px -2px rgba(50, 201, 106, 0.2), 0px 4px 6px -1px rgba(50, 201, 106, 0.2)`

### Package Icon
- **Size**: 17.5px × 17.5px
- **Color**: `#FFFFFF`
- **Stroke Width**: 1.458px

### Order Info (Left Side)
- **Gap**: 3.5px (between ID and time)
- **Flex**: 1

#### Order ID
- **Font**: Arial
- **Weight**: 700 (Bold)
- **Size**: 14px
- **Line Height**: 1.5em (21px)
- **Color**: `#101828`

#### Time
- **Font**: Arial
- **Weight**: 400 (Regular)
- **Size**: 12.25px
- **Line Height**: 1.4286em (17.5px)
- **Color**: `#6A7282`

### Payout & Duration (Right Side)
- **Gap**: 3.5px
- **Alignment**: flex-end

#### Payout
- **Font**: Arial
- **Weight**: 700 (Bold)
- **Size**: 14px
- **Line Height**: 1.5em (21px)
- **Color**: `#32C96A`
- **Text Align**: Right
- **Width**: 25px (minimum)
- **Padding**: 0px 11px

#### Duration
- **Font**: Arial
- **Weight**: 400 (Regular)
- **Size**: 10.5px
- **Line Height**: 1.3333em (14px)
- **Color**: `#99A1AF`
- **Text Align**: Right

---

## 📍 Details Section

### Container
- **Width**: 252px
- **Height**: 77px
- **Gap**: 7px (vertical spacing between rows)

### Detail Row (Store & Area)
- **Height**: 21px
- **Gap**: 7px (between icon and text)
- **Alignment**: center

#### Icon Container
- **Size**: 21px × 21px
- **Border Radius**: 8.75px
- **Background**: `rgba(50, 201, 106, 0.1)`

#### Store Marker Icon
- **Size**: 7px × 7px (circular dot)
- **Color**: `#32C96A`

#### Location Pin Icon
- **Size**: 10.5px × 10.5px
- **Color**: `#32C96A`
- **Stroke Width**: 0.875px
- **Path**: `M1.75 0.88L7 8.75`
- **Circle**: cx="3.94" cy="3.06" r="1.315"

#### Text
- **Font**: Arial
- **Weight**: 400 (Regular)
- **Size**: 12.25px
- **Line Height**: 1.4286em (17.5px)
- **Height**: 17.5px
- **Color**: `#4A5565`

---

## 📊 Meta Row (Distance & Items)

### Container
- **Height**: 14px
- **Gap**: 14px (between distance and items)
- **Layout**: Row, stretch

### Meta Item
- **Gap**: 5.25px (between icon and text)
- **Flex**: 1

#### Icons
- **Size**: 12.25px × 12.25px
- **Color**: `#99A1AF`
- **Stroke Width**: 1.021px

#### Distance Icon
- **Path**: `M2.04 1.02L10.21 11.23`
- **Circle**: cx="6" cy="5" r="1.53"

#### Items Icon
- **Paths**: Multiple paths forming shopping bag shape

#### Text
- **Font**: Arial
- **Weight**: 700 (Bold)
- **Size**: 10.5px
- **Line Height**: 1.3333em (14px)
- **Color**: `#99A1AF`

---

## 🎯 Color Palette

| Element | Color Code | Usage |
|---------|-----------|-------|
| Primary Green | `#32C96A` | Icon background, payout, markers |
| White | `#FFFFFF` | Card background, icon color |
| Text Primary | `#101828` | Order ID |
| Text Secondary | `#6A7282` | Time |
| Text Tertiary | `#4A5565` | Store name, area |
| Text Light | `#99A1AF` | Duration, distance, items |
| Border | `#F3F4F6` | Card border |
| Green Tint | `rgba(50, 201, 106, 0.1)` | Icon container background |

---

## 📏 Spacing System

| Element | Value |
|---------|-------|
| Card Padding | 19px |
| Header-Details Gap | 14px |
| Info Gap | 3.5px |
| Detail Row Gap | 7px |
| Meta Row Gap | 14px |
| Icon-Text Gap | 7px (detail), 5.25px (meta) |

---

## ✨ Visual Effects

### Card Shadow
```
shadowColor: '#000'
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.1
shadowRadius: 3
elevation: 2
```

### Icon Shadow
```
shadowColor: '#32C96A'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.2
shadowRadius: 4
elevation: 4
```

---

## 🔧 Technical Implementation

### Files Updated
1. `src/components/icons/LocationPinIcon.tsx` - Updated with exact Figma path coordinates
2. `src/styles/historyStyles.ts` - All measurements updated to match Figma specs
3. `src/components/OrderCard.tsx` - Structure matches Figma hierarchy

### Key Changes
- ✅ Exact dimensions from Figma (42px icon, 252px details width, 77px details height)
- ✅ Precise gap values (3.5px, 7px, 14px)
- ✅ Correct shadow specifications
- ✅ Accurate color codes
- ✅ Proper text alignment and sizing
- ✅ Icon sizes and stroke widths match Figma

---

## 📱 Responsive Scaling

All dimensions use responsive utilities:
- `scale()` for horizontal measurements
- `verticalScale()` for vertical measurements
- Maintains aspect ratios across device sizes

---

## ✅ Verification Checklist

- [x] Card dimensions match Figma (345px width, 14px radius, 19px padding)
- [x] Icon container is 42px × 42px with correct shadow
- [x] Text sizes and weights match exactly
- [x] Colors match Figma color picker values
- [x] Spacing/gaps match Figma measurements
- [x] Details section is 252px × 77px
- [x] All icons have correct sizes and stroke widths
- [x] Shadows match Figma effects
- [x] Border radius values are accurate
- [x] Text alignment and line heights are correct

---

**Status**: ✅ 100% Figma-Accurate  
**Last Updated**: December 2, 2025  
**Figma Node**: 13534-24

