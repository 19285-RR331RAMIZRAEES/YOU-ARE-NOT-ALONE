# 🫂 You Are Not Alone - Mental Health Support Platform

This project is a mental health support and suicide prevention platform designed to help people who are struggling with depression, suicidal thoughts, or emotional distress feel seen, heard, and less alone.

The platform allows users to share their personal stories—either anonymously or with their real identity—about what they went through, how they survived, and what helped them cope. By reading real experiences from others who have faced similar pain, users may find hope, strength, and the courage to keep going.

This project is built with a strong focus on emotional safety, privacy, and empathy-driven design.

---

## 💡 Core Goals

- Save lives through connection and shared human experiences
- Reduce stigma around mental health and suicidal thoughts
- Create a safe, calming, and supportive digital space
- Empower survivors to heal by sharing their journeys
- Offer hope to those who feel alone in their struggles

---

## ✨ Key Features

### 🔒 Privacy Control
- Share stories anonymously or with a real name
- Full control over visibility and identity

### 📝 Story Sharing
- Survivors and individuals can share experiences as a form of healing
- Focus on recovery, coping, and survival—not harm

### 💬 Supportive Community Interaction
- Encouraging replies and compassionate comments
- Non-judgmental, moderated discussions

### 🎨 Soothing UI & Gentle UX
- Calm colors, minimal design, and emotionally safe interactions
- Designed to reduce anxiety and emotional overload
- Warm Dawn color palette with sage green accents
- Elegant Playfair Display typography for headings

### 🛡️ Safety-First Design
- Content moderation to prevent triggering or harmful material
- Crisis resources and helpline information clearly accessible
- Emergency banner with suicide prevention helpline (988)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.8+
- **PostgreSQL** (via Docker or local installation)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up PostgreSQL database:**
   ```bash
   docker-compose up -d
   ```

5. **Configure environment variables:**
   - Create `.env` file in the root directory
   - Copy contents from `.env.example`
   - Update with your local settings

### Running the Application

You need to run **both** the backend and frontend servers:

**Terminal 1 - Backend (FastAPI):**
```bash
cd backend
python main_postgres.py
```
Backend will be available at http://localhost:8000

**Terminal 2 - Frontend (Next.js):**
```bash
npm run dev
```
Frontend will be available at http://localhost:3000

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

---

## 🚀 Production Deployment

For detailed deployment instructions to Vercel, Railway, or other platforms, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy!

---

## 📁 Project Structure

```
├── app/                      # Next.js 14 app directory
│   ├── assets/              # Logo and images
│   ├── share/               # Share story page
│   ├── stories/             # Stories feed page
│   ├── globals.css          # Global styles with Warm Dawn palette
│   ├── layout.tsx           # Root layout with navigation
│   └── page.tsx             # Homepage
├── backend/                 # FastAPI backend
│   ├── main_postgres.py     # Main API server (PostgreSQL)
│   ├── database.py          # Database configuration
│   ├── init.sql             # Database schema
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── public/                  # Static assets
├── docker-compose.yml       # PostgreSQL container setup
├── .gitignore              # Git ignore rules
├── DEPLOYMENT.md           # Deployment guide
├── README.md               # This file
├── package.json            # Node.js dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Production database
- **Pydantic** - Data validation

### Design
- **Warm Dawn Color Palette** - Calming cream to beige gradient
- **Playfair Display** - Elegant serif font for headings
- **Inter** - Clean sans-serif for body text
- **Sage Green Accents** - Comforting, hope-filled highlights

---

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts

- `python main_postgres.py` - Start FastAPI server
- View API docs at `/docs` for interactive testing

---

## 🤝 Contributing

This is a sensitive mental health platform. Contributions should prioritize:
- User safety and emotional wellbeing
- Privacy and data protection
- Accessibility and inclusive design
- Clear, compassionate communication

---

## 📄 License

This project is dedicated to saving lives and supporting mental health. Use responsibly.

---

## 🆘 Crisis Resources

If you or someone you know is in crisis:
- **US**: National Suicide Prevention Lifeline: **988**
- **UK**: Samaritans: **116 123**
- **International**: Find resources at [findahelpline.com](https://findahelpline.com)

---

## 💙 Acknowledgments

This platform exists to remind everyone struggling that **you are not alone**. Your story matters. Your life matters.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Navbar, Footer, Emergency Banner
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles and Tailwind directives
│   ├── stories/
│   │   └── page.tsx        # Story feed page
│   └── share/
│       └── page.tsx        # Share story page (form)
├── public/                 # Static assets
├── tailwind.config.ts      # Tailwind configuration with custom colors
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
└── package.json            # Project dependencies and scripts
```

## Custom Colors

The project uses a custom color palette defined in Tailwind config:

- **Pastel Blue**: Calming blues (50-500 shades)
- **Beige**: Warm beiges (50-500 shades)

## Pages

### Home (`/`)
Welcome page with:
- Gentle welcome message
- Two action buttons: "Read Stories" and "Share Your Story"
- Inspirational quote

### Stories (`/stories`)
- Displays sample stories (ready for backend integration)
- Story cards with title, excerpt, date, and author
- Call-to-action to share your own story

### Share (`/share`)
- Form to submit a new story
- Anonymous posting option
- Community guidelines
- Currently shows alert (no backend yet)

## Layout Components

### Emergency Banner
- Static banner at the top of every page
- Displays crisis helpline number (988)
- Soft blue background for visibility without alarming

### Navbar
- Site branding
- Navigation links to all pages
- Responsive mobile menu ready

### Footer
- Copyright information
- Supportive messaging

## Future Enhancements

- [ ] Backend API integration
- [ ] Database for storing stories
- [ ] User authentication
- [ ] Story moderation system
- [ ] Comments and reactions
- [ ] Search and filter functionality
- [ ] Story categories/tags

## Notes

- No backend integration yet - form submissions show alerts
- Sample data is hardcoded in the Stories page
- Design emphasizes accessibility and emotional safety

## License

This project was created as a demonstration. Modify as needed for your use case.

## Support Resources

If you or someone you know needs help:
- **National Crisis Helpline**: 988
- **Crisis Text Line**: Text HOME to 741741

---

Built with care for those who need a safe space to share.
