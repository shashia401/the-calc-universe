# Design Guidelines: Calculator Website

## Design Approach

**Selected Approach:** Modern Utility Design with Material Design influences
**Justification:** Calculator website is utility-focused with information-dense content requiring clarity, efficiency, and trust. Material Design's clear hierarchy, strong visual feedback, and elevation system work perfectly for interactive tools while maintaining professional credibility.

## Core Design Principles

1. **Clarity First:** Every calculator must be immediately understandable
2. **Trust Through Polish:** Professional aesthetic builds user confidence in calculations
3. **Efficiency:** Minimize steps between user intent and result
4. **Scannable Content:** Easy navigation across 300+ calculators

## Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - headings, UI elements, calculator inputs
- Secondary: System fonts for body text readability

**Hierarchy:**
- H1: 3xl (36px) font-semibold - Page titles
- H2: 2xl (24px) font-semibold - Section headers
- H3: xl (20px) font-medium - Subsections
- Body: base (16px) - Main content
- Small: sm (14px) - Supporting text, labels
- Calculator Inputs: lg (18px) font-medium - High visibility
- Results: 2xl (24px) font-bold - Emphasis on outcomes

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16 (mobile), py-16 to py-24 (desktop)
- Card gaps: gap-6 to gap-8
- Input spacing: space-y-4

**Container Strategy:**
- Max width: max-w-7xl for full layouts
- Content width: max-w-4xl for calculator pages
- Sidebar layouts: 2/3 main + 1/3 sidebar split on desktop

## Component Library

### Navigation
- **Sticky Navbar:** Full-width with max-w-7xl container, h-16, border-bottom, backdrop-blur
- **Mega Menu:** Grid layout showing all 6 categories with 4-5 calculators each, opens on hover (desktop) with smooth opacity transition
- **Mobile Menu:** Slide-in drawer from left, full-height overlay with category accordions
- **Search Bar:** Prominent in hero (desktop) and navbar (mobile), w-full max-w-2xl with icon, autocomplete dropdown with calculator icons and categories
- **Breadcrumbs:** Small text with chevron separators, mb-6

### Hero Section
- Height: 60vh on desktop, auto on mobile
- Background: Gradient overlay with subtle geometric pattern
- Content: Centered with search bar, H1 headline, supporting text
- CTA: Primary search input with large submit button
- **Hero Image:** Abstract illustration of calculator/math elements, positioned right side (desktop), subtle and professional

### Category Cards (Homepage)
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card Design: Rounded-lg border with p-6, hover elevation effect (subtle shadow increase)
- Content: Large icon (h-12 w-12), category name, brief description, calculator count badge
- Icon: Lucide React icons, consistent sizing

### Calculator Cards
- **Featured Grid:** grid-cols-1 md:grid-cols-2 lg:grid-cols-4 with gap-6
- **Card Style:** Rounded-lg border, p-5, cursor-pointer, hover:border-accent transition
- **Content:** Icon, calculator name (font-semibold), short description (2 lines max), "Popular" badge where applicable
- **Action:** Entire card clickable with smooth hover scale (scale-[1.02])

### Calculator Interface
- **Container:** Card style with rounded-xl border, p-8, max-w-2xl
- **Input Groups:** Label + input in vertical stack with space-y-2
- **Inputs:** Rounded-lg border, px-4 py-3, focus:ring-2, large click targets
- **Select Dropdowns:** Matching input style with chevron icon
- **Calculate Button:** Large, full-width on mobile, w-auto px-12 on desktop, rounded-lg, font-semibold
- **Results Display:** Separate card below inputs with rounded-lg, p-6, result value prominently displayed (3xl font-bold)

### Content Sections (Calculator Pages)
- **Instructions:** Numbered list with clear steps, space-y-3
- **Formula Box:** Code-style background, rounded-lg, p-6, monospace font for formulas
- **Examples:** Cards in grid (md:grid-cols-2) showing scenario + result
- **FAQ:** Accordion with + icon, border-bottom separators, space-y-4
- **Related Calculators:** 4-column grid (md:grid-cols-2 lg:grid-cols-4) with compact cards

### Sidebar Navigation
- **Position:** Sticky top-20 on desktop, full-width on mobile
- **Content:** Category hierarchy with nested lists, active state highlighting
- **Style:** Rounded-lg border, p-4, compact spacing

### Footer
- **Layout:** 4-column grid on desktop (About, Categories, Resources, Newsletter), stacked on mobile
- **Content:** Links organized by section, newsletter signup with inline form, social icons
- **Style:** border-top, py-16, max-w-7xl container

### Utility Components
- **Badges:** Rounded-full px-3 py-1 text-xs font-medium ("Popular", "New", category tags)
- **Share Buttons:** Icon buttons in horizontal group, rounded-lg border, p-2
- **Print Button:** Icon + text, secondary style
- **Dark Mode Toggle:** Icon button in navbar, smooth transition on theme change

## Images

**Hero Section:** Abstract geometric illustration featuring calculator/mathematical elements (graphs, numbers, equations) in modern, minimalist style. Position: Right 40% of hero on desktop, subtle opacity overlay. Style: Clean vector art, professional and trustworthy.

**Category Icons:** Use Lucide React icon set consistently - Calculator, Heart, DollarSign, ArrowLeftRight, Clock, GraduationCap

**Blog Posts:** Featured images 16:9 ratio, rounded-lg, relevant to calculation topics

## Animations

**Minimal and Purposeful:**
- Card hover: subtle scale and shadow (duration-200)
- Menu transitions: opacity and transform (duration-300)
- Results reveal: fade-in when calculated (duration-500)
- NO scroll-triggered animations
- NO complex page transitions

## Dark Mode Implementation

- Toggle in navbar with smooth transitions
- Persistent preference via localStorage
- Inverse shadows and borders, adjusted opacity for overlays
- Maintain readability and contrast in both modes

## Mobile Optimizations

- Single column layouts below md breakpoint
- Collapsible sections for long content
- Bottom-fixed calculate button on calculator pages (sm screens)
- Touch-friendly 44px minimum tap targets
- Hamburger menu with slide-out drawer

## Key Differentiators

- **Calculator-first design:** Tools are heroes, not buried in content
- **Scannable hierarchy:** Users can find any calculator in 2 clicks maximum
- **Trust indicators:** Professional polish, clear formulas, example scenarios
- **Instant feedback:** Real-time validation, immediate results display

This design balances utility with polish, creating a professional tool users can trust while maintaining excellent usability across 300+ calculators.