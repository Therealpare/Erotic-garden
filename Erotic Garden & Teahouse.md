# Erotic Garden & Teahouse
## Project Specification & Development Instructions

---

## 1. ROLE

You are a senior full-stack developer, UI/UX designer, software architect, and technical lead.

Your task is to build a production-quality website for **Chiang Mai Erotic Garden & Teahouse**, a real art garden and tea house in Mae Rim, Chiang Mai, Thailand.

This is also a professional **Full Stack Developer Portfolio Project**.

The final result must look like a real commercial website and must demonstrate strong:

- UI/UX
- Frontend development
- Backend development
- Database design
- REST API
- Authentication
- CMS
- Booking workflow
- Responsive design
- Accessibility
- SEO
- Performance

Do not build a generic tourism template or a simple landing page.

---

# 2. PROJECT VISION

Create a digital experience platform that presents the garden as:

> **A Garden Beyond Imagination**

Core brand concept:

> **Where Art, Nature and Human Expression Meet.**

The website should communicate:

- Art
- Nature
- Human expression
- Garden
- Tea house
- Storytelling
- Chiang Mai culture
- Personal experience

The website should NOT look like an adult website.

The word "Erotic" is part of the real brand identity, but the design should focus on:

**Botanical Garden + Contemporary Art + Boutique Teahouse + Cultural Experience**

Avoid:

- Explicit sexual imagery
- Adult website aesthetics
- Neon pink
- Excessive red
- Cheap visual styles
- Generic tourism templates
- Generic SaaS UI

---

# 3. DESIGN DIRECTION

Visual style:

- Editorial
- Artistic
- Organic
- Elegant
- Warm
- Mysterious
- Natural
- Sophisticated
- Cultural
- Premium

Visual references:

- Contemporary art museum
- Botanical garden
- Boutique hotel
- Independent art magazine
- Premium tea house
- Cultural destination

Prioritize:

- Large photography
- Editorial typography
- Generous whitespace
- Asymmetrical layouts
- Full-screen hero sections
- Image storytelling
- Organic shapes
- Subtle animations
- Elegant transitions

Do not overuse:

- Cards
- Borders
- Shadows
- Gradients
- Rounded UI
- Excessive icons

---

# 4. BRAND COLORS

Use the following design tokens.

```text
Deep Forest      #24352A
Moss             #66745B
Warm Ivory       #F4EFE5
Soft Cream       #E9E1D2
Terracotta       #A85C43
Muted Gold       #B49A62
Charcoal         #272622
Stone            #817C70
```

Recommended ratio:

```text
70% Ivory / Cream
20% Forest / Green
10% Terracotta / Gold
```

Accent colors must be used sparingly.

---

# 5. TYPOGRAPHY

Display font:

```text
Cormorant Garamond
```

Use for:

- Hero headings
- Editorial headings
- Large statements
- Quotes
- Section titles

Body/UI font:

```text
Inter
```

Use for:

- Navigation
- Body text
- Buttons
- Forms
- Metadata
- Admin dashboard

Typography should create a strong contrast between:

**Editorial / artistic headings**

and

**Clean / modern UI text**

---

# 6. RESPONSIVE DESIGN

Use mobile-first design.

Breakpoints:

```text
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: 1024px - 1440px
Large:   > 1440px
```

The mobile version must be intentionally designed rather than simply shrinking the desktop layout.

---

# 7. TECHNOLOGY STACK

## Frontend

Use:

- Angular
- TypeScript
- Tailwind CSS
- Angular Router
- Reactive Forms
- HttpClient
- Standalone Components
- Signals where appropriate

Use modern Angular architecture.

---

## Backend

Use:

- NestJS
- TypeScript
- REST API

---

## Database

Use:

- MySQL

---

## Authentication

Use:

- JWT
- Refresh Token
- Role-based authorization

Roles:

```text
ADMIN
EDITOR
```

---

## Image Storage

Do not store image binaries in MySQL.

Use:

- Cloudinary
or
- Amazon S3

Store image metadata and URLs in MySQL.

---

# 8. SITEMAP

Public website:

```text
/
├── /about
├── /experience
├── /art
├── /art/:slug
├── /gallery
├── /tea-house
├── /visit
├── /booking
└── /contact
```

Admin:

```text
/admin
├── /dashboard
├── /bookings
├── /artworks
├── /gallery
├── /experiences
├── /tea-menu
├── /reviews
├── /events
└── /settings
```

---

# 9. HOMEPAGE

Homepage route:

```text
/
```

Sections must appear in this order.

---

## 9.1 HERO

Content:

Eyebrow:

