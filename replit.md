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
The application uses **SQLite** (development) and **Turso** (production) with **Drizzle ORM** for type-safe database operations.

**Schema Design:**
- **Properties table**: Core real estate listings with pricing, location, and property details
- **Projects table**: Construction project portfolio with status tracking
- **Contacts table**: Customer inquiry management
- **Shared attributes**: All entities include timestamps and UUID primary keys
- **Flexible data types**: JSON arrays for image storage, enums for status fields

**Database Decisions:**
- **Development**: SQLite with better-sqlite3 for local development (zero configuration)
- **Production**: Turso Database for distributed SQLite at the edge
- **Drizzle ORM** chosen over Prisma for better TypeScript integration and SQL-like query building
- **Unified codebase**: Same schema works for both SQLite and Turso seamlessly

### Authentication & Authorization
The application implements secure authentication using **Passport.js** with local strategy:
- **Password hashing**: Scrypt algorithm with random salt (16 bytes)
- **Timing-safe comparison**: Protection against timing attacks
- **Secure sessions**: Secure session management with httpOnly and secure cookies
- **Protected routes**: Admin endpoints require authentication
- **Default admin**: Created automatically on first run (credentials should be changed in production)

### State Management
**Client-side state** is managed through a combination of:
- **TanStack Query** for server state (API data, caching, synchronization)
- **React Hook Form** for form state management
- **Local component state** for UI interactions
- **URL state** for filters and navigation

### API Design
The REST API follows conventional HTTP methods and status codes with **58 fully implemented routes** covering all application features:

**Route Categories:**
- **Authentication** (4 routes): Login, logout, user info, password change
- **Properties** (5 routes): CRUD operations for real estate listings
- **Projects** (5 routes): Construction project portfolio management
- **Condominiums** (5 routes): Condominium listings and management
- **Contacts** (3 routes): Customer inquiry handling
- **Categories** (5 routes): Property categorization
- **Cities** (5 routes): Location management
- **Hero Settings** (6 routes): Homepage banner configuration
- **About Us** (5 routes): Company information sections
- **Employees** (5 routes): Staff directory management
- **Database** (7 routes): Database testing and migration tools
- **Upload** (2 routes): Image upload and management
- **SEO** (1 route): Dynamic sitemap generation

**API Features:**
- **Query parameter filtering** for properties (type, location, price range)
- **Authentication protection** on all admin routes using Passport.js middleware
- **Validation middleware** using Zod schemas for type-safe request handling
- **Consistent error handling** with structured JSON responses
- **CORS and security headers** configured for production deployment
- **File upload security** with type validation, size limits, and path traversal protection
- **Image optimization** with automatic WebP conversion using Sharp

**Route Status**: All routes are fully implemented and production-ready. See `ROUTES-STATUS.md` for complete API documentation.

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
- Memory-based session store for development
- Distributed session management in production

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
- **SQLite** - Lightweight SQL database engine for development
- **Turso** - Distributed SQLite for edge computing and production
- **better-sqlite3** - Synchronous SQLite bindings for Node.js
- **@libsql/client** - LibSQL client for Turso connections

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
- **Drizzle ORM** - Type-safe database toolkit with SQLite support
- **Drizzle Kit** - Database migration and introspection tools
- **Zod** - Runtime type validation for API requests and responses

### State & Forms
- **TanStack Query** - Powerful data synchronization for React applications
- **React Hook Form** - Performant forms with easy validation
- **@hookform/resolvers** - Zod integration for form validation

### Development Environment
- **Replit** - Cloud development environment with specialized Replit plugins
- **TSX** - TypeScript execution for development server
- **MemoryStore** - In-memory session store for development

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
- `TURSO_DATABASE_URL` - Turso database URL (format: libsql://database-name.turso.io)
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `SESSION_SECRET` - Random secret for sessions (minimum 32 characters, recommended 64+)
- `NODE_ENV` - Set to `production`

**Development:**
- `SESSION_SECRET` - Random secret for sessions
- `SQLITE_FILE` - Path to SQLite database file (default: ./database.db)

**Recommended:**
- `ADMIN_EMAIL` - Initial admin email
- `ADMIN_PASSWORD` - Initial admin password (change after first login!)
- `BASE_URL` - Production URL (e.g., https://carmigui.com)

### Environment Security & Validation

**Runtime Validation** (`server/env-validator.ts`):
The application validates all critical environment variables before startup with multiple security checks:

**SESSION_SECRET Validation:**
- Minimum 32 characters required (error if less)
- Recommended 64+ characters (warning if 32-63)
- Rejects weak/default values (e.g., "secret", "password", example values)
- Entropy checking to ensure randomness
- Blocks common insecure patterns

**Turso Database Validation (Production):**
- Must have TURSO_DATABASE_URL and TURSO_AUTH_TOKEN defined
- Must use libSQL protocol (`libsql://`)
- Rejects localhost connections in production

**Startup Protection:**
- Application exits immediately if critical validations fail
- Clear error messages guide configuration fixes
- Prevents deployment with insecure configurations

**Security Files:**
- `.env.example` - Comprehensive template with security best practices
- `SECURITY-ENV.md` - Complete security documentation for environment variables
- `.gitignore` - Prevents accidental commit of `.env` files

### Deployment Process

1. **Prepare Database** - Create Turso database and obtain credentials
2. **Configure Environment** - Set all required variables in Vercel dashboard
3. **Deploy** - Push to main branch or use Vercel CLI
4. **Verify** - Run through deployment checklist
5. **Secure** - Change default admin password immediately

### Production Considerations

**Database:**
- Development uses SQLite (local file, zero configuration)
- Production uses Turso (distributed SQLite at the edge)
- Turso provides global low-latency access with automatic replication
- Generous free tier with pay-as-you-grow pricing

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