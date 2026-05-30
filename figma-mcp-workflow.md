# Figma-to-Expo Conversion Workflow with Cursor MCP & .cursorrules

## Overview
This guide demonstrates how to use Figma design links with Cursor MCP server to convert Figma screens into production-ready Expo components, leveraging the `.cursorrules` guidelines.

---

## Part 1: Setup & Prerequisites

### 1.1 Prerequisites
- Cursor IDE installed (latest version)
- MCP server for Figma enabled in Cursor
- `.cursorrules` file in your project root (from previous guide)
- Figma design file with exported components/screens
- Expo project initialized

### 1.2 Enable Figma MCP Server in Cursor

**Step 1**: Open Cursor Settings
- Click Settings (gear icon) or press `Cmd/Ctrl + ,`
- Navigate to "Features" → "Model Context Protocol"

**Step 2**: Add Figma MCP Server
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@figma/mcp-server"
      ],
      "env": {
        "FIGMA_PERSONAL_ACCESS_TOKEN": "your_figma_token_here"
      }
    }
  }
}
```

**Step 3**: Get Figma Personal Access Token
1. Go to Figma Settings → Account → Personal access tokens
2. Generate a new token (name: "Cursor MCP")
3. Copy the token (appears once only)
4. Paste into Cursor settings

**Step 4**: Restart Cursor
- Close and reopen Cursor IDE
- Verify Figma MCP is connected (check status in bottom right)

---

## Part 2: Figma Link Extraction

### 2.1 How to Get "Copy Link to Selection"

**Method 1: From Individual Screen**
1. Open your Figma design file
2. Click on the screen/component you want to convert
3. Right-click → "Copy link to selection"
4. OR use keyboard shortcut: `Shift + Cmd/Ctrl + L` (if enabled)

**Method 2: From Component Set**
1. Click on a component or component group
2. Right-click → "Copy link to selection"
3. The link will include the specific node ID

**Example Figma Link Format**:
```
https://www.figma.com/file/YOUR_FILE_ID/Design-System?node-id=1234%3A5678&t=UNIQUE_TOKEN
```

**Link Components**:
- `file/YOUR_FILE_ID` = Your design file ID
- `node-id=1234%3A5678` = Specific component/screen ID
- `t=UNIQUE_TOKEN` = Unique token for sharing

### 2.2 Extract Multiple Screen Links

For a complex design system with multiple screens:

1. **Home Screen** → Copy link
2. **Product Screen** → Copy link
3. **Profile Screen** → Copy link
4. **Auth Screen** → Copy link

Keep these links in a document for reference:
```markdown
## Figma Design Links

### Screens
- Home Screen: https://www.figma.com/file/ABC123/Design?node-id=100%3A1
- Product Screen: https://www.figma.com/file/ABC123/Design?node-id=200%3A1
- Profile Screen: https://www.figma.com/file/ABC123/Design?node-id=300%3A1

### Components
- Button: https://www.figma.com/file/ABC123/Design?node-id=50%3A100
- Card: https://www.figma.com/file/ABC123/Design?node-id=50%3A200
```

---

## Part 3: Cursor MCP Integration

### 3.1 Using Figma MCP in Cursor

Once MCP is enabled, you can reference Figma content directly in prompts:

**Option 1: Paste Link in Chat**
```
I have this Figma screen: https://www.figma.com/file/ABC123/Design?node-id=100%3A1

Please convert it to an Expo component following .cursorrules guidelines.
```

**Option 2: Reference via MCP Commands**
```
@figma file:ABC123 node-id:100:1 → Convert to Expo component
```

**Option 3: Combine with Code Context**
```
@codebase I have a Figma design here: [PASTE LINK]