```text
CHIANG MAI · THAILAND
```

Headline:

```text
A Garden Beyond
Imagination
```

Supporting text:

```text
Art, nature and human expression
in the hills of Chiang Mai.
```

CTA:

```text
EXPLORE THE GARDEN
PLAN YOUR VISIT
```

Design:

- Full-screen image
- Strong typography
- Dark image overlay
- Subtle zoom animation
- Scroll indicator

---

# 10. INTRODUCTION

Headline:

```text
More than a garden.
More than an art space.
```

Explain:

- What the garden is
- The relationship between art and nature
- The visitor experience

Layout:

```text
40% Text
60% Image
```

CTA:

```text
OUR STORY →
```

---

# 11. EXPERIENCE

Headline:

```text
The Experience
```

Supporting text:

```text
Explore a different side of Chiang Mai.
```

Experiences:

1. Explore the Garden
2. Discover the Art
3. Tea House
4. Stories with Katai

Each experience must include:

- Image
- Title
- Description
- Link
- Hover interaction

---

# 12. GARDEN & ART

Headline:

```text
Art lives between
the trees.
```

Create a highly visual editorial section.

Use:

- One large image
- Multiple supporting images
- Asymmetrical layout
- Image reveal animations

CTA:

```text
EXPLORE ART →
```

---

# 13. ARTWORK SHOWCASE

Display featured artworks.

Filters:

```text
ALL
SCULPTURE
GARDEN
FEATURED
```

Artwork card:

- Image
- Title
- Description
- Location
- Link

Clicking an artwork opens:

```text
/art/:slug
```

---

# 14. ARTWORK DETAIL

Route:

```text
/art/:slug
```

Display:

- Large artwork image
- Title
- Description
- Story
- Material
- Year
- Location
- Related artworks
- Previous artwork
- Next artwork

Do not invent artwork information.

Use CMS-managed content.

---

# 15. TEA HOUSE

Headline:

```text
Slow down.
Have some tea.
```

Explain the Tea House experience.

Display:

- Tea
- Coffee
- Homemade treats
- Atmosphere

CTA:

```text
VIEW TEA HOUSE →
```

---

# 16. MEET KATAI

Headline:

```text
The person behind
the garden.
```

Introduce Katai and the story behind the garden.

Display:

- Portrait
- Short biography
- Quote
- Story link

Important:

Do not invent personal or biographical information.

Use CMS-managed content or clearly marked placeholder content.

---

# 17. GALLERY

Route:

```text
/gallery
```

Use masonry layout.

Categories:

```text
ALL
GARDEN
ART
TEA HOUSE
PEOPLE
```

Features:

- Responsive masonry grid
- Lazy loading
- Lightbox
- Previous / Next
- Keyboard navigation
- Close button
- Captions
- Accessible alt text

---

# 18. REVIEWS

Headline:

```text
Visitors Say
```

Display:

```text
4.7 / 5
98 Reviews
```

Important:

These values must be configurable.

Do not hard-code external review information permanently.

Display featured reviews from:

```text
Tripadvisor
Google
Direct
```

Never fabricate reviews.

---

# 19. PLAN YOUR VISIT

Display:

```text
Opening Hours
Admission
Location
How to Get Here
```

CTA:

```text
GET DIRECTIONS
BOOK A VISIT
```

Important:

Do not invent:

- Opening hours
- Prices
- Phone numbers
- Email
- Transportation details

These must be configurable through CMS.

---

# 20. LOCATION

Display:

- Address
- Map
- Google Maps link
- Transportation information

Categories:

```text
By Car
By Taxi
By Scooter
```

Do not claim exact coordinates until verified.

---

# 21. FINAL CTA

Headline:

```text
Ready to discover
something different?
```

Supporting text:

```text
Come curious.
Leave inspired.
```

CTA:

```text
PLAN YOUR VISIT
```

---

# 22. FOOTER

Include:

- Logo
- Address
- Navigation
- Social links
- Contact
- Visit information
- Copyright

Navigation:

```text
ABOUT
EXPERIENCE
ART
GALLERY
TEA HOUSE
VISIT
```

---

# 23. ABOUT PAGE

Route:

```text
/about
```

Sections:

1. Hero
2. Our Story
3. Philosophy
4. Meet Katai
5. The Garden Today
6. CTA

Use editorial storytelling.

Do not invent facts.

---

# 24. EXPERIENCE PAGE

Route:

```text
/experience
```

Experiences:

```text
Garden Tour
Art Exploration
Tea House
Private / Group Visit
```

Experience fields:

