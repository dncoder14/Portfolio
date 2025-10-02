const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads (in memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// GET /api/userinfo - Get user information
router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: 'dhiraj.pandit@adypu.edu.in'
      },
      include: {
        userSkills: {
          include: {
            skill: true
          },
          orderBy: {
            skill: {
              name: 'asc'
            }
          }
        }
      }
    });

    if (!user) {
      // Create default user if not exists
      const defaultUser = await prisma.user.create({
        data: {
          name: 'Dhiraj Pandit',
          email: 'dhiraj.pandit@adypu.edu.in',
          summary: 'Full-Stack Developer & UI/UX Enthusiast',
          location: 'Pune, India',
          profileImage: '/images/profile.jpg',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/dhiraj-pandit',
            github: 'https://github.com/dhiraj-pandit',
            twitter: 'https://twitter.com/dhiraj_pandit',
            email: 'dhiraj.pandit@adypu.edu.in'
          },
          skills: [
            { name: 'React', icon: 'react', level: 90 },
            { name: 'JavaScript', icon: 'javascript', level: 95 },
            { name: 'Node.js', icon: 'nodejs', level: 85 },
            { name: 'Python', icon: 'python', level: 80 },
            { name: 'MySQL', icon: 'mysql', level: 85 },
            { name: 'MongoDB', icon: 'mongodb', level: 75 },
            { name: 'Tailwind CSS', icon: 'tailwind', level: 90 },
            { name: 'GSAP', icon: 'gsap', level: 85 },
            { name: 'Three.js', icon: 'threejs', level: 70 },
            { name: 'Prisma', icon: 'prisma', level: 80 }
          ]
        }
      });
      return res.json(defaultUser);
    }

    // Transform user skills to include skill details
    const userWithSkills = {
      ...user,
      skillsWithLogos: user.userSkills.map(us => ({
        id: us.id,
        name: us.skill.name,
        logoUrl: us.skill.logoUrl,
        logoSvg: us.skill.logoSvg,
        category: us.skill.category,
        skillId: us.skillId
      }))
    };

    res.json(userWithSkills);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});

// POST /api/userinfo/upload - Upload profile image
router.post('/upload', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Write image directly to frontend public directory
    const frontendPublicDir = path.join(__dirname, '../../frontend/public/images');
    if (!fs.existsSync(frontendPublicDir)) {
      fs.mkdirSync(frontendPublicDir, { recursive: true });
    }
    
    const frontendImagePath = path.join(frontendPublicDir, 'profile.jpg');
    fs.writeFileSync(frontendImagePath, req.file.buffer);
    
    // Use relative URL that will be served from frontend
    const profileImageUrl = '/images/profile.jpg';
    
    // Update user with new profile image
    const updatedUser = await prisma.user.updateMany({
      where: {
        email: 'dhiraj.pandit@adypu.edu.in'
      },
      data: {
        profileImage: profileImageUrl
      }
    });

    res.json({ 
      message: 'Profile image uploaded successfully', 
      profileImageUrl,
      updatedUser 
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// PUT /api/userinfo - Update user information
router.put('/', async (req, res) => {
  try {
    const { name, summary, location, profileImage, socialLinks, skills } = req.body;
    
    const updatedUser = await prisma.user.updateMany({
      where: {
        email: 'dhiraj.pandit@adypu.edu.in'
      },
      data: {
        name,
        summary,
        location,
        profileImage,
        socialLinks,
        skills
      }
    });

    res.json({ message: 'User information updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Failed to update user information' });
  }
});

module.exports = router;
