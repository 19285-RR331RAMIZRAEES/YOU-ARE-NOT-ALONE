# ðŸ«‚ You Are Not Alone - Mental Health Support Platform

A mental health support and suicide prevention platform designed to help people who are struggling with depression, suicidal thoughts, or emotional distress feel seen, heard, and less alone.

The platform allows users to share their personal storiesâ€”either anonymously or with their real identityâ€”about what they went through, how they survived, and what helped them cope. By reading real experiences from others who have faced similar pain, users may find hope, strength, and the courage to keep going.

---

## ðŸ’¡ Core Goals

- Save lives through connection and shared human experiences
- Reduce stigma around mental health and suicidal thoughts
- Create a safe, calming, and supportive digital space
- Empower survivors to heal by sharing their journeys
- Offer hope to those who feel alone in their struggles

---

## âœ¨ Key Features

### ðŸ”’ Privacy Control
- Share stories anonymously or with a real name
- Full control over visibility and identity

### ðŸ“ Story Sharing
- Survivors and individuals can share experiences as a form of healing
- Focus on recovery, coping, and survivalâ€”not harm

### ðŸ’¬ Supportive Community Interaction
- Encouraging replies and compassionate comments
- Non-judgmental, moderated discussions

### ðŸŽ¨ Soothing UI & Gentle UX
- Calm colors, minimal design, and emotionally safe interactions
- Designed to reduce anxiety and emotional overload
- Warm Dawn color palette with sage green accents
- Elegant Playfair Display typography for headings

### ðŸ›¡ï¸ Safety-First Design
- Content moderation to prevent triggering or harmful material
- Crisis resources and helpline information clearly accessible

---

## ðŸ—ï¸ Architecture

This is a **full-stack Next.js 15** application with:

- **Frontend**: React 19 with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with PostgreSQL
- **Database**: PostgreSQL with connection pooling

### Project Structure

```
â”œâ”€â”€ app/                    # Next.js App Router
â”‚   â”œâ”€â”€ api/               # API Routes
â”‚   â”‚   â”œâ”€â”€ admin/         # Admin authentication
â”‚   â”‚   â”œâ”€â”€ comments/      # Comment management
â”‚   â”‚   â”œâ”€â”€ health/        # Health check endpoint
â”‚   â”‚   â””â”€â”€ stories/       # Story CRUD operations
â”‚   â”œâ”€â”€ admin/             # Admin panel page
â”‚   â”œâ”€â”€ share/             # Story submission page
â”‚   â”œâ”€â”€ stories/           # Stories listing page
â”‚   â””â”€â”€ layout.tsx         # Root layout
â”œâ”€â”€ lib/                   # Shared library code
â”‚   â”œâ”€â”€ services/          # Business logic layer
â”‚   â”‚   â”œâ”€â”€ stories.ts     # Story service
â”‚   â”‚   â”œâ”€â”€ comments.ts    # Comment service
â”‚   â”‚   â””â”€â”€ reactions.ts   # Reaction service
â”‚   â”œâ”€â”€ config.ts          # Environment configuration
â”‚   â”œâ”€â”€ constants.ts       # Application constants
â”‚   â”œâ”€â”€ database.ts        # Database connection pool
â”‚   â””â”€â”€ types.ts           # TypeScript type definitions
â”œâ”€â”€ public/                # Static assets
â””â”€â”€ .env.example           # Environment template
```

---