```text
id
title
slug
short_description
description
duration
price
image_url
featured
status
created_at
updated_at
```

---

# 25. TEA HOUSE PAGE

Route:

```text
/tea-house
```

Sections:

1. Hero
2. Tea House Story
3. Atmosphere
4. Menu
5. CTA

Menu categories:

```text
Tea
Coffee
Dessert
Special
```

Menu must be CMS-managed.

---

# 26. VISIT PAGE

Route:

```text
/visit
```

Sections:

- Opening Hours
- Admission
- Address
- Map
- Transportation
- FAQ
- Booking CTA

---

# 27. BOOKING

Route:

```text
/booking
```

Create a Visit Request form.

Fields:

```text
Name
Email
Phone
Visit Date
Preferred Time
Number of Guests
Experience
Message
```

Validation:

- Required fields
- Email validation
- Date validation
- Guest count validation

API:

```http
POST /api/v1/bookings
```

After successful submission:

- Generate booking code
- Show confirmation
- Show success state

Also implement:

- Loading state
- Error state
- Validation state

---

# 28. CONTACT

Route:

```text
/contact
```

Fields:

```text
Name
Email
Subject
Message
```

API:

```http
POST /api/v1/contact
```

---

# 29. MULTI-LANGUAGE

Support:

```text
English
Thai
Chinese
```

Design the architecture so additional languages can be added later.

Prefer scalable translation architecture.

Do not duplicate components for every language.

---

# 30. INTERACTIVE GARDEN MAP

Implement an optional interactive garden map.

Map areas may include:

- Entrance
- Garden
- Artwork locations
- Tea House

Clicking an artwork marker displays:

- Artwork name
- Image
- Description
- Link

Use mock configuration initially if exact real-world locations are unavailable.

Do not present mock coordinates as verified real coordinates.

---

# 31. ADMIN CMS

Route:

```text
/admin
```

Admin navigation:

```text
Dashboard
Bookings
Artworks
Gallery
Experiences
Tea Menu
Reviews
Events
Settings
```

Admin users must be authenticated.

---

# 32. ADMIN DASHBOARD

Display:

```text
Total Bookings
Pending Bookings
Confirmed Bookings
Artwork Count
Gallery Image Count
Upcoming Events
```

Keep admin UI functional and clean.

Do not overdecorate the admin dashboard.

---

# 33. BOOKING MANAGEMENT

Admin features:

- View bookings
- Search bookings
- Filter by date
- Filter by status
- View booking details
- Change booking status

Statuses:

