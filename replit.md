# The Calc Universe - Online Calculator Platform

## Overview

The Calc Universe is a modern, SEO-optimized calculator website offering 89 calculators organized into 6 main categories: Math, Health & Fitness, Financial, Conversion Tools, Date & Time, and Education. The platform is built as a **100% frontend React single-page application** with no backend logic - all calculations are performed client-side in the browser for instant results and complete privacy.

## Recent Changes

### Security & Bug Audit (March 2, 2026)
- **CRITICAL FIX**: Removed `Function()` (eval equivalent) from ScientificCalculator — replaced with safe custom expression tokenizer/parser that only allows numbers and basic operators
- **BUG FIX**: FractionCalculator now guards against division by zero when second fraction's numerator is 0
- **BUG FIX**: BodyFatCalculator validates waist > neck (male) and waist+hip > neck (female) before computing log10 to prevent NaN results
- **BUG FIX**: ScientificCalculator 1/x now guards against x=0; factorial uses iterative approach with n≤170 cap to prevent stack overflow
- **BUG FIX**: CompoundInterestCalculator daily compounding fixed — now uses effective monthly rate formula `(1+r/n)^(n/12)-1` which correctly handles all compounding frequencies (daily, monthly, quarterly, semi-annual, annual)
- **IMPROVEMENT**: CurrencyConverter now displays disclaimer that exchange rates are approximate/educational only
- **89 calculators** fully implemented across all 6 categories — no "coming soon" placeholders

### Calculator Expansion (March 2, 2026)
- Added 25 new high-search-volume calculators:
  - **Financial (10)**: SalaryCalculator, IncomeTaxCalculator, SavingsCalculator, AutoLoanCalculator, ROICalculator, InflationCalculator, DiscountCalculator, ProfitMarginCalculator, CreditCardPayoffCalculator, RetirementCalculator
  - **Health (6)**: PregnancyCalculator, TDEECalculator, MacroCalculator, BMRCalculator, OvulationCalculator, PaceCalculator
  - **Conversion (9)**: VolumeConverter, DataConverter, EnergyConverter, PowerConverter, FuelCalculator, ElectricityCostCalculator, SquareFootageCalculator, HoursCalculator, AverageCalculator
- New subcategories added: Tax & Salary, Women's Health, Fitness, Volume & Energy, Data & Fuel, Practical Tools
- SEO: Added robots.txt (blocks /embed/), sitemap.xml (109 URLs incl. blog posts & topics), noindex on EmbedPage
- SEO: Fixed index.html fallback meta tags (300+ → 89+), added OG url/site_name, Twitter Card tags, theme-color, canonical URL
- Performance: Trimmed Google Fonts from 25+ families to Inter + Fira Code only (massive page load improvement)

### UI/UX Fixes (March 2, 2026)
- **Counter Fix**: Updated "300+" references to actual dynamic count (89) using `getCalculatorCount()` in Home.tsx, SearchBar.tsx, About.tsx
- **Print Fix**: Calculator widget hidden during print (`print:hidden` on LazyCalculator wrapper); only calculation details/history print. Navbar, Footer, CategorySidebar, breadcrumbs, mobile toggle all hidden via `print:hidden`. Sidebar margin removed during print (`print:!ml-0`).
- **Embed Branding**: Embed code now includes HTML comment attribution, "Powered by The Calc Universe" paragraph with links, and branded iframe title. EmbedPage already has sticky footer with thecalcuniverse.com link.

### Bug Audit & Fixes (March 2, 2026)
- **BUG FIX**: EmbedPage now uses shared `LazyCalculator` from calculatorLoader.tsx instead of a duplicate registry — all 89 calculators now work in embeds (was only 42 before)
- **BUG FIX**: Removed duplicate calculator headings from BMICalculator, PercentageCalculator, TipCalculator, PowerConverter (CardTitle duplicated the page h1)
- **BUG FIX**: Footer logo changed from nested `<button>` inside `<Link>` (invalid HTML) to a single `<Link>` element
- **"Powered by The Calc Universe"** added to LazyCalculator wrapper (appears below all 89 calculators) and to EmbedPage header

### Implemented Features
- **89 Functional Calculators**: All categories fully implemented with client-side logic
- **Premium UI Animations**: Framer Motion page transitions, staggered card animations, animated counters, floating elements, glassmorphism navbar with scroll effects
- **Enhanced Mortgage Calculator**: Interactive charts (pie, area, bar), yearly/monthly amortization schedules, advanced cost options (property tax, insurance, PMI with auto-drop, HOA, other costs)
- **Navigation System**: Mega menu with animated dropdowns, mobile hamburger menu, search with autocomplete
- **Dark/Light Mode**: Theme toggle with localStorage persistence and system preference detection
- **SEO Components**: Dynamic meta tags, Open Graph tags, and structured data (schema.org) for calculators, breadcrumbs, and FAQs
- **Core Pages**: Homepage with animated hero/categories/popular calculators, Category pages, Calculator pages with FAQs and related tools, About, Contact, Blog, Privacy, Terms
- **Sidebar Highlighting**: ActiveCategoryContext syncs scroll position to sidebar highlighting on /calculators page
- **Embed Widget**: Displays embed URL with preview link, branded embed code with attribution