## ðŸš€ Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **PostgreSQL** database (local, Docker, or cloud service like Vercel Postgres)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your settings:
   ```env
   POSTGRES_URL=postgresql://username:password@host:5432/database
   ADMIN_PASSWORD=your_secure_admin_password
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The application will be available at http://localhost:3000

### Running in Production

```bash
npm run build
npm start
```

---

## ðŸ” Admin Panel

The platform includes an admin panel for content moderation.

### Admin Setup

1. **Set admin password in `.env.local`:**
   ```env
   ADMIN_PASSWORD=your_secure_password_here
   ```

2. **Access the admin panel:**
   - Navigate to `/admin` (or click the lock icon ðŸ”’ in the navigation)
   - Enter your admin password
   - Manage and remove inappropriate stories

3. **For production deployment:**
   - Add `ADMIN_PASSWORD` to your hosting platform's environment variables
   - Keep the password secure and confidential

**Features:**
- Password-protected access
- View all stories
- Delete inappropriate or harmful content
- Subtle navigation link for discretion

---

## ðŸš€ Production Deployment

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `ADMIN_PASSWORD` - Admin panel password
4. Deploy!

---

## ðŸ“ Project Structure

```
â”œâ”€â”€ app/                      # Next.js 15 app directory
â”‚   â”œâ”€â”€ admin/               # Admin panel for content moderation
â”‚   â”œâ”€â”€ api/                 # API routes (Next.js API)
â”‚   â”‚   â”œâ”€â”€ admin/          # Admin verification endpoint
â”‚   â”‚   â”œâ”€â”€ comments/       # Comments CRUD endpoints
â”‚   â”‚   â”œâ”€â”€ health/         # Health check endpoint
â”‚   â”‚   â””â”€â”€ stories/        # Stories CRUD + reactions endpoints
â”‚   â”œâ”€â”€ assets/              # Logo and images
â”‚   â”œâ”€â”€ share/               # Share story page
â”‚   â”œâ”€â”€ stories/             # Stories feed page
â”‚   â”œâ”€â”€ globals.css          # Global styles with Warm Dawn palette
â”‚   â”œâ”€â”€ layout.tsx           # Root layout with navigation
â”‚   â”œâ”€â”€ metadata.ts          # SEO metadata
â”‚   â””â”€â”€ page.tsx             # Homepage
â”œâ”€â”€ lib/                      # Shared library code
â”‚   â”œâ”€â”€ config.ts            # Environment configuration
â”‚   â”œâ”€â”€ constants.ts         # Application constants
â”‚   â”œâ”€â”€ database.ts          # Database connection pool
â”‚   â”œâ”€â”€ types.ts             # TypeScript interfaces
â”‚   â””â”€â”€ services/            # Business logic layer
â”‚       â”œâ”€â”€ stories.ts       # Story operations
â”‚       â”œâ”€â”€ comments.ts      # Comment operations
â”‚       â””â”€â”€ reactions.ts     # Reaction operations
â”œâ”€â”€ public/                  # Static assets
â”œâ”€â”€ .env.example             # Environment variables template
â”œâ”€â”€ .gitignore              # Git ignore rules
â”œâ”€â”€ README.md               # This file
â”œâ”€â”€ package.json            # Node.js dependencies
â”œâ”€â”€ tailwind.config.ts      # Tailwind CSS configuration
â””â”€â”€ tsconfig.json           # TypeScript configuration
```

---

## ðŸ› ï¸ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe JavaScript with strict mode
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend (Integrated)
- **Next.js API Routes** - Full-stack API within Next.js
- **PostgreSQL** - Production database
- **pg** - PostgreSQL driver for Node.js

### Architecture
- **Service Layer Pattern** - Clean separation of concerns
- **SOLID Principles** - Maintainable, scalable code
- **Centralized Configuration** - Single source of truth for env vars

### Design
- **Warm Dawn Color Palette** - Calming cream to beige gradient
- **Playfair Display** - Elegant serif font for headings
- **Inter** - Clean sans-serif for body text
- **Sage Green Accents** - Comforting, hope-filled highlights

---

## ðŸ”§ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

## ðŸ¤ Contributing

This is a sensitive mental health platform. Contributions should prioritize:
- User safety and emotional wellbeing
- Privacy and data protection
- Accessibility and inclusive design
- Clear, compassionate communication

---

## ðŸ“„ License

This project is dedicated to saving lives and supporting mental health. Use responsibly.

---

## ðŸ†˜ Crisis Resources

If you or someone you know is in crisis:
- **US**: National Suicide Prevention Lifeline: **988**
- **UK**: Samaritans: **116 123**
- **International**: Find resources at [findahelpline.com](https://findahelpline.com)

---

## ðŸ’™ Acknowledgments


---

Built with care for those who need a safe space to share.