Following .cursorrules section 2.3 component template:
- Extract design tokens (section 1)
- Create TypeScript types (section 12)
- Use responsive design (section 3.2)
- Create file at: src/components/features/ProductCard.tsx
```

### 3.2 MCP Server Capabilities

The Figma MCP server can:
- ✅ Fetch design metadata from Figma file
- ✅ Extract component properties (colors, typography, spacing)
- ✅ Parse component hierarchy
- ✅ List all design tokens
- ✅ Generate code suggestions based on design
- ✅ Extract asset URLs (images, icons)

---

## Part 4: Optimal Prompting Workflow

### 4.1 Single Component Conversion Flow

**Step 1: Prepare Context**
```
Project: Expo E-commerce App
Figma Link: https://www.figma.com/file/XYZ/Design?node-id=123%3A456
Framework: Expo (React Native)
Design System: Available in src/constants/Theme.ts
```

**Step 2: Analysis Prompt**
```
Analyze this Figma component: [PASTE FIGMA LINK]

Using MCP, extract and report:
1. Component name and purpose
2. All variants (from Figma component variations)
3. Color values used (map to Theme.colors.*)
4. Typography (map to Theme.typography.*)
5. Spacing/padding values (in 4px units)
6. Dimensions (width/height)
7. States (default, hover, pressed, disabled)
8. Icons/images used
9. Animations (if any)

Format as structured data.
```

**Step 3: Generation Prompt**
```
Create Expo component from Figma: [PASTE LINK]

Requirements:
- Follow .cursorrules section 2.3 (component template)
- File: src/components/common/Button.tsx
- Use extracted design tokens (section 1.2)
- Implement all variants: [list from analysis]
- States: [list from analysis]
- Props: [list extracted props]
- TypeScript types (section 12)
- StyleSheet.create() for all styles (section 3.1)
- Responsive design using scale() (section 3.2)

Design tokens mapping:
- Primary color: extracted from MCP
- Typography: from extracted values
- Spacing: from extracted values

Include JSDoc comments per section 19.1
```

### 4.2 Complete Screen Conversion Flow

**Scenario**: Convert entire "Product Screen" from Figma

**Step 1: Link & Context Setup**
```
I'm converting a Figma design to Expo using .cursorrules guidelines.

Figma Design: [PASTE SCREEN LINK]

Context:
- Project structure: src/screens/, src/components/
- Design tokens: src/constants/Theme.ts (all colors/typography/spacing)
- Responsive utilities: scale(), verticalScale(), wp(), hp() in src/utils/responsive.ts
- Build approach: Bottom-up (foundation → composite → layout → feature)
```

**Step 2: Component Dependency Analysis**
```
@figma [PASTE LINK]

Analyze the screen and list:
1. All UI components used
2. Dependency order (what depends on what)
3. Suggested React component hierarchy
4. Shared components to build first

Example:
- Foundation: Text, Button, Card, Input
- Composite: ProductCard, ProductList
- Feature: ProductFilters
- Screen: ProductScreen
```

**Step 3: Build Foundation Components**
```
From Figma screen: [PASTE LINK]

Build foundation components in this order:

1. Text component
   - Variants: display, h1, h2, h3, body, bodySm, caption
   - Extract from Figma typography
   - File: src/components/common/Text.tsx

2. Button component
   - Variants: primary, secondary, outline
   - States: default, pressed, disabled
   - File: src/components/common/Button.tsx

3. Card component
   - Properties: padding, borderRadius, shadow
   - File: src/components/common/Card.tsx

For each:
- Follow .cursorrules section 2.3 template
- Use Theme tokens (section 1.2)
- Add TypeScript types (section 12)
- StyleSheet.create() (section 3.1)
- Responsive design (section 3.2)
```

**Step 4: Build Feature Components**
```
From Figma screen: [PASTE LINK]

Create feature components:

1. ProductCard
   - Props needed: [from analysis]
   - Variants: featured, regular, compact
   - File: src/components/features/ProductCard.tsx

2. ProductList
   - Use FlatList (not ScrollView) for performance
   - Props: data, isLoading, onEndReached
   - File: src/components/features/ProductList.tsx

3. FilterBar
   - Props: filters, onFilterChange, onReset
   - File: src/components/features/FilterBar.tsx

Follow:
- Section 2.2 component file structure
- Section 11.2 list optimization
- Section 12 TypeScript types
```

**Step 5: Build Screen**
```
From Figma screen: [PASTE LINK]

Create ProductScreen using foundation and feature components:

File: src/screens/ProductScreen.tsx

