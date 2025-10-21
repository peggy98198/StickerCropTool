# Sticker Crop Tool

## Overview

This is a web application for processing 4000×8000px PNG images into sticker formats for KakaoTalk and Naver OGQ emoticon platforms. The tool automatically splits large images into individual stickers and resizes them according to platform-specific requirements.

**Key Features:**
- Splits 4000×8000px images into 32 individual 1000×1000px stickers (4 columns × 8 rows)
- KakaoTalk mode: Optionally resizes stickers to 360×360px
- OGQ mode: Crops stickers to 740×640px center and generates platform-specific main (240×240px) and tab (96×74px) images
- Client-side image processing using HTML5 Canvas API
- Batch download functionality with platform-specific file naming

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety
- Vite as the build tool for fast development and optimized production builds
- Single-page application (SPA) architecture with wouter for routing

**UI Component Strategy:**
- shadcn/ui component library based on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Material Design-inspired utility-focused approach prioritizing workflow clarity
- CSS variables for theming with platform-specific colors (KakaoTalk yellow #FFEB3B, OGQ green #10B981)

**State Management:**
- Local React state (useState) for image processing workflow
- No global state management library - component-local state is sufficient for this single-page tool
- TanStack Query (React Query) configured but minimal backend interaction

**Image Processing Architecture:**
- Client-side only processing using browser Canvas API
- No server-side image manipulation
- Workflow states: upload → platform selection → crop/resize → download
- State tracking: original image, cropped images array, current size, platform type, OGQ-specific images

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Minimal backend - primarily serves the static frontend
- Development mode includes Vite middleware for HMR
- Production mode serves pre-built static assets

**Database Layer:**
- Drizzle ORM configured for PostgreSQL via Neon serverless
- Minimal schema (users table only) - suggests future authentication feature
- Current implementation uses in-memory storage (MemStorage class)
- Database not required for core sticker processing functionality

**Session Management:**
- connect-pg-simple configured for PostgreSQL session storage
- Currently unused - no authentication implemented

### External Dependencies

**Database:**
- Neon serverless PostgreSQL (@neondatabase/serverless v0.10.4)
- Configured via DATABASE_URL environment variable
- Not actively used in current implementation

**UI Libraries:**
- Radix UI components for accessible primitives (dialogs, dropdowns, tooltips, etc.)
- Lucide React for icons
- Tailwind CSS for utility-first styling
- class-variance-authority (cva) for component variant management

**Development Tools:**
- Replit-specific plugins for development environment integration
- TypeScript for type checking
- PostCSS with Autoprefixer for CSS processing

**Design System:**
- Custom color palette with platform-specific branding colors
- HSL color values for theme consistency
- Spacing scale based on Tailwind's standard units (2, 4, 6, 8)
- Typography using system font stack for performance

### Architectural Decisions

**Client-Side Image Processing:**
- **Decision:** Process images entirely in the browser using Canvas API
- **Rationale:** Eliminates need for file uploads, reduces server load, provides instant feedback
- **Trade-off:** Limited by browser memory for very large images, but acceptable for target 4000×8000px size

**No Authentication System:**
- **Decision:** Tool operates without user accounts
- **Rationale:** Utility tool for single-user sessions, no data persistence needed
- **Note:** Database schema exists but is unused, suggesting potential future feature

**Static Frontend with Minimal Backend:**
- **Decision:** Express server primarily serves static assets
- **Rationale:** Core functionality is client-side; server mainly needed for development tooling
- **Benefit:** Easy deployment, minimal server resources required

**TypeScript Throughout:**
- **Decision:** Full TypeScript implementation for both client and server
- **Rationale:** Type safety for image processing logic, better developer experience
- **Configuration:** Strict mode enabled with ESNext modules

**Component Library Choice:**
- **Decision:** shadcn/ui built on Radix UI rather than full framework like Material-UI
- **Rationale:** Customizable, accessible components without heavy framework overhead
- **Benefit:** Tree-shakeable, only includes used components in bundle