# Vercel Deployment Guide

## Steps to Deploy with PostgreSQL

### 1. Push Code to GitHub
Already done ✅

### 2. Create Vercel Project
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import repository: `19285-RR331RAMIZRAEES/YOU-ARE-NOT-ALONE`

### 3. Add Vercel Postgres
1. In your Vercel project dashboard, go to "Storage"
2. Click "Create Database"
3. Select "Postgres"
4. Choose "Continue" with the Hobby plan (free)
5. Name your database (e.g., "hope-stories-db")
6. Click "Create"

### 4. Connect Database to Project
1. After creating the database, click "Connect to Project"
2. Select your project from the list
3. Vercel will automatically add these environment variables:
   - `POSTGRES_HOST`
   - `POSTGRES_DATABASE`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_URL`

### 5. Deploy
1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Your app will be live at: `https://your-project.vercel.app`

### 6. Test
- Visit your deployed URL
- Try creating a story
- Check that stories persist after refresh

## Database Management

Access your database via Vercel dashboard:
- Go to Storage → your database
- Use the "Query" tab to run SQL
- View data in the "Data" tab

## Environment Variables (Auto-configured by Vercel)

All PostgreSQL environment variables are automatically set when you connect Vercel Postgres to your project. No manual configuration needed!

## Local Development

To run locally with Vercel Postgres:
```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull

# Run development server
npm run dev
```

## Troubleshooting

### Backend not working
- Check Vercel Function logs in Dashboard → Deployments → [Your deployment] → Functions
- Verify environment variables are set in Settings → Environment Variables

### Database connection issues
- Ensure Postgres is connected to the project
- Check that all POSTGRES_* variables are present

### Build failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in requirements.txt
