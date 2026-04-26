# UI Layout Fix Design

**Date:** 2026-04-26
**Status:** Implemented

## Problem

Three layout issues compared to design references in `design/`:

1. Dashboard chart bars completely invisible
2. Products page sort tabs and grid overflowing right edge
3. Home page product grid showing 4 columns (xl:grid-cols-4) overflowing at 1280px viewport

## Root Causes

| Issue | Cause |
|---|---|
| Chart bars invisible | `height: X%` on bar elements had no definite parent height. Parent used `flex items-end` (not stretch), making column wrappers content-height only. `h-full` on bar wrapper created circular dependency → resolved to 0. |
| Products overflow | `w-64` sidebar (256px) + `gap-8` (32px) + 3-col grid exceeded viewport at 1280px |
| Home grid overflow | `xl:grid-cols-4` at xl (1280px) breakpoint — 4 columns in ~1216px content area |

## Solution

**A. Chart bars** — replace `height: X%` with pixel calculation:
```
bar_height = Math.round((percentage / 100) * MAX_HEIGHT_PX)
```
- Sales Analytics: MAX = 176px (h-56=224px - 48px for label+gap)
- Curation Analytics: MAX = 152px (h-48=192px - 40px for label+gap)

**B. Products sidebar** — `w-64 → w-56`, `gap-8 → gap-6`

**C. Home grids** — `lg:grid-cols-3 xl:grid-cols-4 → lg:grid-cols-3`

## Files Changed

- `src/app/dashboard/page.tsx` — both chart bar arrays
- `src/app/products/page.tsx` — aside width + flex gap
- `src/app/page.tsx` — featured products + recommended products grids
