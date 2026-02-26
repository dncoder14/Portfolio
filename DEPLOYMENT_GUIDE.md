# Deployment Guide

## Backend Deployment (Vercel)

### Prerequisites
- Vercel account
- MongoDB Atlas database (already configured)
- Cloudinary account (already configured)

### Steps

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings on vercel.com
   - Navigate to Settings → Environment Variables
   - Add the following variables:

   ```
   DATABASE_URL=mongodb+srv://dhirajpandit5050_db_user:0AmFIiHDs8EA2IYs@cluster0.4cdksyp.mongodb.net/portfolio_db?retryWrites=true&w=majority&appName=Cluster0
   
   JWT_SECRET_KEY=your-super-secret-jwt-key-here-lalala-Droocp-2614
   
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=dhirajpandit5050@gmail.com
   EMAIL_PASS=tudq armh uixm ajcw
   EMAIL_TO=dhiraj.pandit@adypu.edu.in
   
   CLOUDINARY_CLOUD_NAME=dwucvo5g9
   CLOUDINARY_API_KEY=315567887678912
   CLOUDINARY_API_SECRET=8h5UGMS_9qkK8ef7Wy-dgkDmi6Q
   
   NODE_ENV=production
   
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. **Redeploy** after setting environment variables
   ```bash
   vercel --prod
   ```

6. **Your backend URL will be**: `https://your-backend-name.vercel.app`

---

## Frontend Deployment (Vercel)

### Steps

1. **Update Frontend .env**
   - Create `.env.production` in frontend folder:
   ```
   VITE_API_URL=https://your-backend-name.vercel.app
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   ```
   VITE_API_URL=https://your-backend-name.vercel.app
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

---

## Post-Deployment

### Update CORS
After deployment, update the backend FRONTEND_URL environment variable in Vercel dashboard to your actual frontend URL.

### Database Setup
The database is already set up on MongoDB Atlas. If you need to reseed:
```bash
cd backend
npm run seed
```

### Admin Access
- URL: `https://your-frontend-domain.vercel.app/admin`
- Username: `admin`
- Password: `admin123` (change immediately after first login)

---

## Important Notes

⚠️ **Security**:
- Change default admin password immediately
- Keep environment variables secure
- Use strong JWT secret in production
- Enable 2FA on Vercel and MongoDB Atlas

⚠️ **MongoDB Atlas**:
- Ensure IP whitelist includes `0.0.0.0/0` for Vercel (or use Vercel IPs)
- Monitor database usage and set up alerts

⚠️ **Email**:
- Gmail App Password is already configured
- Monitor email sending limits

---

## Troubleshooting

### CORS Issues
- Ensure FRONTEND_URL in backend matches your frontend domain
- Check Vercel logs: `vercel logs`

### Database Connection
- Verify DATABASE_URL is correct in Vercel dashboard
- Check MongoDB Atlas network access settings

### Build Failures
- Check Vercel deployment logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility
