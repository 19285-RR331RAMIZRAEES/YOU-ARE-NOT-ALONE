# Admin Feature Setup Guide

## Overview
An admin panel has been added to allow you to manage and remove inappropriate stories that don't align with community guidelines.

## Features Added

### 1. Admin API Endpoint
- Modified `/api/stories/[id]/route.ts` to accept admin password for deletion
- Admin can delete any story using the `x-admin-password` header
- Regular users can still delete their own stories using deletion tokens

### 2. Admin Panel UI
- New admin page at `/admin`
- Password-protected access
- View all stories with delete buttons
- Clean, easy-to-use interface

### 3. Navigation
- Added a subtle lock icon (🔒) in the navigation bar
- Only visible when you hover over it
- Provides discrete access to the admin panel

## Setup Instructions

### Step 1: Set Your Admin Password

1. Create a `.env.local` file in the root of your project (if it doesn't exist):
   ```bash
   touch .env.local
   ```

2. Add your admin password to `.env.local`:
   ```env
   ADMIN_PASSWORD=your_secure_password_here
   ```

   **IMPORTANT:** 
   - Choose a strong, unique password
   - DO NOT commit `.env.local` to git
   - Change "your_secure_password_here" to your actual password

### Step 2: Restart Your Development Server

After setting the admin password, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 3: Access the Admin Panel

1. Navigate to your website
2. Look for the small lock icon (🔒) in the navigation bar
3. Click it to access the admin panel
4. Enter your admin password
5. You can now view and delete any story

## How to Use

### Deleting Inappropriate Stories

1. Log into the admin panel at `/admin`
2. Browse through all published stories
3. Click the "Delete" button next to any inappropriate story
4. Confirm the deletion
5. The story will be permanently removed

### Security Features

- Password is stored in environment variables (not in code)
- Admin session is stored in browser sessionStorage (clears when browser is closed)
- All API requests require the admin password
- Deletion confirmation prompts prevent accidental removals

## For Production Deployment

When deploying to Vercel or another platform:

1. Add the `ADMIN_PASSWORD` environment variable in your deployment platform's settings
2. Make sure it's set to the same password you use locally
3. **Vercel Instructions:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `ADMIN_PASSWORD` = your secure password
   - Redeploy your application

## API Usage

If you want to delete stories programmatically:

```javascript
// Delete a story as admin
await fetch(`/api/stories/${storyId}`, {
  method: 'DELETE',
  headers: {
    'x-admin-password': 'your_admin_password'
  }
});
```

## Security Best Practices

1. **Use a strong password** - Mix of uppercase, lowercase, numbers, and symbols
2. **Don't share the password** - Keep it confidential
3. **Change it periodically** - Update the password in your environment variables
4. **Use HTTPS** - Ensure your site uses HTTPS in production
5. **Monitor access** - Check your admin panel regularly

## Troubleshooting

### "Invalid admin password" error
- Double-check your `.env.local` file has the correct password
- Restart your development server after changing environment variables
- Make sure there are no extra spaces in the password

### Admin panel not loading
- Ensure you've created the admin page at `/app/admin/page.tsx`
- Check the browser console for any errors
- Verify your Next.js server is running

### Changes not reflecting
- Clear your browser cache
- Try incognito/private browsing mode
- Restart the development server

## File Changes Summary

1. **Modified:** `app/api/stories/[id]/route.ts` - Added admin authentication
2. **Created:** `app/admin/page.tsx` - Admin panel interface
3. **Modified:** `app/layout.tsx` - Added admin link to navigation
4. **Modified:** `.env.example` - Added ADMIN_PASSWORD documentation

---

**Questions or Issues?**
If you encounter any problems, check the console logs for detailed error messages.
