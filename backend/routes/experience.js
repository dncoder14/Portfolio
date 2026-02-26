const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/experience - Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        startDate: 'desc'
      }
    });
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// GET /api/experience/:id - Get single experience
router.get('/:id', async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// POST /api/experience - Create new experience
router.post('/', [
  body('company').notEmpty().withMessage('Company is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('technologies').isArray().withMessage('Technologies must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, position, startDate, endDate, current, description, technologies, location, companyLogo } = req.body;

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        description,
        technologies,
        location,
        companyLogo
      }
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

// PUT /api/experience/:id - Update experience
router.put('/:id', async (req, res) => {
  try {
    const { company, position, startDate, endDate, current, description, technologies, location, companyLogo } = req.body;

    const experience = await prisma.experience.update({
      where: { id: req.params.id },
      data: {
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current,
        description,
        technologies,
        location,
        companyLogo
      }
    });

    res.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// DELETE /api/experience/:id - Delete experience
router.delete('/:id', async (req, res) => {
  try {
    await prisma.experience.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// POST /api/experience/upload - Upload company logo
router.post('/upload', upload.single('companyLogo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'portfolio/experience',
        transformation: [{ width: 200, height: 200, crop: 'fill' }]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }
        res.json({ imageUrl: result.secure_url });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading company logo:', error);
    res.status(500).json({ error: 'Failed to upload company logo' });
  }
});

module.exports = router;
