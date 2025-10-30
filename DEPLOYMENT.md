# Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** - Create a free cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. **Cloudinary Account** - Sign up at [cloudinary.com](https://cloudinary.com) for image uploads
3. **Gmail App Password** - Generate at [myaccount.google.com](https://myaccount.google.com/apppasswords)
4. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)

## Backend Deployment (Vercel)

### 1. Prepare Backend
```bash
cd backend
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: portfolio-backend
# - Directory: ./
# - Override settings? N
```

### 3. Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

```
DATABASE_URL = mongodb+srv://username:password@cluster.mongodb.net/portfolio_db
JWT_SECRET_KEY = your-super-secret-jwt-key-here
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = your-app-password
EMAIL_TO = your-email@domain.com
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
FRONTEND_URL = https://your-frontend-domain.vercel.app
NODE_ENV = production
```

### 4. Setup Database
```bash
# Generate Prisma client and setup admin
vercel env pull .env.local
npx prisma generate
npx prisma db push
node scripts/setup-admin.js
node scripts/seed-skills.js
```

## Frontend Deployment (Vercel)

### 1. Update API URL
In `frontend/.env`:
```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

### 2. Deploy Frontend
```bash
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: portfolio-frontend
# - Directory: ./
# - Override settings? N
```

### 3. Update CORS
Update `FRONTEND_URL` in backend environment variables with your frontend domain.

## Alternative Deployment Options

### Backend Alternatives
- **Railway**: Connect GitHub repo, set environment variables
- **Render**: Connect GitHub repo, set environment variables
- **Heroku**: Use Heroku CLI, set config vars

### Frontend Alternatives
- **Netlify**: Drag & drop build folder or connect GitHub
- **GitHub Pages**: For static sites only
- **Firebase Hosting**: Use Firebase CLI

## Post-Deployment Setup

1. **Test all endpoints** using the deployed URLs
2. **Create admin account** using the setup script
3. **Upload sample data** through the admin panel
4. **Configure Cloudinary** for image uploads
5. **Test contact form** with real email credentials

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET_KEY="random-secret-key"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_TO="contact-recipient@domain.com"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
FRONTEND_URL="https://your-frontend.vercel.app"
NODE_ENV="production"
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

## Troubleshooting

### Common Issues
1. **CORS errors**: Update FRONTEND_URL in backend env vars
2. **Database connection**: Check MongoDB Atlas IP whitelist (0.0.0.0/0 for all)
3. **Image uploads failing**: Verify Cloudinary credentials
4. **Email not working**: Use Gmail app password, not regular password
5. **Admin login failing**: Run setup-admin.js script

### Logs
- **Vercel**: Check function logs in dashboard
- **Railway**: View deployment logs
- **Render**: Check build and runtime logs

## Security Notes

1. **Never commit .env files** to version control
2. **Use strong JWT secrets** (32+ characters)
3. **Whitelist specific domains** in CORS for production
4. **Use HTTPS** for all production URLs
5. **Regularly rotate** API keys and passwords