Include:
- SafeAreaView wrapper
- Header with navigation
- SearchBar/FilterBar
- ProductList with lazy loading
- Loading and error states
- Empty state handling

Follow section 8.1 screen structure template.
```

**Step 6: Design Accuracy Verification**
```
Verify component against Figma design:

Using color picker in Figma, verify:
- [ ] All colors match Theme.colors.* exactly
- [ ] Typography: font, size, weight, line height match
- [ ] Spacing: padding, margins, gaps match
- [ ] Border radius matches
- [ ] Component dimensions match
- [ ] States (disabled, active) match
- [ ] Responsive breakpoints work correctly

Report any mismatches and refine.
```

---

## Part 5: Advanced Prompting Patterns

### 5.1 Multi-File Generation Pattern

When you need multiple components created at once from a single Figma screen:

```
Figma Screen: [PASTE LINK]

Generate complete component system following .cursorrules:

CREATE FILES:
1. src/components/common/Button.tsx
   - Extracted from Figma: Button component
   - Props: title, onPress, variant, size, disabled
   
2. src/components/common/Card.tsx
   - Extracted from Figma: Card component
   - Props: children, padding, variant

3. src/components/features/ProductCard.tsx
   - Uses Button + Card + Text
   - Props: product, onPress, onAddToCart
   
4. src/components/features/ProductList.tsx
   - Uses ProductCard
   - Props: data, isLoading, onEndReached
   
5. src/screens/ProductScreen.tsx
   - Uses ProductList + Header + SearchBar
   - Complete screen implementation

For all files:
- Extract design tokens from Figma via MCP
- Use Theme.ts values (colors, typography, spacing)
- Follow .cursorrules section 2.3 component template
- Include TypeScript types per section 12
- StyleSheet.create() per section 3.1
- Responsive design per section 3.2
- JSDoc comments per section 19.1

Ensure components follow dependency order:
common/ → features/ → screens/
```

### 5.2 Design System Extraction Pattern

Extract complete design system from Figma:

```
Figma Design File: [PASTE LINK]

Extract and generate design system:

1. Colors.ts
   - Primary colors (from Figma color styles)
   - Secondary colors
   - Semantic colors (background, surface, text, border)
   - Neutral scale (gray50-gray900)
   - Status colors (success, error, warning, info)

2. Theme.ts
   - Typography: Extract all text styles from Figma
   - Spacing: Extract spacing tokens (4px base)
   - BorderRadius: Extract all radius values
   - Shadows: Extract shadow definitions

3. Type definitions
   - ColorKey type
   - TypographyVariant type
   - SpacingScale type

Follow .cursorrules section 1.2 design token structure.

Verify all values match Figma exactly using color picker.
```

### 5.3 Component Variant Pattern

Generate a component with all variants from Figma:

```
Figma Component: [PASTE LINK]

This component has these variants in Figma:
- Size: small, medium, large
- Type: filled, outline, text
- State: default, hover, active, disabled

Generate Button component with all variant combinations:

File: src/components/common/Button.tsx

Props:
- title: string
- onPress: () => void
- variant: 'filled' | 'outline' | 'text'
- size: 'small' | 'medium' | 'large'
- disabled: boolean
- icon?: ReactNode

StyleSheet organization:
- styles.button (base)
- styles[variant] (variant styles)
- styles[size] (size styles)
- styles.disabled (disabled styles)
- styles.text (text styles)

Use Theme tokens for all colors/typography/spacing.
Test all 3 × 3 × 2 = 18 combinations.
```

### 5.4 Responsive Conversion Pattern

Convert fixed pixel design to responsive:

```
Figma Design: [PASTE LINK]

This design uses fixed pixel values. Convert to responsive:

1. Extract all hardcoded pixel values from Figma
2. Map to responsive functions:
   - Fixed width → scale(width) or wp(percentage)
   - Fixed height → verticalScale(height) or hp(percentage)
   - Padding/margins → scale(value)
   - Font size → moderateScale(value)

3. Test on devices:
   - Small: 375px (iPhone SE)
   - Medium: 390px (iPhone 14)
   - Large: 430px (iPhone 14 Pro Max)
   - Tablet: 1024px (iPad)

