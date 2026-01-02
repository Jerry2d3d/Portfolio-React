# React and Next.js Development Rules

**Framework-specific guidelines for React and Next.js applications**

This document extends `.claude/docs/core-rules.md` with React and Next.js specific requirements.

## Table of Contents
1. [Next.js Project Structure](#nextjs-project-structure)
2. [React Component Patterns](#react-component-patterns)
3. [TypeScript Standards](#typescript-standards)
4. [Next.js Specific Features](#nextjs-specific-features)
5. [React Hooks Guidelines](#react-hooks-guidelines)
6. [Component Documentation](#component-documentation)

---

## Next.js Project Structure

### Folder Organization

```
src/
├── app/                # Next.js App Router pages
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   ├── login/
│   │   └── page.tsx    # Login page (composition only)
│   ├── dashboard/
│   │   └── page.tsx    # Dashboard page (composition only)
│   └── api/            # Next.js API routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       └── users/route.ts
├── components/         # React components
│   ├── Navigation/
│   │   ├── Navigation.tsx
│   │   └── Navigation.module.scss
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   └── Footer.module.scss
│   └── shared/
│       ├── Button/
│       ├── Input/
│       └── Modal/
├── contexts/           # React Context providers
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── lib/                # Utility functions
│   ├── api.ts
│   └── utils.ts
├── models/             # TypeScript interfaces/types
│   └── User.ts
└── styles/             # Global styles
    ├── _variables.scss
    ├── _mixins.scss
    └── globals.scss
```

---

## React Component Patterns

### Component File Structure

Every React component MUST follow this pattern:

**ComponentName.tsx:**
```tsx
'use client'; // Add if client component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ComponentName.module.scss';

interface ComponentNameProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

/**
 * ComponentName Component
 *
 * Description of what this component does
 *
 * @example
 * ```tsx
 * <ComponentName title="Hello" />
 * ```
 */
export default function ComponentName({
  title,
  onClick,
  children
}: ComponentNameProps) {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Side effects here
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}
```

**ComponentName.module.scss:**
```scss
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.container {
  padding: $spacing-lg;
  background: var(--bg-secondary);
}

.title {
  font-size: $font-size-xl;
  color: var(--text-primary);
  margin-bottom: $spacing-md;
}
```

### Import Order (React/Next.js Specific)

```tsx
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// 2. External libraries
import { logger } from '@/lib/logger';

// 3. Internal components
import Navigation from '@/components/Navigation/Navigation';
import Footer from '@/components/Footer/Footer';

// 4. Contexts and hooks
import { useAuth } from '@/contexts/AuthContext';
import { useCustomHook } from '@/hooks/useCustomHook';

// 5. Types
import type { User } from '@/models/User';

// 6. Styles (always last)
import styles from './Component.module.scss';
```

---

## TypeScript Standards

### Component Props Interface

**RULE #8: Explicit typing for component props**

```tsx
// ✅ GOOD: Clear interface for props
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant,
  onClick,
  disabled = false,
  children
}: ButtonProps) {
  return (
    <button
      className={styles[variant]}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ BAD: No types
export default function Button({ variant, onClick, disabled, children }) {
  // ...
}
```

### Event Handlers

**RULE #9: Type event handlers**

```tsx
// ✅ GOOD: Properly typed event handlers
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Form submission logic
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
  console.log('Button clicked');
};

// ❌ BAD: Untyped event handlers
const handleSubmit = (e) => { /* ... */ };
```

### State Typing

```tsx
// ✅ GOOD: Typed state
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState<boolean>(false);
const [items, setItems] = useState<string[]>([]);

// ✅ GOOD: Complex state typing
interface FormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<FormData>({
  email: '',
  password: ''
});
```

---

## Next.js Specific Features

### Server vs Client Components

```tsx
// Server Component (default in Next.js 13+)
// No 'use client' directive needed
export default async function ServerPage() {
  const data = await fetch('https://api.example.com/data');

  return (
    <div>
      <h1>Server Component</h1>
      {/* Can fetch data directly */}
    </div>
  );
}

// Client Component
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### API Routes

**Next.js 13+ App Router API Routes:**

```ts
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const users = await fetchUsers();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await createUser(body);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

### Data Fetching

```tsx
// Server Component with async/await
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store' // or 'force-cache' for static
  });

  const json = await data.json();

  return <div>{json.title}</div>;
}

// Client Component with useEffect
'use client';

export default function ClientPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

### Metadata (SEO)

```tsx
// src/app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page Title',
  description: 'Page description for SEO',
  keywords: ['keyword1', 'keyword2'],
};

export default function Page() {
  return <div>Content</div>;
}
```

---

## React Hooks Guidelines

### Custom Hooks

```tsx
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Auth check logic
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
}
```

### useEffect Dependencies

```tsx
// ✅ GOOD: All dependencies included
useEffect(() => {
  fetchData(userId, filter);
}, [userId, filter]);

// ✅ GOOD: No dependencies for one-time effect
useEffect(() => {
  initializeApp();
}, []);

// ❌ BAD: Missing dependencies
useEffect(() => {
  fetchData(userId, filter);
}, []); // Missing userId and filter
```

### Context API

```tsx
// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Login logic
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Component Documentation

**RULE #12: Document components with JSDoc**

```tsx
/**
 * LoginForm Component
 *
 * Handles user authentication with email and password.
 * Displays validation errors and redirects to dashboard on success.
 *
 * @example
 * ```tsx
 * <LoginForm onSuccess={() => router.push('/dashboard')} />
 * ```
 */
export default function LoginForm({ onSuccess }: LoginFormProps) {
  // Implementation
}
```

---

## Page Structure Example

**src/app/login/page.tsx** (Minimal composition):
```tsx
import LoginForm from '@/components/LoginForm/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - My App',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <main>
      <h1>Welcome Back</h1>
      <p>Please login to continue</p>
      <LoginForm />
    </main>
  );
}
```

**src/components/LoginForm/LoginForm.tsx** (All logic):
```tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.scss';

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = '/dashboard' }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push(redirectTo);
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        className={styles.input}
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        className={styles.input}
        required
      />
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## Anti-Patterns to Avoid

### ❌ Don't put logic in pages

```tsx
// ❌ BAD: All logic in page
export default function LoginPage() {
  const [formData, setFormData] = useState({...});
  const [error, setError] = useState('');
  // 200+ lines of form logic...
  return (
    <div>
      {/* 100+ lines of JSX */}
    </div>
  );
}
```

### ❌ Don't ignore TypeScript

```tsx
// ❌ BAD: Using 'any' everywhere
const handleClick = (data: any) => {
  // ...
};

// ✅ GOOD: Proper typing
const handleClick = (data: FormData) => {
  // ...
};
```

### ❌ Don't mix server and client logic

```tsx
// ❌ BAD: Mixing server and client
'use client';

export default async function Page() {
  // Can't use async in client components
  const data = await fetch('/api/data');
  return <div>{data}</div>;
}
```

---

**Last Updated:** 2025-12-29
**Extends:** `.claude/docs/core-rules.md`
**Framework:** React + Next.js
