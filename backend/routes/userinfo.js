const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads (in memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for both images and PDFs
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedPdfTypes = /pdf/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    
    if ((allowedImageTypes.test(extname) && allowedImageTypes.test(mimetype)) ||
        (allowedPdfTypes.test(extname) && allowedPdfTypes.test(mimetype))) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, GIF, WebP) and PDF files are allowed!'));
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
            github: 'https://github.com/dhiraj-pandit'
          }
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

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'portfolio/profile',
        public_id: 'profile_image',
        overwrite: true
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }

        // Update user with Cloudinary URL
        const updatedUser = await prisma.user.updateMany({
          where: { email: 'dhiraj.pandit@adypu.edu.in' },
          data: { profileImage: result.secure_url }
        });

        res.json({ 
          message: 'Profile image uploaded successfully', 
          profileImageUrl: result.secure_url,
          updatedUser 
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// POST /api/userinfo/upload-cv - Upload CV
router.post('/upload-cv', upload.single('cvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed for CV upload' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'portfolio/cv',
        public_id: 'cv',
        overwrite: true,
        format: 'pdf'
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }

        const updatedUser = await prisma.user.updateMany({
          where: { email: 'dhiraj.pandit@adypu.edu.in' },
          data: { cvUrl: result.secure_url }
        });

        res.json({ 
          message: 'CV uploaded successfully', 
          cvUrl: result.secure_url,
          updatedUser 
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ error: 'Failed to upload CV' });
  }
});

// PUT /api/userinfo - Update user information
router.put('/', async (req, res) => {
  try {
    const { name, summary, location, profileImage, cvUrl, socialLinks } = req.body;
    
    // Update user and return the full, updated record
    const updatedUser = await prisma.user.update({
      where: { email: 'dhiraj.pandit@adypu.edu.in' },
      data: { 
        name, 
        summary, 
        location, 
        profileImage, 
        cvUrl, 
        socialLinks 
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Failed to update user information' });
  }
});

module.exports = router;