Follow .cursorrules section 7 responsive design guidelines.

Generated responsive file: src/components/features/[Component].tsx
```

---

## Part 6: Step-by-Step Prompt Template

### 6.1 Complete Single Component Workflow

**Copy this template and fill in the bracketed values:**

```
PROJECT CONTEXT:
- Framework: Expo (React Native)
- Language: TypeScript
- Design System: src/constants/Theme.ts
- Responsive Utils: scale(), verticalScale(), wp(), hp()
- Project follows: .cursorrules guidelines

FIGMA DESIGN:
- Link: [PASTE YOUR FIGMA LINK HERE]
- Component Name: [e.g., ProductCard]
- Purpose: [e.g., Display product information with image, title, price, rating]

ANALYSIS REQUEST:
Extract from Figma design:
1. Component dimensions (width, height)
2. Padding/margins/gaps
3. Colors used (map to Theme.colors.*)
4. Typography (map to Theme.typography.*)
5. Border radius
6. Shadows/elevation
7. States (default, hover, pressed, disabled)
8. Variants (if component set)
9. Icons/assets used
10. Animations (if any)

GENERATION REQUEST:
Create React component from Figma design.

File Path: src/components/features/[ComponentName].tsx

Requirements:
✅ Follow .cursorrules section 2.3 component template
✅ Export TypeScript interface: interface [ComponentName]Props
✅ Use Theme.colors for all colors (never hardcode hex)
✅ Use Theme.typography for all text styles
✅ Use Theme.spacing for all padding/margins
✅ StyleSheet.create() for all styles (section 3.1)
✅ Responsive design: scale(), verticalScale(), wp(), hp() (section 3.2)
✅ React.memo for performance if needed (section 11.1)
✅ JSDoc comments per section 19.1
✅ Accessibility: testID, accessibilityLabel
✅ No console warnings/errors

Extracted Props:
[List props needed: e.g., title: string, image: string, price: number, onPress: () => void]

Extracted Variants:
[List if component set: e.g., featured, regular, compact]

Extracted States:
[List states: e.g., default, disabled, loading]

Design Token Mapping:
- Primary color: [extracted hex] → Theme.colors.primary
- Background: [extracted hex] → Theme.colors.background
- Text: [extracted hex] → Theme.colors.text
- Spacing (padding): [extracted px] → Theme.spacing.md
- Border radius: [extracted px] → Theme.borderRadius.md
- Font: [extracted name] → Theme.typography.body

Include:
1. Component interface with all props
2. Proper TypeScript types
3. StyleSheet.create() with all styles
4. Responsive design with scale() functions
5. All variant/state styles
6. JSDoc documentation
7. Accessibility props
```

### 6.2 Complete Screen Conversion Workflow

```
PROJECT CONTEXT:
- Framework: Expo
- Design System: src/constants/Theme.ts
- Screen path: src/screens/
- Component path: src/components/
- Build approach: Bottom-up (foundation → feature → screen)

FIGMA SCREEN:
- Link: [PASTE SCREEN LINK]
- Screen Name: [e.g., HomeScreen]
- Purpose: [e.g., Display home feed with products and recommendations]

STEP 1: DECOMPOSE SCREEN
Analyze Figma screen and identify:
1. All UI components used
2. Component dependencies
3. Build order (what to build first)

Example decomposition:
- Foundation: Text, Button, Card, Input
- Composite: ProductCard, Header
- Feature: ProductList, FilterBar
- Screen: HomeScreen

STEP 2: BUILD FOUNDATION COMPONENTS
For each foundation component:
- Extract from Figma design
- Create individual file: src/components/common/[Name].tsx
- Follow .cursorrules section 2.3 template
- Include TypeScript types, StyleSheet.create(), responsive design

STEP 3: BUILD FEATURE COMPONENTS
For each feature component:
- Extract from Figma design
- Create file: src/components/features/[Name].tsx
- Use foundation components
- Follow optimization per section 11

STEP 4: BUILD SCREEN
Create screen: src/screens/[ScreenName].tsx
- SafeAreaView wrapper
- Use all feature/foundation components
- Include loading/error/empty states
- Follow section 8.1 screen structure

