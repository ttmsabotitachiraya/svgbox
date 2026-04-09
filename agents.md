# 🍪 agents.md — SVGBox Web App (Cookies & Cream Light Theme)

## 🎯 Project Overview

**SVG Box** is a web application for storing, managing, and showcasing SVG assets.

The platform is:

* 🌍 Publicly viewable (anyone can browse SVGs)
* 🔐 Restricted editing (only owners can modify their SVGs)

---

# 🧱 Tech Stack

## Frontend

* Vue 3 (Composition API)
* TypeScript
* Vite
* Tailwind CSS
* Lucide Icons

## Backend

* Supabase

  * Auth
  * PostgreSQL Database
  * Storage (optional)

---

# 🎨 UI/UX Theme — Cookies & Cream (Light Mode)

## 🎨 Color Palette (FINAL)

| Element        | Hex Code | Inspiration     |
| -------------- | -------- | --------------- |
| Background     | #F8F9FA  | Vanilla Base    |
| Surface / Card | #FFFFFF  | Fresh Milk      |
| Primary        | #2D3436  | Dark Oreo       |
| Secondary      | #636E72  | Cookie Crumbs   |
| Accent         | #00CEC9  | Mint Garnish    |
| Soft Tint      | #DFE6E9  | Mixed Cream     |
| Text Primary   | #1E272E  | Midnight Cookie |
| Text Secondary | #718093  | Powdered Sugar  |
| Border         | #DCDDE1  | Chilled Grey    |

## ✨ Design Style

* Clean modern UI 🍪
* Minimal, soft contrast (easy on eyes)
* Rounded corners (rounded-2xl)
* Light shadows (shadow-sm)
* Subtle hover transitions
* Soft dessert-like UI 🍰
* Bright, clean, airy layout
* Rounded corners (rounded-2xl)
* Soft shadows (shadow-sm / shadow-md)
* Smooth hover + transition

---

# 🎯 Tailwind Theme Extension (IMPORTANT)

````ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: '#F8F9FA',
        surface: '#FFFFFF',
        primary: '#2D3436',
        secondary: '#636E72',
        accent: '#00CEC9',
        soft: '#DFE6E9',
        textprimary: '#1E272E',
        textsecondary: '#718093',
        border: '#DCDDE1'
      }
    }
  }
}
```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: '#F8F7FF',
        surface: '#FFFFFF',
        primary: '#7067CF',
        secondary: '#B794F4',
        accent: '#F6AD55',
        softblue: '#EBF4FF',
        textprimary: '#2D3748',
        textsecondary: '#718096',
        border: '#E2E8F0'
      }
    }
  }
}
````

---

# 🧭 App Structure

## Pages

### 1. Home (Public)

* SVG Grid
* Search bar
* Filter (tags, category)

### 2. Login / Register

* Email + Password
* Supabase Auth

### 3. Dashboard (Authenticated)

* User SVGs
* Upload button

### 4. SVG Detail Page

* Preview
* Tags
* Download
* Copy SVG
* Edit/Delete (owner only)

---

# 🧩 Components

## Core Components

### SVGCard.vue

* SVG Preview
* Name
* Tags
* Hover Actions:

  * ❤️ Favorite
  * ⬇ Download
  * 📋 Copy SVG

### UploadModal.vue

* Drag & Drop
* Paste SVG code
* Input:

  * Name
  * Tags
  * Category

### Navbar.vue

* Logo (SVG Box)
* Search
* Login/Profile

---

# 🖼 App Icon (SVGBox Logo — FINAL)

Use EXACT SVG below (DO NOT MODIFY COLORS):

```html
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topFace" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E9ECEF" />
    </linearGradient>
    
    <linearGradient id="leftFace" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4F4F4F" />
      <stop offset="100%" stop-color="#3D3D3D" />
    </linearGradient>
    
    <linearGradient id="rightFace" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7E8891" />
      <stop offset="100%" stop-color="#6C757D" />
    </linearGradient>
  </defs>

  <path d="M100 30 L160 60 L100 90 L40 60 Z" fill="url(#topFace)" stroke="#DEE2E6" stroke-width="0.5" />
  <path d="M40 60 L100 90 L100 160 L40 130 Z" fill="url(#leftFace)" />
  <path d="M100 90 L160 60 L160 130 L100 160 Z" fill="url(#rightFace)" />

  <g transform="translate(100, 60) scale(1, 0.5) rotate(45)">
    <text x="0" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="60" fill="#212529">S</text>
  </g>

  <g transform="translate(70, 115) skewY(26.5)">
    <text x="0" y="0" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="45" fill="#FFFFFF" fill-opacity="0.95">V</text>
  </g>

  <g transform="translate(130, 115) skewY(-26.5)">
    <text x="0" y="0" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="45" fill="#FFFFFF" fill-opacity="0.95">G</text>
  </g>
</svg>
```

## 🔧 Usage Guidelines

* Navbar logo: 32–40px
* Favicon: export SVG → PNG
* Keep gradients intact

---

# 🗄 Database Schema (Supabase)

## Table: svg_assets

```sql
create table svg_assets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  svg_code text not null,
  tags text[],
  category text,
  is_favorite boolean default false,
  created_at timestamp with time zone default now()
);
```

---

# 🔐 Security (CRITICAL)

## Enable Row Level Security

```sql
alter table svg_assets enable row level security;
```

## Policies

### Public Read

```sql
create policy "Public read"
on svg_assets
for select
using (true);
```

### Insert (Authenticated)

```sql
create policy "Insert own svg"
on svg_assets
for insert
with check (auth.uid() = user_id);
```

### Update (Owner Only)

```sql
create policy "Update own svg"
on svg_assets
for update
using (auth.uid() = user_id);
```

### Delete (Owner Only)

```sql
create policy "Delete own svg"
on svg_assets
for delete
using (auth.uid() = user_id);
```

---

# 🔄 Data Flow

## Upload SVG

1. User logs in
2. Open Upload Modal
3. Submit SVG
4. Save with user_id

## Display SVG

1. Fetch all SVG (public)
2. Render in grid

## Edit SVG

1. Check ownership
2. Allow update

---

# ⚙️ Frontend Architecture

## Folder Structure

```
src/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── composables/
 ├── services/
 ├── types/
 └── utils/
```

---

# 🔌 Supabase Client

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

# 🔍 Features

## Core

* Upload SVG
* View SVG
* Search
* Filter
* Favorite

## Advanced (Optional)

* SVG color extraction
* Export PNG
* Collections

---

# 🧠 UX Rules

* Non-owner MUST NOT see edit/delete
* Owner sees full controls
* Hover reveals actions
* Fast interaction (no reload)

---

# 🚀 Future Enhancements

* Likes system
* Comments
* Public profiles
* SVG marketplace

---

# ✅ Definition of Done

* User can login
* Upload SVG
* Public can view
* Owner can edit/delete
* UI matches Cookies & Cream Light Theme

---

# 🎯 Notes for AI Developer

* Keep UI soft and premium
* Follow exact color tokens
* Do not override logo colors
* Strict TypeScript
* Reusable components
* Optimize SVG rendering

---

# END
