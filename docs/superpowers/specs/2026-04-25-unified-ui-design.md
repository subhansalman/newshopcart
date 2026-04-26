# Unified Lavender Light UI Design Spec

**Date:** 2026-04-25
**Topic:** UI Consistency & Responsiveness

## Goal
Unify the "Admin Portal", "Digital Atelier", and "ShopCart" storefront into a consistent "Lavender Light" aesthetic with a responsive navigation system.

## Visual Identity
- **Background:** Soft Lavender White (`#F9F9FF`)
- **Surfaces:** Pure White (`#FFFFFF`) with `#E0E0FF` borders
- **Primary Accent:** Purple-to-Blue Gradient (`#6C63FF` to `#4A9FFF`)
- **Dashboard Sidebar:** Midnight Midnight (`#0D0D15`) for high contrast on desktop
- **Typography:** Inter with increased weights for hierarchy and lowercase/tracking adjustments for headers.

## Responsive Strategy
- **Desktop (>= 1024px):** Fixed sidebar (240px) for Dashboard/Admin.
- **Mobile (< 1024px):** 
  - Sidebar is hidden by default.
  - Triggered by a "hamburger" menu in the top-left.
  - Drawer slides in from left with glassmorphism backdrop.

## Component Specifications
- **Cards:** Elevated white surfaces, 12px border radius, subtle shadows.
- **Inputs:** Minimalist white backgrounds, `#E0E0FF` borders, purple focus rings.
- **Navbar (Storefront):** Transparent glassmorphism, pins to top on scroll.