STEP 5: DESIGN VERIFICATION
Verify pixel-perfect match:
- [ ] Colors exact match (use color picker)
- [ ] Typography matches
- [ ] Spacing matches
- [ ] Component dimensions match
- [ ] Responsive design works on all devices

DELIVERABLES:
✅ src/components/common/[Components].tsx
✅ src/components/features/[Components].tsx
✅ src/screens/[ScreenName].tsx
✅ TypeScript types for all components
✅ Design accuracy verified
✅ Responsive design tested
✅ Code follows .cursorrules guidelines
```

---

## Part 7: Practical Examples

### 7.1 Example: Button Component

**Figma Link**: `https://www.figma.com/file/ABC123/Design?node-id=50%3A100`

**Prompt**:
```
Figma Component: https://www.figma.com/file/ABC123/Design?node-id=50%3A100

Create Button component following .cursorrules:

Extracted from Figma:
- Variants: primary (green #034703), secondary (gray #4C4C4C), outline
- Sizes: small (44px), medium (48px), large (56px)
- States: default, pressed, disabled
- Typography: Inter-SemiBold, 14-16px
- Padding: 12-16px horizontal, 10-12px vertical
- Border radius: 8px
- Icon support: left/right optional

File: src/components/common/Button.tsx

Requirements:
- Section 2.3 component template
- Theme tokens for colors/typography
- StyleSheet.create() per section 3.1
- Responsive scale() per section 3.2
- TypeScript types per section 12
- JSDoc comments per section 19.1
- Accessibility: testID, accessibilityLabel
```

### 7.2 Example: Product Screen

**Figma Link**: `https://www.figma.com/file/ABC123/Design?node-id=200%3A1`

**Prompt**:
```
Figma Screen: https://www.figma.com/file/ABC123/Design?node-id=200%3A1

Convert this product screen to Expo following .cursorrules.

Screen decomposition (from Figma):
1. Header component (back button, title, share button)
2. Product image carousel
3. Product info card (title, price, rating, description)
4. Size/color selector
5. Add to cart button
6. Similar products list

Build order:
1. Foundation: Text, Button, Card, Input
2. Feature: ProductImageCarousel, ProductInfoCard, SizeSelectorCard, SimilarProductsList
3. Screen: ProductScreen

For each component:
- Extract design from Figma
- Use Theme tokens
- Follow .cursorrules section 2.3 template
- Include TypeScript types
- StyleSheet.create()
- Responsive design

Screen file: src/screens/ProductScreen.tsx
- SafeAreaView wrapper
- ScrollView for content
- Include loading/error states
- Handle screen dimensions (tablet support)

Verify design accuracy with color picker.
```

### 7.3 Example: Design System Extraction

**Figma Link**: `https://www.figma.com/file/ABC123/Design?node-id=1%3A100` (Design tokens page)

**Prompt**:
```
Figma Design System: https://www.figma.com/file/ABC123/Design?node-id=1%3A100

Extract complete design system and generate:

1. src/constants/Colors.ts
   Colors from Figma:
   - Primary: #034703
   - Secondary: #4C4C4C
   - Success: #4CAF50
   - Error: #F44336
   - Backgrounds, text, borders...
   
   Follow .cursorrules section 5.1 color organization

2. src/constants/Theme.ts
   Typography variants from Figma:
   - display: 40px, 700, Inter-Bold
   - h1: 32px, 700, Inter-Bold
   - h2: 24px, 600, Inter-SemiBold
   - body: 16px, 400, Inter-Regular
   - bodySm: 14px, 400, Inter-Regular
   - caption: 12px, 500, Inter-Medium
   
   Spacing (4px base unit):
   - xs: 4, sm: 8, md: 16, lg: 24, xl: 32
   
   Border radius:
   - sm: 4, md: 8, lg: 12, xl: 16
   
   Shadows: Extract from Figma
   
   Follow .cursorrules section 1.2

3. src/types/theme.ts
   Export types:
   - ColorKey type
   - TypographyVariant type
   - SpacingScale type

DELIVERABLES:
✅ Exact colors from Figma color picker
✅ All typography from text styles
✅ All spacing values mapped to 4px base
✅ Shadow definitions
✅ TypeScript types
✅ Complete, production-ready design system
```

