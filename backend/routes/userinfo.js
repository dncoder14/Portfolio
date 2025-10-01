const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/userinfo - Get user information
router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: 'dhiraj.pandit@adypu.edu.in'
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

    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
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