```text
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

---

# 34. DATABASE

Use MySQL.

Tables:

```text
users
artworks
artwork_images
gallery_categories
gallery_images
experiences
tea_categories
tea_menu_items
reviews
bookings
events
contact_messages
site_settings
```

---

# 35. DATABASE SCHEMA

## users

```text
id PK
name
email
password_hash
role
created_at
updated_at
```

---

## artworks

```text
id PK
title
slug
description
story
material
year
location
featured
status
created_at
updated_at
```

---

## artwork_images

```text
id PK
artwork_id FK
image_url
public_id
alt_text
sort_order
```

Relationship:

```text
artworks 1:N artwork_images
```

---

## gallery_categories

```text
id PK
name
slug
```

---

## gallery_images

```text
id PK
category_id FK
title
image_url
public_id
description
alt_text
featured
sort_order
created_at
```

---

## experiences

```text
id PK
title
slug
short_description
description
duration
price
image_url
featured
status
created_at
updated_at
```

---

## tea_categories

```text
id PK
name
```

---

## tea_menu_items

```text
id PK
category_id FK
name
description
price
image_url
available
sort_order
```

---

## reviews

```text
id PK
author_name
source
rating
review_text
review_date
featured
status
```

---

## bookings

```text
id PK
booking_code
name
email
phone
visit_date
preferred_time
guest_count
experience_id FK
message
status
created_at
updated_at
```

---

## events

```text
id PK
title
slug
description
start_at
end_at
location
image_url
capacity
status
created_at
updated_at
```

---

## contact_messages

```text
id PK
name
email
subject
message
status
created_at
```

---

## site_settings

```text
id PK
setting_key
setting_value
```

Example settings:

```text
opening_hours
address
phone
email
instagram
facebook
tripadvisor_url
google_maps_url
```

---

# 36. API

Base:

```text
/api/v1
```

## Artworks

```http
GET /api/v1/artworks
GET /api/v1/artworks/featured
GET /api/v1/artworks/:slug
```

---

## Gallery

```http
GET /api/v1/gallery
GET /api/v1/gallery/categories
```

Optional:

```http
GET /api/v1/gallery?category=garden
```

---

## Experiences

```http
GET /api/v1/experiences
GET /api/v1/experiences/:slug
```

---

## Tea House

```http
GET /api/v1/tea/categories
GET /api/v1/tea/menu
```

---

## Reviews

```http
GET /api/v1/reviews
GET /api/v1/reviews/featured
```

---

## Events

```http
GET /api/v1/events
GET /api/v1/events/:slug
```

---

## Site Settings

```http
GET /api/v1/site-settings
```

---

## Booking

```http
POST /api/v1/bookings
```

---

## Contact

```http
POST /api/v1/contact
```

---

# 37. AUTH API

```http
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET /api/v1/auth/me
```

Use:

- JWT
- Refresh token
- Auth guards
- Role guards

---

# 38. ADMIN API

Bookings:

```http
GET /api/v1/admin/bookings
GET /api/v1/admin/bookings/:id
PATCH /api/v1/admin/bookings/:id/status
```

CRUD:

```http
/api/v1/admin/artworks
/api/v1/admin/gallery
/api/v1/admin/experiences
/api/v1/admin/tea
/api/v1/admin/reviews
/api/v1/admin/events
/api/v1/admin/settings
```

All admin endpoints require authentication.

---

# 39. ANGULAR ARCHITECTURE

Use feature-based architecture.

```text
src/
└── app/
    ├── core/
    │   ├── auth/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── services/
    │   └── models/
    │
    ├── shared/
    │   ├── components/
    │   ├── directives/
    │   ├── pipes/
    │   └── utils/
    │
    ├── features/
    │   ├── home/
    │   ├── about/
    │   ├── experience/
    │   ├── artworks/
    │   ├── gallery/
    │   ├── tea-house/
    │   ├── visit/
    │   ├── booking/
    │   └── contact/
    │
    ├── admin/
    │   ├── dashboard/
    │   ├── bookings/
    │   ├── artworks/
    │   ├── gallery/
    │   ├── experiences/
    │   ├── tea-menu/
    │   ├── reviews/
    │   ├── events/
    │   └── settings/
    │
    ├── app.routes.ts
    └── app.config.ts
