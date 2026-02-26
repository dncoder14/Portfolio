# Dhiraj Pandit - Portfolio Website

A modern, futuristic, animated portfolio website built with React, GSAP, Three.js, and Express.js.

## Features

- Modern Design: Black & white minimalist aesthetic with futuristic elements
- Advanced Animations: GSAP-powered scroll-triggered animations and smooth transitions
- 3D Graphics: Three.js interactive backgrounds and 3D elements
- Smooth Scrolling: Lenis-powered smooth scrolling experience
- Responsive Design: Fully responsive across all devices
- Contact Form: Working contact form with Nodemailer email integration
- Admin Panel: JWT-protected admin panel for content management
- Performance Optimized: Lazy loading and optimized animations

## Tech Stack

### Frontend
- React 18 - UI framework
- Vite - Build tool and dev server
- Tailwind CSS - Styling framework
- GSAP - Animation library
- Three.js - 3D graphics library
- Lenis - Smooth scrolling library
- React Hook Form - Form handling
- Axios - HTTP client

### Backend
- Express.js - Web framework
- Prisma - Database ORM
- MongoDB - Database
- Nodemailer - Email service
- JWT - Authentication
- Bcrypt - Password hashing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Gmail account for email service

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Portfolio-1
   ```

2. Install dependencies
   ```bash
   npm run install:all
   ```

3. Environment Setup
   
   Copy the environment files and configure them:
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   ```

   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/portfolio_db"
   JWT_SECRET_KEY="your-super-secret-jwt-key-here"
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_TO="your-email@domain.com"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   FRONTEND_URL="http://localhost:3000"
   PORT=5000
   NODE_ENV="development"
   ```

4. Database Setup
   ```bash
   npm run setup
   ```

   This will:
   - Generate Prisma client
   - Push database schema
   - Create admin user (username: `admin`, password: `admin123`)
   - Seed database with sample data
   - Seed skills for admin panel selection

5. Start the development servers
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

6. Access the applications
   - Portfolio Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## Admin Panel

### Features
- Dashboard: Overview of projects, certificates, and contact messages
- Projects Management: Create, edit, and delete projects
- Certificates Management: Manage certificates and achievements
- Experience Management: Manage work experience timeline
- Contact Management: View and manage contact form submissions
- User Info Management: Update personal information and social links
- Skills Management: Add, edit, and remove skills with proficiency levels

### Admin Access
- URL: http://localhost:3000/admin
- Default Credentials:
  - Username: `admin`
  - Password: `admin123`

Change the default password after first login.

## Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## Author

**Dhiraj Pandit**
- Email: dhiraj.pandit@adypu.edu.in
- LinkedIn: [linkedin.com/in/dhiraj-pandit](https://linkedin.com/in/dhiraj-pandit)
- GitHub: [github.com/dhiraj-pandit](https://github.com/dhiraj-pandit)
