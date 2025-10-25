# CARMIGUI Real Estate Platform

## Overview

CARMIGUI is a full-stack real estate platform designed for the Angolan market, specializing in property listings and construction project showcases. The application provides a comprehensive solution for property management, construction portfolio display, and customer contact management. Built with modern web technologies, it features a responsive design with Portuguese language support and offers both public-facing pages and administrative functionality.

## Contact Information
- **Phone**: 945 806 968 | 957 970 662
- **Email**: carmiguicomercialda@gmail.com
- **Brand Identity**: Green and yellow color scheme transmitting confidence, growth and accessibility

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React 18** with **TypeScript** and follows a component-based architecture. The UI leverages **shadcn/ui** components built on top of **Radix UI primitives**, providing a consistent and accessible design system. **Tailwind CSS** handles styling with a custom theme supporting CARMIGUI-specific colors and branding.

**Key Frontend Decisions:**
- **Wouter** for client-side routing instead of React Router, chosen for its lightweight footprint
- **TanStack Query** for server state management, providing caching, background updates, and optimistic updates
- **React Hook Form** with **Zod** validation for type-safe form handling
- Component co-location strategy with shared UI components in `/components/ui/`
- Pages organized by feature in `/pages/` directory

### Backend Architecture
The server follows a **RESTful API** architecture built with **Express.js** and **TypeScript**. The application uses a clean separation between route handlers, storage layer, and database operations.

**Key Backend Decisions:**
- **Express.js** chosen for its simplicity and extensive middleware ecosystem
- **Modular route organization** with centralized error handling
- **Storage abstraction layer** (`IStorage` interface) enabling easy database switching
- **Request/response logging middleware** for development debugging
- **Vite integration** for development hot module replacement

### Database Design
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations and migrations.

**Schema Design:**
- **Properties table**: Core real estate listings with pricing, location, and property details
- **Projects table**: Construction project portfolio with status tracking
- **Contacts table**: Customer inquiry management
- **Shared attributes**: All entities include timestamps and UUID primary keys
- **Flexible data types**: JSON arrays for image storage, enums for status fields

**Database Decisions:**
- **Drizzle ORM** chosen over Prisma for better TypeScript integration and SQL-like query building
- **Neon Database** integration for serverless PostgreSQL hosting
- **Migration-based schema management** for version control and deployment safety

### Authentication & Authorization
The application implements secure authentication using **Passport.js** with local strategy:
- **Password hashing**: Scrypt algorithm with random salt (16 bytes)
- **Timing-safe comparison**: Protection against timing attacks
- **Secure sessions**: PostgreSQL-backed sessions with httpOnly and secure cookies
- **Protected routes**: Admin endpoints require authentication
- **Default admin**: Created automatically on first run (credentials should be changed in production)

### State Management
**Client-side state** is managed through a combination of:
- **TanStack Query** for server state (API data, caching, synchronization)
- **React Hook Form** for form state management
- **Local component state** for UI interactions
- **URL state** for filters and navigation

### API Design
The REST API follows conventional HTTP methods and status codes:
- **GET** `/api/properties` - Property listings with filtering
- **POST** `/api/properties` - Create new property
- **PUT** `/api/properties/:id` - Update existing property
- **DELETE** `/api/properties/:id` - Remove property
- Similar patterns for projects and contacts endpoints

**API Features:**
- **Query parameter filtering** for properties (type, location, price range)
- **Validation middleware** using Zod schemas
- **Consistent error handling** with structured JSON responses
- **CORS and security headers** configured for production deployment

### Security Measures
The application implements multiple layers of security protection (detailed in `SECURITY.md`):

**Rate Limiting:**
- **Global limiter**: 100 requests per 15 minutes per IP
- **Auth limiter**: 5 login attempts per 15 minutes per IP (critical for brute force protection)
- **API limiter**: 30 API requests per minute per IP

**HTTP Security Headers (Helmet.js):**
- Content Security Policy (CSP) to prevent XSS attacks
- X-Frame-Options to prevent clickjacking
- Strict-Transport-Security for HTTPS enforcement
- X-Content-Type-Options to prevent MIME sniffing

**CORS Protection:**
- Production: Only `https://carmigui.com` and `https://www.carmigui.com` allowed
- Development: Localhost access for testing
- Credentials support for session cookies

**Input Validation:**
- File upload: Type validation (images only), size limit (5MB), max files (10)
- Request payload: Limited to 10MB to prevent memory attacks
- Zod schema validation on all API inputs

