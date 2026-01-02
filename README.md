# Next.js Auth Boilerplate

A production-ready Next.js boilerplate with built-in authentication, admin panel, user management, and comprehensive styling infrastructure.

---

## Features

### Core Features
- **Authentication System** - Secure JWT-based authentication with httpOnly cookies
- **User Registration & Login** - Complete user management with email/password validation
- **Admin Panel** - Full-featured admin panel with permission system
- **User Management** - Admin can view, edit, and manage users
- **Protected Routes** - Middleware-based route protection
- **Role-Based Access** - Admin and user roles with permission control

### Technical Features
- **Next.js 16+** - Latest App Router with TypeScript
- **MongoDB Integration** - Pre-configured MongoDB Atlas connection
- **SCSS Modules** - Custom styling infrastructure with variables and mixins
- **Security Best Practices** - Password hashing (bcrypt), JWT tokens, httpOnly cookies
- **Responsive Design** - Mobile-first responsive layouts
- **Multi-Framework Templates** - Claude Code integration with `.claude/` directory

### Included Components
- Navigation with auth state
- Footer component
- Dashboard with user stats
- Admin panel with user management
- Welcome cards and info cards
- Auth forms (login/register)
- Reusable layouts (MainLayout, AuthLayout)

---

## Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Styling:** SCSS Modules (NO Tailwind or CSS frameworks)
- **Authentication:** JWT + httpOnly cookies
- **Security:** bcrypt password hashing
- **Sanitization:** DOMPurify for XSS protection

---

## Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Create free account](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone or download this repository:**
   ```bash
   git clone <your-repo-url>
   cd nextjs-auth-boilerplate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   ```

4. **Configure MongoDB:**

   Create a MongoDB Atlas database and get your connection string:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Set up database access (username/password)
   - Set up network access (allow your IP or 0.0.0.0/0 for development)
   - Get connection string from "Connect" → "Connect your application"

   Update `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database?retryWrites=true&w=majority
   JWT_SECRET=your-secure-random-string-here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Project Structure

```
nextjs-auth-boilerplate/
├── .claude/                     # Claude Code templates & personas
│   ├── agents/                  # Custom agent configurations
│   ├── docs/                    # AI development documentation
│   └── personas/                # Framework-specific personas
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── admin/               # Admin panel page
│   │   ├── dashboard/           # User dashboard
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── demo-auth/           # AuthLayout demo
│   │   ├── demo-main/           # MainLayout demo
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   └── admin/           # Admin endpoints
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable components
│   │   ├── Navigation/          # Navigation bar
│   │   ├── Footer/              # Footer component
│   │   ├── LoginForm/           # Login form
│   │   ├── RegisterForm/        # Registration form
│   │   ├── DashboardHeader/     # Dashboard header
│   │   ├── AdminHeader/         # Admin panel header
│   │   ├── WelcomeCard/         # User welcome card
│   │   ├── InfoCards/           # Information cards
│   │   ├── StageCompleteCard/   # Stage completion card
│   │   ├── SearchBar/           # Search component
│   │   ├── Pagination/          # Pagination component
│   │   └── Toast/               # Toast notifications
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication context
│   ├── layouts/                 # Layout components
│   │   ├── MainLayout/          # Main app layout
│   │   └── AuthLayout/          # Authentication layout
│   ├── lib/                     # Utilities & configs
│   │   ├── mongodb.ts           # MongoDB connection
│   │   ├── auth.ts              # Auth utilities
│   │   └── logger.ts            # Logging utility
│   ├── models/                  # Database models
│   │   └── Admin.ts             # User/Admin model
│   └── styles/                  # SCSS infrastructure
│       ├── main.scss            # Global styles
│       ├── _variables.scss      # SCSS variables
│       ├── _mixins.scss         # SCSS mixins
│       └── _themes.scss         # Theme definitions
├── public/                      # Static assets
├── .env.local                   # Local environment variables (create this)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database?retryWrites=true&w=majority

# JWT Secret (use a strong random string)
JWT_SECRET=your-secure-random-string-minimum-32-characters

