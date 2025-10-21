# Design Guidelines: Sticker Crop Tool

## Design Approach

**Selected Approach**: Design System (Material Design-inspired)
**Justification**: This is a utility-focused productivity tool where clarity, workflow efficiency, and processing feedback are paramount. The interface must guide users through multi-step workflows while maintaining visual hierarchy between platforms (KakaoTalk vs. OGQ).

## Core Design Elements

### A. Color Palette

**Background & Structure**
- Base background: 260 75% 97% (soft purple-blue gradient endpoint)
- Secondary background: 220 70% 96% (gradient start)
- Card backgrounds: 0 0% 100% (pure white for contrast and focus)
- Borders: 220 13% 91% (subtle gray for definition)

**Platform Identity Colors**
- KakaoTalk Primary: 45 93% 58% (vibrant yellow, #FFEB3B family)
- KakaoTalk Hover: 45 93% 50%
- OGQ Primary: 142 71% 45% (fresh green, #10B981 family)
- OGQ Hover: 142 71% 40%
- Neutral Action: 217 91% 60% (blue for upload/general actions)

**Feedback States**
- Processing/Disabled: 220 13% 91% with 50% opacity
- Success indicators: 142 71% 45%
- Borders/Dividers: 220 13% 91%

### B. Typography

**Font Stack**: System fonts for optimal performance
- Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

**Hierarchy**
- H1 (Main title): text-4xl (2.25rem), font-bold, text-gray-800
- H2 (Section headers): text-xl (1.25rem), font-semibold, text-gray-900
- H3 (Subsections): text-base (1rem), font-semibold, platform-colored
- Body text: text-base (1rem), text-gray-700
- Helper text: text-sm (0.875rem), text-gray-600
- Labels: text-sm (0.875rem), font-semibold, text-gray-700

### C. Layout System

**Spacing Scale**: Use Tailwind units 2, 4, 6, 8 for consistency
- Component padding: p-6
- Section margins: mb-4, mb-6, mb-8
- Grid gaps: gap-4, gap-6
- Button padding: py-3 px-6

**Container Structure**
- Max width: max-w-6xl (1152px)
- Two-column grid on desktop: grid-cols-1 lg:grid-cols-2
- Responsive breakpoints: base (mobile), lg (1024px+)

### D. Component Library

**Cards**
- White background with rounded-2xl corners
- Shadow: shadow-lg for elevation
- Padding: p-6 consistently
- Borders: border-2 border-gray-200 for image containers

**Buttons**
- Primary actions: Full width (w-full), py-3 px-6 padding
- Icon + text layout: flex items-center justify-center gap-2
- Border radius: rounded-lg
- Font weight: font-semibold
- Transition: transition for smooth hover states
- Platform buttons: Use yellow (KakaoTalk) and green (OGQ) with appropriate hover states
- Disabled state: opacity-50 cursor-not-allowed

**Form Elements**
- Select dropdowns: px-3 py-2, border border-blue-300, rounded-lg
- Focus states: focus:outline-none focus:ring-2 focus:ring-blue-500
- Background: White for all inputs

**Image Grid**
- 3-column layout: grid-cols-3
- Gap: gap-4
- Individual image containers: aspect-square, border-2 border-gray-200, rounded-lg, overflow-hidden
- Hover effects on download: Subtle opacity shift or overlay

**Dividers**
- Visual workflow separation: border-t-2 border-gray-200 my-4

**Info Panels** (for OGQ main/tab creation)
- Background: bg-blue-50 (soft blue tint)
- Padding: p-4
- Border radius: rounded-lg
- Text: text-blue-900 for headers

**Preview Sections**
- Display generated OGQ images in dedicated areas
- Border: border-2 border-green-500
- Background: bg-white
- Labels underneath images

### E. Workflow Visual Hierarchy

**Step Progression**
1. Upload section always visible at top
2. Platform selection buttons appear after upload
3. Conditional sections revealed based on platform choice
4. Visual dividers separate workflow stages
5. Results grid appears at bottom/right panel

**Platform Differentiation**
- KakaoTalk workflow: Yellow accent throughout, simpler path
- OGQ workflow: Green accent throughout, complex multi-step UI
- Use color-coded helper text at top to explain both workflows

**Processing States**
- Show "처리 중..." (Processing) text on buttons
- Disable buttons during processing
- Consider subtle loading indicators if processing is lengthy

**Download Section**
- Individual download on image hover/click
- Prominent "전체 다운로드" (Download All) button at top of results
- Clear file naming convention displayed

### F. Responsive Behavior

**Desktop (lg and up)**
- Two-column layout: Upload/controls on left, results on right
- Sticker grid in 3 columns
- Full button widths within their columns

**Mobile/Tablet**
- Single column stack
- Upload panel → Controls → Results flow
- Sticker grid in 2-3 columns (adjust for viewport)
- Maintain button full-width for easy tapping

### G. Images

**No hero image required** - This is a utility tool, not a marketing page. The interface begins immediately with the upload functionality.

**User-Generated Content**
- Uploaded image preview: Full width within card container
- Cropped sticker previews: Square aspect ratio, 3-column grid
- OGQ main (240×240) and tab (96×74) images displayed at actual dimensions with clear labels

### H. Accessibility & UX Details

- Maintain consistent dark mode NOT needed - utility tools work best in light mode for clarity
- Clear labels for all interactive elements
- Disabled states clearly indicated
- File input hidden but triggered by prominent button
- Helper text explains platform differences upfront
- Success feedback after image generation
- Download buttons clearly labeled with indices

This design prioritizes workflow clarity, processing transparency, and platform-specific visual coding to guide users through complex multi-step emoticon creation processes efficiently.