**Session Security:**
- HttpOnly cookies (prevents JavaScript access)
- Secure flag in production (HTTPS only)
- 7-day expiration with automatic cleanup
- PostgreSQL session store for persistence

### Styling & Theming
The application uses a **design system approach** with:
- **CSS custom properties** for theme variables
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library for consistent UI patterns
- **Responsive design** with mobile-first approach
- **CARMIGUI-specific color palette** reflecting local branding with green and yellow tones
- **Poppins font** as the single typography family across all text (headings, body, mono)

## External Dependencies

### Database Services
- **Neon Database** - Serverless PostgreSQL hosting with connection pooling
- **WebSocket support** for real-time database connections via `@neondatabase/serverless`

### UI & Styling Libraries
- **Radix UI** - Accessible component primitives for complex UI elements
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Icon library providing consistent iconography
- **shadcn/ui** - Pre-built component library built on Radix UI

### Development & Build Tools
- **Vite** - Fast build tool and development server with hot module replacement
- **TypeScript** - Type safety across the entire application stack
- **ESBuild** - Fast JavaScript bundler for production builds
- **PostCSS** - CSS processing with Tailwind CSS integration

### Data Management
- **Drizzle ORM** - Type-safe database toolkit with PostgreSQL dialect
- **Drizzle Kit** - Database migration and introspection tools
- **Zod** - Runtime type validation for API requests and responses

### State & Forms
- **TanStack Query** - Powerful data synchronization for React applications
- **React Hook Form** - Performant forms with easy validation
- **@hookform/resolvers** - Zod integration for form validation

### Development Environment
- **Replit** - Cloud development environment with specialized Replit plugins
- **TSX** - TypeScript execution for development server
- **Connect-PG-Simple** - PostgreSQL session store for Express sessions

## Deployment & Production

### Deployment Configuration
The application is configured for deployment on **Vercel** with the following setup:

**Files Created for Deployment:**
- `.env.example` - Documentation of all required environment variables
- `vercel.json` - Vercel-specific configuration for serverless deployment
- `DEPLOY.md` - Complete deployment documentation with step-by-step instructions
- `DEPLOY-QUICKSTART.md` - Quick 10-minute deployment guide
- `DEPLOY-CHECKLIST.md` - Comprehensive pre/post-deployment checklist
- `SCRIPTS-PACKAGE.md` - Required package.json scripts documentation

**Deployment Scripts:**
- `scripts/validate-env.js` - Validates all required environment variables
- `scripts/db-migrate.js` - Safe database migration script

**Required Scripts (to be added to package.json):**
- `db:migrate` - Execute database migrations safely
- `validate:env` - Validate environment configuration
- `predeploy` - Pre-deployment validation (env + TypeScript check)
- `vercel-build` - Vercel build script (migrations + build)

### Environment Variables Required for Production

**Critical (Must Have):**
- `DATABASE_URL` - PostgreSQL connection string (recommend Neon Database)
- `SESSION_SECRET` - Random secret for sessions (minimum 32 characters)
- `NODE_ENV` - Set to `production`

**Recommended:**
- `ADMIN_EMAIL` - Initial admin email
- `ADMIN_PASSWORD` - Initial admin password (change after first login!)
- `BASE_URL` - Production URL (e.g., https://carmigui.com)

### Deployment Process

1. **Prepare Database** - Create PostgreSQL database (Neon recommended)
2. **Configure Environment** - Set all required variables in Vercel dashboard
3. **Deploy** - Push to main branch or use Vercel CLI
4. **Verify** - Run through deployment checklist
5. **Secure** - Change default admin password immediately

### Production Considerations

**Database:**
- Must use PostgreSQL in production (SQLite is development-only)
- Neon Database recommended for serverless compatibility
- Automatic migrations via `vercel-build` script

**File Uploads:**
- Vercel is serverless - local uploads don't persist
- Configure Vercel Blob Storage, Cloudinary, or AWS S3 for production images
- See DEPLOY.md for detailed storage configuration

**Security:**
- All security measures (rate limiting, Helmet, CORS) are production-ready
- Change default admin credentials immediately after first deploy
- Use strong SESSION_SECRET (generate with crypto.randomBytes)

**Monitoring:**
- Logs available in Vercel dashboard
- Recommended: Configure Sentry for error tracking
- Recommended: Set up uptime monitoring

### Quick Deploy Commands

```bash
# Validate environment
npm run validate:env

# Deploy to Vercel (via CLI)
vercel --prod

# Check deployment
vercel logs --follow
```

For detailed instructions, see `DEPLOY.md` and `DEPLOY-QUICKSTART.md`.