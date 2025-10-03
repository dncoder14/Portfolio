const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /api/admin/login - Admin login
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: {
        username: username
      }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    // Handle default password scenario - if stored password is default hash, allow 'admin123'
    const isValidPassword = await bcrypt.compare(password, admin.password);
    const isDefaultPassword = password === 'admin123' && await bcrypt.compare('admin123', admin.password);
    
    if (!isValidPassword && !isDefaultPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        email: admin.email 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/admin/register - Create admin user (only for initial setup)
router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// GET /api/admin/dashboard - Get dashboard stats (Protected)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const [projectsCount, certificatesCount, contactsCount, unreadContactsCount] = await Promise.all([
      prisma.project.count(),
      prisma.certificate.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } })
    ]);

    res.json({
      stats: {
        projects: projectsCount,
        certificates: certificatesCount,
        contacts: contactsCount,
        unreadContacts: unreadContactsCount
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// POST /api/admin/change-password - Change admin password (Protected)
router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate that new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match' });
    }

    // Get admin user
    const admin = await prisma.admin.findUnique({
      where: {
        id: req.user.id
      }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Check current password
    // If password is the default 'admin123' hash, allow login with plain 'admin123'
    const defaultPasswordHash = await bcrypt.hash('admin123', 12);
    const isDefaultPassword = await bcrypt.compare('admin123', admin.password);
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);

    if (!isCurrentPasswordValid && !isDefaultPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in database
    await prisma.admin.update({
      where: {
        id: req.user.id
      },
      data: {
        password: hashedNewPassword
      }
    });

    res.json({
      message: 'Password changed successfully. Please log in again.',
      requiresReauth: true
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// GET /api/admin/verify - Verify token (Protected)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

module.exports = router;