### Architecture Note
**This is a 100% frontend application.** The Express server only serves static files - there are no API routes or database operations. All calculator logic runs entirely in the browser.

### Security Posture
- No `eval()`, `Function()`, or `new Function()` anywhere in the codebase
- Custom safe expression parser for ScientificCalculator (tokenizer allows only digits, operators, parentheses)
- SimpleCalculator uses its own safe tokenizer
- All user inputs validated with `parseFloat`/`parseInt` + `isNaN` checks before use
- Division by zero handled across all calculators
- `dangerouslySetInnerHTML` used only in chart.tsx for CSS variable injection (internal config only)
- localStorage data parsed in try-catch blocks
- Calculator component loading uses hardcoded allowlist registry (no dynamic imports from URL)

### Known Limitations
- SEO is client-side rendered (JavaScript required for bots to see meta tags)
- Calculator data is static in `calculatorData.ts`
- Currency converter uses static exchange rates (educational purposes disclaimer shown)
- Newsletter subscription is UI-only (no backend integration)

### Next Steps (Backlog)
1. Consider SSR/prerendering for better SEO bot compatibility
2. Add more calculator-specific FAQs and examples

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript for type safety and modern component patterns
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing (SPA architecture)
- TanStack Query for server state management and caching

**UI Component System:**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design-influenced approach emphasizing clarity, polish, and visual hierarchy
- Comprehensive design system defined in `design_guidelines.md` covering typography, spacing, layout, and component patterns

**State Management:**
- React Context API for global theme state (light/dark mode)
- Local component state for calculator inputs and results
- Browser localStorage for optional calculation history (client-side only)
- No server-side data persistence for calculator values (privacy-focused)

**Key Design Decisions:**
- All calculations run entirely in the browser - no data sent to servers
- Mobile-first responsive design with breakpoint-specific layouts
- Sticky navigation with mega menu for desktop, slide-in drawer for mobile
- Search-as-you-type calculator discovery with autocomplete
- Client-side routing with breadcrumb navigation for SEO and UX

### Server (Static File Hosting Only)

**Note: No Backend Logic**
The server exists only to serve static files. There are NO API routes, NO database operations, and NO server-side calculations.

**Server Setup:**
- Express.js serving static files only
- Development: Vite dev server with HMR for fast iteration
- Production: Pre-built static assets served by Express
- `server/routes.ts` is empty (placeholder for future expansion if needed)

**Build Process:**
- Separate client (Vite) and server (esbuild) build pipelines
- Static assets compiled to `dist/public`, server to `dist/index.cjs`

### Data Storage

**Current State: None Required**
- No database is used - all data stays in the browser
- Calculator inputs/results are stored in React component state
- Theme preference stored in browser localStorage
- Template files exist for Drizzle ORM but are not actively used

### External Dependencies

**UI Component Libraries:**
- Radix UI: 20+ primitive components (@radix-ui/react-*)
- Provides accessible, unstyled foundation for custom UI components
- Includes accordion, dialog, dropdown, select, slider, tabs, toast, and more

**Styling & Utilities:**
- Tailwind CSS with PostCSS for processing
- class-variance-authority for component variant management
- clsx + tailwind-merge for conditional class composition

**Form Handling:**
- React Hook Form with Zod resolvers for validation
- Type-safe form schemas derived from Drizzle models

**Database & ORM:**
- Drizzle ORM configured for PostgreSQL
- @neondatabase/serverless for edge-compatible database connections
- drizzle-zod for schema-to-Zod validation bridge
- Migration system configured (not yet populated)

**Development Tools:**
- Replit-specific plugins for error overlay, cartographer, dev banner
- TypeScript with strict mode enabled
- ESM module system throughout

**Runtime Environment:**
- Node.js/Express for server
- Supports both development (tsx) and production (node) execution
- Environment variables expected: `DATABASE_URL` (when database is used)

**Fonts:**
- Google Fonts: Inter (primary), DM Sans, Fira Code, Geist Mono, Architects Daughter
- System font fallbacks for body text

**Notable Architectural Choices:**
1. **No authentication system currently implemented** - User schema exists but auth flow not built
2. **Client-side calculator logic** - All computation happens in browser for privacy and performance
3. **Static data model** - Calculator catalog defined in `calculatorData.ts` rather than database
4. **Modular calculator components** - Each calculator type is a separate component with consistent interface
5. **SEO-friendly routing** - URL structure follows `/:categoryId/:calculatorId` pattern
6. **Theme system** - Light/dark mode with localStorage persistence and system preference detection