```

---

# 40. SHARED COMPONENTS

Create reusable components:

```text
Navbar
Footer
Button
SectionHeader
ArtworkCard
ExperienceCard
GalleryGrid
GalleryLightbox
ReviewCard
ImageReveal
LoadingSpinner
EmptyState
ErrorState
BookingForm
FAQ
LanguageSwitcher
Map
```

Avoid duplicated components.

---

# 41. ANGULAR SERVICES

Create:

```text
artwork.service.ts
gallery.service.ts
experience.service.ts
tea-house.service.ts
review.service.ts
booking.service.ts
event.service.ts
site-settings.service.ts
auth.service.ts
```

Services should communicate with the REST API.

---

# 42. NESTJS ARCHITECTURE

Use:

```text
src/
├── auth/
├── users/
├── artworks/
├── gallery/
├── experiences/
├── tea-house/
├── reviews/
├── bookings/
├── events/
├── contact/
├── site-settings/
│
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   └── interceptors/
│
└── database/
```

Each module should contain:

```text
controller
service
module
dto
entity
```

---

# 43. ANIMATION

Use subtle animations:

- Hero image zoom
- Fade-up text
- Image reveal
- Scroll reveal
- Gallery hover
- Artwork hover
- Page transitions
- Smooth scrolling

Animation style:

```text
Slow
Organic
Elegant
Minimal
```

Respect:

```text
prefers-reduced-motion
```

---

# 44. ACCESSIBILITY

Follow WCAG principles.

Implement:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Accessible forms
- Accessible lightbox
- Alt text
- Color contrast
- Reduced motion

---

# 45. SEO

Implement:

- Page title
- Meta description
- Open Graph
- Canonical URL
- Sitemap
- robots.txt
- Structured data

Potential structured data:

```text
TouristAttraction
LocalBusiness
FAQPage
```

Only use verified business information.

---

# 46. PERFORMANCE

Implement:

- Lazy loading images
- Responsive images
- WebP/AVIF where appropriate
- Lazy-loaded Angular routes
- Optimized assets
- Minimal dependencies
- Loading states
- Skeleton states
- Image placeholders

Avoid unnecessary JavaScript.

---

# 47. SECURITY

Implement:

- Password hashing
- JWT
- Refresh tokens
- Role-based authorization
- DTO validation
- Rate limiting where appropriate
- CORS
- Secure HTTP headers
- Input validation/sanitization
- Environment variables

Never hard-code:

```text
JWT secrets
Database passwords
API keys
Cloudinary credentials
AWS credentials
```

---

# 48. CONTENT RULES

This is a real business website.

Never fabricate:

- Prices
- Opening hours
- Phone numbers
- Email addresses
- Owner biography
- Artwork history
- Reviews
- Exact coordinates
- Transportation information

When real information is unavailable:

Use:

```text
TODO: OWNER VERIFIED CONTENT REQUIRED
```

or clearly marked demo data.

---

# 49. DEVELOPMENT PHASES

Do not build the entire project in one step.

## Phase 1 — Design System

Build:

- Colors
- Typography
- Spacing
- Buttons
- Navbar
- Footer
- Containers
- Basic components

---

## Phase 2 — Public Frontend

Build:

- Homepage
- About
- Experience
- Art
- Gallery
- Tea House
- Visit
- Contact

---

## Phase 3 — Booking

Build:

- Booking form
- Validation
- Success state
- Error state

---

## Phase 4 — Backend

Build:

- NestJS
- REST API
- DTOs
- Validation
- Error handling

---

## Phase 5 — Database

Build:

- MySQL schema
- Relationships
- Migrations
- Seed data

---

## Phase 6 — API Integration

Connect Angular to NestJS.

Remove unnecessary mock data.

---

## Phase 7 — Authentication

Implement:

- Login
- Refresh token
- Logout
- Route guards
- Role guards

---

## Phase 8 — Admin CMS

Implement:

- Dashboard
- Bookings
- Artworks
- Gallery
- Experiences
- Tea Menu
- Reviews
- Events
- Settings

---

## Phase 9 — Advanced Features

Implement:

- Multi-language
- Interactive garden map
- Image management
- SEO
- Structured data

---

## Phase 10 — Production

Perform:

- Responsive testing
- Accessibility testing
- Performance optimization
- Security review
- Error handling
- API testing
- Build optimization
- Deployment

---

# 50. IMPLEMENTATION RULES

Before implementing a feature:

1. Understand the existing architecture.
2. Inspect existing files.
3. Reuse existing components.
4. Do not duplicate functionality.
5. Do not unnecessarily rewrite working code.
6. Keep components small.
7. Keep business logic out of UI components.
8. Use services for API communication.
9. Use typed interfaces/models.
10. Follow existing naming conventions.

---

# 51. CODE QUALITY

Follow:

- Clean Code
- SOLID where appropriate
- DRY
- Separation of concerns
- Strong TypeScript typing
- Reusable components
- Meaningful naming
- Small focused functions
- Consistent error handling

Avoid overengineering.

---

# 52. PORTFOLIO OBJECTIVE

The project should clearly demonstrate:

## UX/UI

- Brand identity
- User journey
- Responsive design
- Editorial design
- Accessibility
- Micro-interactions

## Frontend

- Angular
- TypeScript
- Tailwind
- Routing
- Reactive Forms
- API integration
- Reusable components

## Backend

- NestJS
- REST API
- Authentication
- Authorization
- Validation
- Error handling

## Database

- MySQL
- Relationships
- Foreign keys
- CRUD
- Data modeling

## Business

- Visitor conversion
- Booking workflow
- CMS
- Multi-language
- SEO
- Social proof

---

# 53. TARGET USER JOURNEY

The primary journey is:

```text
DISCOVER
    ↓
UNDERSTAND
    ↓
EXPLORE
    ↓
TRUST
    ↓
PLAN
    ↓
VISIT
```

The main conversion goal is:

```text
PLAN YOUR VISIT
```

Do not make the website feel overly commercial.

---

# 54. FINAL QUALITY STANDARD

The final website should feel like:

> A contemporary art destination in Chiang Mai with a strong digital identity.

It should NOT feel like:

- Bootstrap template
- Generic tourism website
- SaaS dashboard
- Adult website
- Student CRUD project
- AI-generated template

Prioritize:

```text
Photography
Typography
Whitespace
Storytelling
Navigation
UX
Performance
Accessibility
```

while maintaining professional engineering architecture.

---

# 55. IMPORTANT DEVELOPMENT BEHAVIOR

Do not generate the entire application blindly.

Work incrementally.

For every phase:

1. Inspect the current project.
2. Explain what will be changed.
3. Create/update files.
4. Run validation/build/tests where available.
5. Fix errors.
6. Summarize completed work.
7. Wait for the next phase unless explicitly instructed to continue.

Never fabricate real-world business information.

If information is missing, create a configurable field or placeholder.

The goal is a **realistic, maintainable, portfolio-quality full-stack application**, not merely a visually impressive prototype.