# Optional: Node Environment
NODE_ENV=development

# Optional: App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Notes:**
- Never commit `.env.local` to version control
- Use a strong, random JWT_SECRET (32+ characters)
- In production, use environment-specific values

---

## Usage Guide

### Creating Your First Admin User

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Register a new user:**
   - Navigate to `http://localhost:3000/register`
   - Fill in the registration form
   - Submit to create your account

3. **Manually promote to admin** (via MongoDB):
   - Go to MongoDB Atlas
   - Find your user in the `users` collection
   - Update the `role` field to `"admin"`
   - Update `isAdmin` field to `true`

4. **Access admin panel:**
   - Navigate to `http://localhost:3000/admin`
   - You should now see the admin panel

### Customizing the Boilerplate

#### 1. Update Branding
- Change "YourApp" in `src/components/Navigation/Navigation.tsx:17`
- Update meta tags in `src/app/layout.tsx`
- Update package name in `package.json`

#### 2. Modify Landing Page
- Edit `src/app/page.tsx` to customize the home page
- Update feature cards to match your app's features
- Modify styles in `src/app/page.module.scss`

#### 3. Customize Dashboard
- Edit `src/app/dashboard/page.tsx` to add your dashboard content
- Add new stat cards or remove existing ones
- Update dashboard styles in `src/app/dashboard/Dashboard.module.scss`

#### 4. Add New Pages
```tsx
// src/app/your-page/page.tsx
import { MainLayout } from '@/layouts';

export default function YourPage() {
  return (
    <MainLayout>
      <div className="container">
        <h1>Your Page</h1>
      </div>
    </MainLayout>
  );
}
```

#### 5. Add Protected API Routes
```typescript
// src/app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your logic here
  return NextResponse.json({ data: 'Your data' });
}
```

#### 6. Customize Styling
- Edit SCSS variables in `src/styles/_variables.scss`
- Modify theme colors in `src/styles/_themes.scss`
- Add new mixins in `src/styles/_mixins.scss`
- Update global styles in `src/styles/main.scss`

---

## Authentication Flow

### Registration
1. User submits registration form
2. Backend validates email format and password strength
3. Password is hashed with bcrypt (12 rounds)
4. User is created in MongoDB
5. JWT token is generated
6. Token is stored in httpOnly cookie
7. User is redirected to dashboard

### Login
1. User submits login credentials
2. Backend verifies email and password
3. JWT token is generated
4. Token is stored in httpOnly cookie
5. User is redirected to dashboard

### Protected Routes
- Client-side: `useAuth()` hook checks authentication state
- Server-side: API routes validate JWT from cookies
- Automatic redirect to login if unauthenticated

---

## Admin Panel

The admin panel includes:
- **User Management** - View all users
- **User Editing** - Edit user details
- **User Verification** - Verify/unverify users
- **Role Management** - Promote/demote admin status
- **Search & Filter** - Find users quickly
- **Pagination** - Handle large user lists

### Admin Endpoints

```
GET  /api/admin/users          # Get all users (paginated)
GET  /api/admin/users/[id]     # Get single user
PUT  /api/admin/users/[id]     # Update user
POST /api/admin/users/[id]/verify  # Toggle verification
```

---

## Styling System

This boilerplate uses **SCSS Modules** with a custom architecture:

### SCSS Variables (`_variables.scss`)
- Colors, spacing, typography, breakpoints
- Customizable design tokens

### SCSS Mixins (`_mixins.scss`)
- Flexbox utilities
- Button styles
- Card styles
- Responsive helpers

### Component-Level Styles
Each component has its own `.module.scss` file for scoped styling.

### Global Styles
Global styles are in `src/styles/main.scss` and include reset, utilities, and theme setup.

---

## Claude Code Integration

This boilerplate includes a `.claude/` directory with:
- **Agents:** Custom agent configurations for development workflows
- **Docs:** Comprehensive AI development documentation
- **Personas:** Framework-specific personas for different tech stacks

