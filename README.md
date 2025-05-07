# Lot Catalog App

A responsive car auction lot catalog built with **Next.js**, **Tailwind CSS**, and **React Window**, with dynamic filtering, optimized data requests for current bid value, and optimized rendering.

## Features

- ⚙️ Filters by:
  - Auction Type (Copart, IAAI)
  - Year Range (from / to)
  - Brand & Model (with search)
- 🧠 Intelligent Store:
  - Global filter state with Zustand (`useFilterStore`)
- 📦 Data:
  - `getMakesAndModels()` from `/domains/lots/api`
  - `useLots()` hook handles lot fetching, pagination, and `total`(total results)
- 🔁 Infinite Scroll:
  - Uses `@tanstack/react-virtual` for virtualized rendering
  - Load More button rendered at end of list
- 🖼️ Optimized Images:
  - Uses `next/image` with Chrome/Safari-specific behavior
- 🎨 Fully Styled:
  - Custom scrollbars
  - Accessibility-friendly selects, checkboxes
  - Custom Tailwind utility classes

## Tech Stack

- **React** / **Next.js** (App Router, Server Components)
- **Tailwind CSS** (Utility-first styling)
- **Zustand** (Global state for filters)
- **React Window** (Virtualized list rendering)
- **Date-fns** (Time distance formatting)
- **react-intersection-observer** (Performance and user experience)

## Project Structure

```
app/
  page.tsx                # Main layout
components/
  CarFilters.tsx          # Sidebar filters UI
  LotCard.tsx             # Lot listing card
  LotList.tsx             # Virtualized scroll list
  LotImage.tsx            # Conditional fill/image fallback
lib/
  utils.ts                # cn(), capitalizeWords()
domains/lots/
  api.ts                  # getMakesAndModels()
  hooks.ts                # useLots(), useCurrentBidWhenVisible()
  store.ts                # useFilterStore() Zustand logic
  types.ts                # Lot props
public/
  *.svg                   # Icons (Vector, Clock, Calendar, Copart, IAAI)
```

## How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Dev Server**
   ```bash
   npm run dev
   ```

3. **Environment**
   Make sure `/public` contains all required SVGs:
   - `Vector.svg`, `Vector-down.svg`
   - `Calendar-Month-Icon.svg`, `Clock.svg`
   - `copart.svg`, `IAA.svg`

## Developer Notes

- Scrollbar styles adjusted via `::-webkit-scrollbar` and Firefox fallback using `@supports not selector(...)`
- Safari compatibility ensured for:
  - `<Image fill>` fallback to `width/height`
  - Brand list fixed height and scroll
- Grid layout is responsive and conditionally `grid-cols-4` above 1920px
- Search result title is above both filters and list content

## Accessibility

- Inputs have associated `aria-label`s
- Dropdowns are styled but preserve keyboard accessibility
- Buttons reflect expanded state with `aria-expanded`

---

