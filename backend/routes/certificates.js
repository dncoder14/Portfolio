const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/certificates - Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    // If no certificates exist, create some sample certificates
    if (certificates.length === 0) {
      const sampleCertificates = await prisma.certificate.createMany({
        data: [
          {
            title: 'Full Stack Web Development',
            organization: 'freeCodeCamp',
            date: new Date('2023-06-15'),
            certificateUrl: 'https://freecodecamp.org/certification/dhiraj-pandit/full-stack'
          },
          {
            title: 'React Developer Certification',
            organization: 'Meta (Facebook)',
            date: new Date('2023-08-20'),
            certificateUrl: 'https://coursera.org/verify/1234567890'
          },
          {
            title: 'AWS Cloud Practitioner',
            organization: 'Amazon Web Services',
            date: new Date('2023-10-10'),
            certificateUrl: 'https://aws.amazon.com/verification/1234567890'
          },
          {
            title: 'JavaScript Algorithms and Data Structures',
            organization: 'freeCodeCamp',
            date: new Date('2023-04-12'),
            certificateUrl: 'https://freecodecamp.org/certification/dhiraj-pandit/javascript-algorithms'
          }
        ]
      });

      const newCertificates = await prisma.certificate.findMany({
        orderBy: {
          date: 'desc'
        }
      });
      return res.json(newCertificates);
    }

    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// GET /api/certificates/:id - Get single certificate
router.get('/:id', async (req, res) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
});

// POST /api/certificates - Create new certificate (Admin only)
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('organization').notEmpty().withMessage('Organization is required'),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, organization, date, certificateUrl } = req.body;

    const certificate = await prisma.certificate.create({
      data: {
        title,
        organization,
        date: new Date(date),
        certificateUrl
      }
    });

    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

// PUT /api/certificates/:id - Update certificate (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, organization, date, certificateUrl } = req.body;

    const certificate = await prisma.certificate.update({
      where: {
        id: req.params.id
      },
      data: {
        title,
        organization,
        date: new Date(date),
        certificateUrl
      }
    });

    res.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

// DELETE /api/certificates/:id - Delete certificate (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.certificate.delete({
      where: {
        id: req.params.id
      }
    });

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

module.exports = router;
