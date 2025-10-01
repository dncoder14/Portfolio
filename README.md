# Dhiraj Pandit - Portfolio Website

A modern, futuristic, animated portfolio website built with React, GSAP, Three.js, and Express.js.

## 🚀 Features

- **Modern Design**: Black & white minimalist aesthetic with futuristic elements
- **Advanced Animations**: GSAP-powered scroll-triggered animations and smooth transitions
- **3D Graphics**: Three.js interactive backgrounds and 3D elements
- **Smooth Scrolling**: Lenis-powered smooth scrolling experience
- **Responsive Design**: Fully responsive across all devices
- **Contact Form**: Working contact form with Nodemailer email integration
- **Admin Panel**: JWT-protected admin panel for content management
- **Performance Optimized**: Lazy loading and optimized animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **GSAP** - Animation library
- **Three.js** - 3D graphics library
- **Lenis** - Smooth scrolling library
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Backend
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database
- **Nodemailer** - Email service
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
Portfolio-1/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Express backend
│   ├── routes/             # API routes
│   ├── prisma/             # Database schema
│   ├── server.js           # Server entry point
│   └── package.json
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Gmail account for email service

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Portfolio-1
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Copy the environment files and configure them:
   ```bash
   cp env.example .env
   cp frontend/env.example frontend/.env
   ```

   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"
   
   # JWT
   JWT_SECRET_KEY="your-super-secret-jwt-key-here"
   
   # Email Configuration (Gmail SMTP)
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-password"
   EMAIL_TO="dhiraj.pandit@adypu.edu.in"
   
   # Server
   PORT=5000
   NODE_ENV="development"
   ```

4. **Database Setup**
   ```bash
   # Set up database, create admin user, and seed sample data
   npm run setup
   ```

   This will:
   - Generate Prisma client
   - Push database schema
   - Create admin user (username: `admin`, password: `admin123`)
   - Seed database with sample data

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

6. **Access the applications**
   - **Portfolio Website**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin

## 📱 Sections

### 1. Hero Section
- Animated Three.js background with floating geometry
- GSAP-powered text animations
- Social media links with hover effects
- Call-to-action button

### 2. About Section
- Personal information and bio
- Animated text reveals
- Contact information display
- Action buttons

### 3. Skills Section
- Interactive skill cards with progress bars
- Hover animations and effects
- Technology icons and proficiency levels
- Statistics display

### 4. Projects Section
- Project showcase with images
- Hover effects and overlays
- GitHub and demo links
- Technology tags

### 5. Certificates Section
- Certificate display with images
- Hover animations
- View certificate functionality
- Achievement statistics

### 6. Contact Section
- Working contact form
- Form validation
- Email integration with Nodemailer
- Social media links
- Contact information

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/userinfo` - Get user information
- `GET /api/projects` - Get all projects
- `GET /api/certificates` - Get all certificates
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/verify` - Verify admin token
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/certificates` - Create certificate
- `PUT /api/certificates/:id` - Update certificate
- `DELETE /api/certificates/:id` - Delete certificate
- `PUT /api/userinfo` - Update user information
- `GET /api/contact` - Get all contact messages
- `PUT /api/contact/:id/read` - Mark contact as read

## 🛡️ Admin Panel

The admin panel provides full control over the portfolio content:

### Features
- **Dashboard**: Overview of projects, certificates, and contact messages
- **Projects Management**: Create, edit, and delete projects
- **Certificates Management**: Manage certificates and achievements
- **Contact Management**: View and manage contact form submissions
- **User Info Management**: Update personal information and social links
- **Skills Management**: Add, edit, and remove skills with proficiency levels

### Admin Access
- **URL**: http://localhost:3000/admin
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`

⚠️ **Important**: Change the default password after first login!

## 🎨 Customization

### Colors
The color scheme can be customized in `frontend/tailwind.config.js`:
```javascript
colors: {
  'primary': '#000000',
  'secondary': '#ffffff',
  'accent': '#00ff00',
  // ... other colors
}
```

### Animations
GSAP animations can be customized in individual component files. The main animation configurations are in each component's `useEffect` hook.

### Content
Update the content by modifying the database through the admin panel or by updating the sample data in the backend routes.

## 🚀 Deployment

### Frontend Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment
1. Set up a MySQL database
2. Update the `DATABASE_URL` in your environment variables
3. Deploy to your hosting service (Railway, Heroku, etc.)
4. Run database migrations:
   ```bash
   npx prisma db push
   ```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Dhiraj Pandit**
- Email: dhiraj.pandit@adypu.edu.in
- LinkedIn: [linkedin.com/in/dhiraj-pandit](https://linkedin.com/in/dhiraj-pandit)
- GitHub: [github.com/dhiraj-pandit](https://github.com/dhiraj-pandit)

## 🙏 Acknowledgments

- GSAP for amazing animations
- Three.js for 3D graphics
- Tailwind CSS for styling
- React community for excellent documentation