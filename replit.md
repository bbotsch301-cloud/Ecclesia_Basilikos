# The New Covenant Trust Website

## Overview

The New Covenant Trust is a modern, responsive website focused on teaching spiritual freedom and sovereignty within the Christian faith. The platform has been transformed into a comprehensive **student platform** with user authentication, course enrollment, and secure access to educational materials. The site educates visitors about covenant relationships with Christ, exposes counterfeit systems, and provides structured learning paths for believers to understand their true identity and inheritance through biblical education.

## Recent Changes (August 21, 2025)

✓ Transformed educational center into full student platform
✓ Implemented user registration and authentication system  
✓ Added PostgreSQL database with course management
✓ Created enrollment system for structured learning
✓ Set up object storage for secure file downloads
✓ Added sample courses and downloadable resources
✓ Built comprehensive forum system for user communication
✓ Added course lessons with biblical content structure
✓ Maintained exclusive use of King James Version (KJV) scriptures
✓ Implemented comprehensive page content management system for admin dashboard
✓ Replaced technology imagery with spiritual content (open Bible, peaceful landscapes)
✓ Created content tracking system to monitor all website image and text changes

## User Preferences

Preferred communication style: Simple, everyday language.
Scripture versions: King James Version (KJV) exclusively

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing without unnecessary complexity
- **Styling**: Tailwind CSS with custom covenant-themed color variables and Shadcn/ui component library
- **Typography**: Multi-font system using Playfair Display for headings, Inter for body text, and Georgia for scripture quotes
- **State Management**: TanStack Query for server state management with optimistic updates
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful endpoints with structured error handling and request logging
- **Storage Layer**: Abstracted storage interface supporting both in-memory (development) and database implementations
- **Validation**: Zod schemas shared between frontend and backend for consistent data validation
- **Development**: Hot reload with Vite integration for seamless full-stack development

### Data Storage
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection**: Neon Database serverless PostgreSQL for scalable cloud deployment
- **Tables**: Users, contacts, and newsletter subscribers with UUID primary keys
- **Development Storage**: In-memory storage implementation for local development without database dependency

### API Endpoints
- **Contact Form**: `POST /api/contact` - Handles visitor inquiries with validation
- **Newsletter**: `POST /api/newsletter` - Manages email subscriptions with duplicate prevention
- **Error Handling**: Structured error responses with appropriate HTTP status codes
- **Request Logging**: Comprehensive logging for API requests with performance metrics

### Authentication & Authorization
- **Current State**: Basic infrastructure in place with user schema
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Future Implementation**: Ready for role-based access control and user authentication

### UI Component System
- **Design System**: Shadcn/ui with custom covenant theme integration
- **Accessibility**: ARIA-compliant components with keyboard navigation support
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Custom Components**: Hero sections, feature cards, scripture quotes, and navigation components

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Environment Configuration**: DATABASE_URL environment variable for database connectivity

### Development Tools
- **Replit Integration**: Custom plugins for development environment optimization
- **Error Overlay**: Runtime error modal for enhanced debugging experience
- **Code Mapping**: Source map integration for better error tracking

### Content Delivery
- **Unsplash**: External image service for high-quality background images and stock photography
- **Google Fonts**: Web font delivery for Playfair Display, Inter, and Georgia typefaces
- **Font Awesome**: Icon library for additional UI elements

### Frontend Libraries
- **Radix UI**: Headless component primitives for accessible UI components
- **Lucide React**: Icon system for consistent iconography throughout the application
- **Class Variance Authority**: Type-safe variant handling for component styling
- **Date-fns**: Date manipulation and formatting utilities

### Build & Development
- **ESBuild**: Fast JavaScript bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **TypeScript**: Static type checking across the entire application stack