---

## Part 8: MCP Server Commands Reference

### 8.1 Figma MCP Commands

Once Figma MCP is active, you can use these commands in Cursor:

```bash
# Get file metadata
@figma get-file --file-id=YOUR_FILE_ID

# Get component details
@figma get-component --file-id=FILE_ID --node-id=NODE_ID

# List all components in file
@figma list-components --file-id=FILE_ID

# Get component variants
@figma get-variants --file-id=FILE_ID --node-id=NODE_ID

# Extract colors from design
@figma extract-colors --file-id=FILE_ID

# Extract typography
@figma extract-typography --file-id=FILE_ID

# Get design tokens
@figma extract-tokens --file-id=FILE_ID

# Get image assets
@figma extract-images --file-id=FILE_ID
```

### 8.2 Combining MCP with Context

```
@figma get-component --file-id=ABC123 --node-id=100:200

Convert this component to React Native following .cursorrules:
- File: src/components/common/Button.tsx
- Use theme tokens
- Add TypeScript types
- Make responsive
```

---

## Part 9: Troubleshooting & Best Practices

### 9.1 Common Issues

**Issue 1: Figma Link Not Working in MCP**
```
Problem: MCP can't access Figma link
Solution:
1. Verify Figma token is valid (regenerate if needed)
2. Ensure file is accessible to your Figma account
3. Check node-id is correct (use Figma DevTools)
4. Restart Cursor
```

**Issue 2: Colors Don't Match After Generation**
```
Problem: Generated colors differ from Figma
Solution:
1. Use Figma color picker to get exact hex value
2. Update Theme.colors.* with exact value
3. Verify design token extraction in MCP output
4. Check for opacity/alpha channel differences
```

**Issue 3: Typography Not Matching**
```
Problem: Font size or weight differs
Solution:
1. Check font file is loaded in app.json
2. Verify Theme.typography values match Figma
3. Check lineHeight is correctly calculated
4. Test on different devices
```

**Issue 4: Responsive Design Breaking**
```
Problem: Layout breaks on different screen sizes
Solution:
1. Use scale() for all width/padding
2. Use verticalScale() for height
3. Use wp() and hp() for percentage-based
4. Test on all device sizes (section 9.2)
5. Add breakpoints for tablet (1024px+)
```

### 9.2 Best Practices

1. **Always use Figma link from MCP**
   - Ensures accurate component analysis
   - Gets latest design changes
   - Maintains design-code sync

2. **Extract design tokens first**
   - Build Theme.ts before components
   - Ensures consistent styling
   - Makes theme changes easier

3. **Build bottom-up**
   - Foundation → Composite → Feature → Screen
   - Reuses components effectively
   - Reduces code duplication

4. **Verify design accuracy**
   - Use Figma color picker after generation
   - Test responsive on multiple devices
   - Check all component states

5. **Version control commits**
   ```
   feat: Extract design tokens from Figma
   feat: Create foundation components (Button, Card, Text)
   feat: Create ProductCard feature component
   feat: Create ProductScreen from Figma
   ```

6. **Documentation**
   - Document Figma links in README.md
   - Keep mapping of Figma → React components
   - Comment complex design decisions

---

## Part 10: Complete Workflow Summary

### Quick Checklist

```
BEFORE YOU START:
☐ Figma file ready with components/screens
☐ Cursor IDE open with MCP enabled
☐ Project initialized with .cursorrules
☐ Design system (Theme.ts) prepared
☐ Responsive utilities imported

FOR EACH COMPONENT:
☐ Copy Figma link ("Copy link to selection")
☐ Paste in Cursor prompt
☐ Reference .cursorrules section number
☐ Request analysis (extract design details)
☐ Request generation (create component file)
☐ Verify design accuracy (color picker check)
☐ Test responsive design
☐ Commit to git

WORKFLOW STEPS:
1. Extract Figma link → Component analysis
2. Component analysis → Design token extraction
3. Design tokens → Theme.ts updates
4. Theme.ts → Foundation components
5. Foundation → Feature components
6. Feature → Screens
7. Screens → Full app implementation
8. Full app → Design verification
9. Design verification → Production ready

VERIFICATION CHECKLIST:
☐ Colors match exactly (use color picker)
☐ Typography matches (font, size, weight, line height)
☐ Spacing matches (padding, margins, gaps)
☐ Border radius matches
☐ Component dimensions match
☐ All states work (default, disabled, pressed)
☐ Responsive design works (all devices)
☐ No console warnings/errors
☐ TypeScript strict mode passing
☐ Code follows .cursorrules guidelines
```

