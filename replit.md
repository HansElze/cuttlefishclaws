# Cuttlefish Labs Infrastructure DAO Landing Page

## Project Overview
A professional React-based landing page for Cuttlefish Labs Infrastructure DAO, featuring modern design, subscription forms, and comprehensive company information. Built with TypeScript, Tailwind CSS, and optimized for static deployment on Netlify.

## Recent Changes
✓ **2025-01-05**: Added Cuttlefish AI Guide Sidebar
  - Created interactive 3D model viewer using Google Model Viewer
  - Implemented AI chat interface with OpenAI integration
  - Added floating action button with gradient design
  - Built fallback chat responses for when OpenAI quota is exceeded
  - Integrated sidebar into main application with responsive design
  - Added loading states and professional UI styling

✓ **2025-01-04**: Fixed Netlify deployment issues
  - Diagnosed "broken link" deployment problems
  - Updated netlify.toml with correct build settings
  - Added comprehensive troubleshooting documentation
  - Created static-only whitepaper form component
  - Removed React Query dependencies for static build
  - Added _redirects file for SPA routing support
  
✓ **Earlier**: Initial Netlify conversion
  - Removed backend API dependencies for static hosting
  - Implemented Netlify Forms for subscription handling
  - Fixed icon imports to use Lucide React instead of react-icons

✓ **Initial Build**: Complete landing page implementation
  - All sections from original HTML converted to React components
  - Professional gradient design system
  - Responsive navigation with smooth scrolling
  - Working subscription form with validation

## Project Architecture

### Frontend Only (Static Deployment)
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom gradient themes
- **UI Components**: Radix UI + shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Forms**: Netlify Forms integration
- **Deployment**: Netlify (static hosting)

### Key Components
- Navigation with smooth scrolling
- Hero section with compelling messaging
- About section explaining AI infrastructure challenges
- Token sale information with roadmap timeline
- Team and partners sections
- Newsletter subscription form (Netlify Forms)
- Professional footer with social links

### Deployment Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Forms**: Automatic Netlify Forms detection
- **Redirects**: SPA routing support configured

## User Preferences
- Simple, professional design focused on AI infrastructure
- Modern gradient themes (purple to cyan)
- Static deployment preferred for simplicity
- Newsletter form integration essential for lead capture

## Technical Decisions
- **Static-First**: Removed server dependencies for easier deployment
- **Netlify Forms**: Using platform-native form handling instead of custom backend
- **Component Structure**: Modular React components for maintainability
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Development Workflow
1. Local development: `npm run dev`
2. Build for production: `npm run build`
3. Deploy to Netlify: Auto-deploy from Git or manual upload

## Next Steps
- Deploy to Netlify using provided configuration
- Test form submissions in production
- Optional: Add custom domain and additional integrations