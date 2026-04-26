# Unified Lavender Light UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify Admin, Seller, and Storefront apps into a consistent Lavender Light theme with a responsive hidden sidebar.

**Architecture:** Update global CSS variables to the new Lavender palette, then refactor Dashboard and Navbar components to support responsive mobile states (hamburger drawer) and match the new visual identity.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Lucide React icons.

---

### Task 1: Update Global Theme Variables

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update CSS variables for Lavender Light theme**
  Replace `:root` and `@theme` variables with the new palette.

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: #6C63FF;
  --color-primary-dark: #5A52D4;
  --color-primary-light: #8A82FF;
  --color-accent: #4A9FFF;
  --color-surface: #FFFFFF;
  --color-surface-dark: #F0F0FF;
  --color-muted: #6B7280;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-border: #E0E0FF;
  --font-sans: var(--font-inter);
}

:root {
  --background: #F9F9FF;
  --foreground: #111827;
  --card-bg: #FFFFFF;
  --card-border: #E0E0FF;
  --input-bg: #FFFFFF;
  --input-border: #E0E0FF;
  --sidebar-bg: #0D0D15;
  --sidebar-text: #9CA3AF;
  --sidebar-active: #6C63FF;
  --nav-bg: rgba(255, 255, 255, 0.8);
  --nav-border: rgba(224, 224, 255, 0.5);
  --hero-gradient-start: #6C63FF;
  --hero-gradient-end: #4A9FFF;
}
```

- [ ] **Step 2: Commit changes**
```bash
git add src/app/globals.css
git commit -m "style: update global theme variables to Lavender Light"
```

---

### Task 2: Implement Responsive Dashboard Sidebar

**Files:**
- Modify: `src/components/dashboard/DashboardSidebar.tsx`
- Modify: `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Add mobile state management to Sidebar**
  Update `DashboardSidebar` to accept `isOpen` and `onClose` props, and add mobile-specific styles (absolute positioning, backdrop).

- [ ] **Step 2: Update Dashboard Layout for Mobile Toggle**
  Wrap content in a client component or add a stateful toggle button for the mobile drawer.

- [ ] **Step 3: Commit changes**
```bash
git add src/components/dashboard/DashboardSidebar.tsx src/app/dashboard/layout.tsx
git commit -m "feat: implement responsive hidden sidebar for dashboard"
```

---

### Task 3: Refactor Navbar and Core Components

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/products/ProductCard.tsx`

- [ ] **Step 1: Update Navbar to Glassmorphism Lavender Light**
  Apply `backdrop-blur-md` and updated colors.

- [ ] **Step 2: Update ProductCard to elevated Lavender style**
  Ensure cards use white backgrounds and soft borders.

- [ ] **Step 3: Commit changes**
```bash
git add src/components/layout/Navbar.tsx src/components/products/ProductCard.tsx
git commit -m "style: update navbar and product cards for lavender theme"
```