---

## Part 11: Example Conversation Flow

### 11.1 Sample Chat in Cursor

```
USER:
I have this Figma button component: 
https://www.figma.com/file/ABC123/Design?node-id=50%3A100

Convert it to React Native following .cursorrules.

CURSOR (with MCP):
[Figma MCP connects and analyzes component]

Analyzing component from Figma...
- Component name: Button
- Variants: primary, secondary, outline
- Sizes: small (44px), medium (48px), large (56px)
- States: default, pressed, disabled
- Typography: Inter-SemiBold, 14-16px
- Colors: primary (#034703), secondary (#4C4C4C), outline (border)

USER:
Great! Now generate the React component for this. Use:
- .cursorrules section 2.3 template
- Theme tokens for colors
- StyleSheet.create()
- TypeScript types
- File: src/components/common/Button.tsx

CURSOR:
[Generates complete Button component]
// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../../constants/Theme';
import Text from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      testID="button"
      accessibilityLabel={title}
    >
      <Text variant="body" style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Theme.colors.primary,
  },
  secondary: {
    backgroundColor: Theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  small: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  medium: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  large: {
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: Theme.colors.white,
  },
});

USER:
Perfect! Now verify the colors match Figma exactly.
Can you check if the primary green (#034703) is correct?

CURSOR:
Based on MCP analysis of your Figma file, the primary color 
is #034703, which matches Theme.colors.primary.

All colors verified:
✅ Primary: #034703
✅ Secondary: #4C4C4C
✅ Border: #034703
✅ Text: #FFFFFF

Component is design-accurate and production-ready.
```

---

## Part 12: Advanced Tips & Tricks

### 12.1 Batch Conversion Strategy

Convert multiple screens at once:

```
I have 5 screens to convert from Figma:
1. HomeScreen: https://link1
2. ProductScreen: https://link2
3. ProfileScreen: https://link3
4. CartScreen: https://link4
5. CheckoutScreen: https://link5

Priority order (dependencies):
1. First: Extract all design tokens (foundation)
2. Second: All foundation components (Text, Button, Card, Input)
3. Third: All screens in parallel (they share foundation)

Please start with extracting design tokens from HomeScreen link.
```

### 12.2 Incremental Refinement

After initial generation, refine iteratively:

```
First generation: Create button component
Review: Works, but spacing seems large

Second generation: Adjust spacing in Theme
Review: Colors don't match, update hex

Third generation: Add loading state
Review: Needs animation, add Animated API

This allows for iterative improvement while keeping 
component architecture intact.
```

### 12.3 State Management Integration

For screens with complex state:

```
Figma Screen: [LINK]

This screen needs state management for:
- Selected filters
- Product sorting
- Search input
- Pagination

Create screen with:
- useState for local state
- Context API for shared state
- Custom hooks for business logic
- Follow .cursorrules section 7 (state management)
```

---

## Summary & Quick Start

1. **Copy Figma link** → Right-click component → "Copy link to selection"
2. **Open Cursor** → Paste link in chat with .cursorrules reference
3. **Request analysis** → "Extract design details from this Figma link"
4. **Request generation** → "Create component following .cursorrules section X"
5. **Verify accuracy** → Use Figma color picker to verify colors
6. **Commit to git** → Push component to repository
7. **Repeat** → For next component/screen

---

**Pro Tip**: Save time by extracting ALL Figma links upfront and processing components in dependency order (foundation → feature → screen). This ensures smoother generation and fewer revisions.

---

Last Updated: 2025-01-15
Best used with: Cursor IDE + Figma MCP Server + .cursorrules file
