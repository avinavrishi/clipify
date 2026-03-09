# How to Change the Website Color

Use this guide to try different brand colors across the app. The app uses **one primary brand color** (buttons, links, active states, accents). Change it in the places below.

---

## 1. **Main theme (primary color)**  
**File:** `app/layout.tsx`

At the top of the file you’ll see:

```ts
const PRIMARY_MAIN = "#6EEB83";
const PRIMARY_LIGHT = "#8ef29e";
const PRIMARY_DARK = "#4ed968";
```

- **PRIMARY_MAIN** – Main brand color (buttons, links, active sidebar, focus rings).
- **PRIMARY_LIGHT** – Lighter variant (hover, gradients).
- **PRIMARY_DARK** – Darker variant (pressed states).

The theme then uses these in `palette.primary` and in component overrides (e.g. `MuiButton` hover). Change these three hex values to switch the whole app to a new primary (e.g. blue `#3b82f6`, orange `#ea580c`, purple `#a78bfa`).

---

## 2. **Input focus ring**  
**File:** `app/globals.css`

Find:

```css
.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #6EEB83 !important;
}
```

Set `border-color` to the same hex as your **PRIMARY_MAIN** (or any color you want for focused inputs).

---

## 3. **Auth modal left panel gradient**  
**File:** `components/AuthModal.tsx`

Search for `background: "linear-gradient(...)"` in the left column. It’s a green gradient; replace the hex values with your primary (e.g. `#2d5a3d`, `#3d7a4d`, `#6EEB83`) or another gradient you prefer.

---

## 4. **Sidebar active state**  
**File:** `components/Sidebar.tsx`

Search for `rgba(110, 235, 131, ...)`. Those are the green active background and hover. Replace `110, 235, 131` with the RGB of your primary (e.g. for `#6EEB83`, R=110 G=235 B=131).

---

## 5. **Verification dialog code pill**  
**File:** `components/VerificationDialog.tsx`

Search for `rgba(110, 235, 131, 0.12)` and `rgba(110, 235, 131, 0.25)` (code pill background and border). Change to your primary’s RGB if you want the pill to match the brand color.

---

## 6. **Public / landing page**  
**File:** `app/(public)/layout.tsx`  
**File:** `app/(public)/page.tsx`

- **layout.tsx:** Radial gradient uses `rgba(110, 235, 131, ...)`. Change to your primary’s RGB for a subtle tint.
- **page.tsx:** Feature card icon backgrounds use `rgba(110, 235, 131, 0.15)`. Same RGB as above.

---

## 7. **Explore campaign cards**  
**File:** `app/(dashboard)/dashboard/explore/page.tsx`

- Card hover border: `rgba(110, 235, 131, 0.35)`.
- Placeholder gradient and ACTIVE chip: green `rgba(110, 235, 131, ...)`.

Replace with your primary’s RGB to keep cards on-brand.

---

## 8. **Account page hover**  
**File:** `app/(dashboard)/dashboard/account/page.tsx`

Edit icon hover uses `rgba(110, 235, 131, 0.08)`. Change to your primary’s RGB.

---

## Summary table

| What you want to change      | File(s) |
|-----------------------------|--------|
| **Entire primary color**    | `app/layout.tsx` (PRIMARY_MAIN / LIGHT / DARK) |
| **Input focus border**      | `app/globals.css` |
| **Login modal left panel**  | `components/AuthModal.tsx` |
| **Sidebar active/hover**   | `components/Sidebar.tsx` |
| **Verification code pill**  | `components/VerificationDialog.tsx` |
| **Landing gradients & icons** | `app/(public)/layout.tsx`, `app/(public)/page.tsx` |
| **Explore cards**          | `app/(dashboard)/dashboard/explore/page.tsx` |
| **Account page icons**      | `app/(dashboard)/dashboard/account/page.tsx` |

**Tip:** For a site-wide change, update **1** and **2** first, then adjust **3–8** if you want those elements to match the new primary exactly (some already inherit from the theme).
