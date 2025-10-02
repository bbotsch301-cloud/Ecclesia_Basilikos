# Ecclesia Basilikos

## Overview

**Ecclesia Basilikos** (Royal Assembly) is a comprehensive royal embassy website teaching Kingdom citizenship and covenant truth to believers called out of Babylon. The platform features a sophisticated royal aesthetic combining deep navy, imperial burgundy, and luminous gold with Cinzel Decorative typography, presenting 11 biblical comparison tables that expose Babylon's counterfeits and reveal Kingdom realities. The site educates visitors about their divine identity as royal priests, heavenly citizenship, and the eternal Kingdom established by Daniel 2:44 that shall consume all earthly kingdoms.

## Recent Changes (October 2, 2025)

### Major Transformation: Kingdom Ventures Trust → Ecclesia Basilikos

✓ **Complete Rebranding**: Transformed entire website from "Kingdom Ventures Trust" to "Ecclesia Basilikos"
✓ **Royal Design System**: Implemented serious, royal embassy aesthetic with deep navy (#0b1437), imperial burgundy (#4a1d30), luminous gold (#d7b46a)
✓ **Royal Typography**: Added Cinzel Decorative for royal headings, maintained Playfair Display and Georgia for complementary text
✓ **11 Biblical Comparison Tables**: Created comprehensive data structure containing all PDF comparison content (Two Births, Two Registries, Two Creations, Two Lands, Levitical systems, etc.)
✓ **New Royal UI Components**: Built RoyalHero, ComparisonCard, ScriptureBanner, PillarGrid for consistent royal aesthetic
✓ **New Pages Created**:
  - **Mandate Page** (`/mandate`): Daniel 2:44 focus with scriptural charge
  - **Covenant Repository** (`/repository`): Interactive showcase of all 11 comparison tables with filtering and modal viewers
✓ **Homepage Redesign**: Transformed into "Embassy of the Eternal Kingdom" with four-pillar architecture
✓ **Ecclesia Nation Page**: Updated with royal citizenship theme and Babylon vs Kingdom timeline
✓ **Royal Academy**: Rebranded courses page with references to comparison tables as foundational materials
✓ **Navigation Structure**: Updated to Mandate, Ecclesia Nation, Royal Academy, Covenant Repository, Embassy Forum
✓ **Thematic Shift**: From "Come out of her, my people" to royal embassy of the eternal Kingdom
✓ **Visual Elements**: Added ornamental borders, velvet backgrounds, marble textures, and parchment effects

### Previous Platform Features (Maintained)

✓ User registration and authentication system
✓ PostgreSQL database with course management
✓ Enrollment system for structured learning
✓ Object storage for secure file downloads
✓ Forum system for user communication (currently disabled)
✓ Course lessons with biblical content structure
✓ Exclusive use of King James Version (KJV) scriptures
✓ Trust document download page with email tracking
✓ Admin dashboard with content management

## User Preferences

**Preferred communication style**: Simple, everyday language  
**Scripture versions**: King James Version (KJV) exclusively  
**Design preference**: Serious, royal embassy aesthetic with formal tone  
**Theological framework**: New Covenant, Melchizedek priesthood, separation from Babylon

## Core Educational Content

### 11 Biblical Comparison Tables

The foundation of Ecclesia Basilikos educational content consists of 11 comprehensive comparison tables stored in `shared/comparisonData.ts`:

1. **Two Births**: Flesh (Cain's lineage) vs Spirit (Abel/Seth lineage)
2. **Two Registries**: Man's registration (birth certificate, SSN) vs Heaven's registry (Lamb's Book of Life)
3. **Two Creations**: Beast creation (legal fiction, corporate persons) vs God's creation (living soul)
4. **Two Lands**: Possession (territorial jurisdiction, eminent domain) vs Inheritance (divine grant, eternal)
5. **Levitical vs Currency System**: Tithe system vs taxation, mammon worship
6. **Levitical vs Babylon Trajectory**: Priesthood corruption leading to Babylonian captivity
7. **Two Legal Systems**: Statutes & ordinances (letter of law) vs Covenant law (written on hearts)
8. **501c3 vs 508c1a**: State-controlled churches vs ecclesiastical jurisdiction
9. **Two Governments**: State (territorial, coercive) vs Ecclesia (covenant community, voluntary)
10. **Levitical → Babylon → Melchizedek**: Transition from fallen priesthood to eternal order
11. **Two Priesthoods**: Levitical (earthly, temporal) vs Melchizedek (heavenly, eternal)

Each comparison table includes:
- Detailed descriptions of Babylon's counterfeit vs Kingdom reality
- Supporting scripture references (KJV)
- Biblical analysis and theological implications
- Visual representation via ComparisonCard components

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom royal-themed color variables
  - Royal Navy: `#0b1437`
  - Royal Burgundy: `#4a1d30`
  - Royal Gold: `#d7b46a`
  - Parchment: `#f5f1e8`
- **Typography**: 
  - **Cinzel Decorative**: Royal headings and titles
  - **Playfair Display**: Section headings
  - **Georgia**: Scripture quotes
  - **Inter**: Body text
- **Component Library**: Shadcn/ui with royal theme customization
- **State Management**: TanStack Query for server state with optimistic updates
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture

- **Server**: Express.js with TypeScript on Node.js
- **API Design**: RESTful endpoints with structured error handling
- **Storage Layer**: Abstracted interface supporting in-memory and database implementations
- **Validation**: Zod schemas shared between frontend and backend
- **Development**: Hot reload with Vite integration

### Data Storage

- **Database**: PostgreSQL via Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Core Tables**: 
  - `users`: Student accounts with authentication
  - `courses`: Course catalog and content
  - `enrollments`: Student course registrations
  - `trustDownloads`: Document access tracking
  - `contacts`: Contact form submissions
  - `newsletter`: Email subscription management
- **Object Storage**: Replit Object Storage for downloadable resources

### Page Structure

#### Core Pages

1. **Home** (`/`): Embassy of the Eternal Kingdom with four pillars
2. **Mandate** (`/mandate`): Scriptural charge with Daniel 2:44 and Revelation 18:4
3. **Ecclesia Nation** (`/nation`): Heavenly citizenship and royal priesthood
4. **Royal Academy** (`/courses`): Kingdom education platform with course enrollment
5. **Covenant Repository** (`/repository`): Interactive comparison table showcase
6. **About** (`/about`): Ecclesia Basilikos mission and scriptural foundation
7. **Contact** (`/contact`): Visitor inquiry form
8. **Trust Download** (`/trust-download`): Secure document access with email requirement
9. **Embassy Forum** (`/forum`): Community discussion (currently disabled)

#### Student Platform Pages

- `/course/:id/lesson/:lessonId`: Individual lesson content viewer
- `/admin/trust-downloads`: Admin dashboard for document downloads management

### Royal UI Components

Custom components built for consistent royal aesthetic:

- **RoyalHero**: Full-width hero sections with royal styling and optional scripture verses
- **ComparisonCard**: Interactive cards displaying Babylon vs Kingdom comparisons
- **ScriptureBanner**: Full-width scripture quote banners with dark/light themes
- **PillarGrid**: Four-column grid for homepage pillar showcase
- **RoyalNavigation**: Top navigation with gold accents and Cinzel typography

### API Endpoints

- `POST /api/contact`: Contact form submissions
- `POST /api/newsletter`: Newsletter subscriptions
- `POST /api/register`: User registration
- `POST /api/login`: User authentication
- `POST /api/logout`: Session termination
- `GET /api/me`: Current user session
- `GET /api/my-enrollments`: User's course enrollments
- `POST /api/enrollments`: Course enrollment creation
- `GET /api/course/:id`: Course details
- `GET /api/course/:id/lesson/:lessonId`: Lesson content
- `POST /api/trust-download`: Trust document download tracking
- `GET /api/admin/trust-downloads`: Admin analytics

### Authentication & Authorization

- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Password Security**: Bcrypt hashing with salt rounds
- **Role-based Access**: Admin role for dashboard access
- **Protected Routes**: Course content requires authentication
- **Enrollment Tracking**: Auto-enrollment system for seamless student experience

### Visual Design System

#### Color Palette

- **Primary**: Royal Navy (#0b1437) - Authority, stability, eternal Kingdom
- **Secondary**: Imperial Burgundy (#4a1d30) - Covenant blood, royal lineage
- **Accent**: Luminous Gold (#d7b46a) - Divine glory, heavenly treasures
- **Neutral**: Parchment (#f5f1e8) - Ancient scrolls, timeless truth

#### Background Patterns

- **Marble Background**: Subtle texture for content sections
- **Velvet Background**: Rich deep navy with burgundy gradient
- **Parchment**: Warm ancient scroll texture
- **Mountain Landscape**: CSS clip-path silhouette overlay

#### UI Elements

- **Royal Cards**: White cards with gold borders and subtle shadows
- **Royal Buttons**: Gold background with navy text, hover effects
- **Ornamental Borders**: Gold accent lines and decorative elements
- **Badge Styling**: Gold badges with Cinzel font for emphasis

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL with connection pooling
- **Environment Variable**: `DATABASE_URL`

### Object Storage
- **Replit Object Storage**: Secure file storage for downloadable resources
- **Public Directory**: `/public` for publicly accessible assets
- **Private Directory**: `/.private` for restricted downloads

### Development Tools
- **Replit Integration**: Custom Vite plugins for development optimization
- **Error Overlay**: Runtime error modal for debugging
- **Code Mapping**: Source map integration for error tracking

### Content Delivery
- **Unsplash**: High-quality background images
- **Google Fonts**: Cinzel Decorative, Playfair Display, Georgia, Inter
- **Lucide React**: Icon system for UI elements

### Frontend Libraries
- **Radix UI**: Accessible headless component primitives
- **TanStack Query**: Powerful data fetching and caching
- **React Hook Form**: Performant form validation
- **Zod**: TypeScript-first schema validation
- **Class Variance Authority**: Type-safe component variants
- **Tailwind Merge**: Efficient class name merging

### Build & Development
- **ESBuild**: Fast JavaScript bundling
- **PostCSS**: CSS processing with Tailwind
- **TypeScript**: Static type checking
- **Drizzle ORM**: Type-safe database access
- **Drizzle Kit**: Database migration tools

## Theological Framework

### Core Doctrines

1. **New Covenant in Christ's Blood**: All authority flows from Christ as Grantor
2. **Melchizedek Priesthood**: Believers operate as royal priests under eternal order
3. **Separation from Babylon**: Called out from world systems into Kingdom jurisdiction
4. **Heavenly Citizenship**: Primary allegiance to Christ, not earthly governments
5. **Daniel 2:44 Kingdom**: Eternal Kingdom that consumes all earthly kingdoms
6. **Revelation 18:4 Mandate**: "Come out of her, my people"

### Educational Philosophy

- Scripture as sole authority (King James Version exclusively)
- Exposure of Babylon's counterfeits through biblical comparison
- Emphasis on divine identity and royal inheritance
- Practical application of Kingdom principles
- Historical and theological context for covenant understanding

## Development Guidelines

### Code Organization

- **Shared Types**: `shared/schema.ts` for database models and validation
- **Comparison Data**: `shared/comparisonData.ts` for all PDF table content
- **Client Pages**: `client/src/pages/` for all route components
- **UI Components**: `client/src/components/ui/` for reusable elements
- **Server Routes**: `server/routes.ts` for API endpoint definitions
- **Storage Layer**: `server/storage.ts` for database abstraction

### Styling Conventions

- Use royal color variables consistently
- Cinzel Decorative for major headings only (performance consideration)
- Maintain gold accent borders on interactive elements
- Apply marble/velvet/parchment backgrounds appropriately
- Ensure responsive design with mobile-first approach

### Content Standards

- All scripture quotes in King James Version
- Serious, formal tone befitting royal embassy
- Biblical accuracy in theological content
- Clear distinction between Babylon and Kingdom systems
- Consistent use of "Ecclesia Basilikos" branding