You can use Claude Code to:
- Generate new components following the project's patterns
- Add API routes with proper authentication
- Create new pages with the correct layouts
- Implement features while maintaining code style

### Syncing Claude Config Updates

This boilerplate includes a **bi-directional sync system** for the `.claude/` directory:

**📥 Pull updates FROM boilerplate:**
```bash
# Preview what would change
npm run sync-claude:preview

# Sync Claude config from boilerplate
npm run sync-claude

# Force sync without confirmation
npm run sync-claude:force
```

**📤 Contribute improvements BACK to boilerplate:**
```bash
# Share your agent improvements with other projects
npm run contribute-claude
```

**Benefits:**
- Get latest agent improvements from boilerplate
- Share your improvements back to boilerplate
- Keep all projects synced with best practices
- Build a shared knowledge base across projects

**Documentation:**
- [CLAUDE_SYNC.md](./CLAUDE_SYNC.md) - Pull updates from boilerplate
- [BIDIRECTIONAL_SYNC.md](./BIDIRECTIONAL_SYNC.md) - Complete bi-directional workflow

---

## Security Features

- **Password Hashing:** bcrypt with 12 salt rounds
- **JWT Tokens:** Secure token generation with configurable expiry
- **httpOnly Cookies:** Prevents XSS token theft
- **Input Sanitization:** DOMPurify for user input
- **Validation:** Email format and password strength checks
- **Protected Routes:** Middleware-based authentication
- **Admin Verification:** Permission checks for admin actions

---

## Best Practices

### Code Organization
- Components in `src/components/`
- Pages in `src/app/`
- Utilities in `src/lib/`
- Models in `src/models/`
- Styles in `src/styles/` and component modules

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Files: camelCase for utils, PascalCase for components
- SCSS: kebab-case classes (e.g., `.user-profile`)
- Environment variables: UPPER_SNAKE_CASE

### TypeScript
- Use TypeScript for type safety
- Define interfaces for data structures
- Avoid `any` type when possible

### Styling
- Use SCSS modules for component styles
- Follow BEM-like naming for clarity
- Use CSS variables for theming
- Keep styles close to components

---

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has correct permissions

### Authentication Not Working
- Check JWT_SECRET is set in `.env.local`
- Verify cookies are being sent in requests
- Clear browser cookies and try again

### Build Errors
- Delete `node_modules/` and `.next/` folders
- Run `npm install` again
- Check for TypeScript errors with `npm run lint`

### Styling Issues
- Check SCSS import paths
- Verify SCSS variables are defined
- Clear `.next/` cache and rebuild

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (MONGODB_URI, JWT_SECRET)
   - Deploy

3. **Set up production MongoDB:**
   - Update MongoDB Atlas network access for Vercel IPs
   - Use production connection string in Vercel environment variables

### Other Platforms
- **Netlify:** Use `npm run build` and deploy `.next/` folder
- **Railway:** Connect GitHub repo and add environment variables
- **DigitalOcean:** Deploy with App Platform

---

## Demo Pages

This boilerplate includes demo pages for reference:
- `/demo-main` - Demonstrates MainLayout usage
- `/demo-auth` - Demonstrates AuthLayout usage

You can remove these pages in production by deleting:
- `src/app/demo-main/`
- `src/app/demo-auth/`

---

## License

MIT License - Feel free to use this boilerplate for personal and commercial projects.

---

## Contributing

This is a boilerplate template. Feel free to fork and customize for your needs.

If you find bugs or have suggestions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Check MongoDB Atlas documentation
- Review Next.js documentation

---

## Acknowledgments

- Built with Next.js, React, and TypeScript
- Authentication inspired by industry best practices
- SCSS architecture follows modern component-based patterns
- Claude Code integration for AI-assisted development

---

## Changelog

### Version 1.0.0 - Initial Release
- Core authentication system
- Admin panel with user management
- SCSS styling infrastructure
- MongoDB integration
- Protected routes
- Responsive design
- Claude Code integration
- Demo pages and documentation

---

**Happy coding!** 🚀
