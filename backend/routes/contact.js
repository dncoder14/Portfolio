const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();
const prisma = new PrismaClient();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to take our messages');
  }
});

// POST /api/contact - Send contact form
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    // Save contact form to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        message
      }
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #000;">
            <h3 style="margin-top: 0; color: #333;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #000; color: #fff; text-align: center;">
            <p style="margin: 0;">This message was sent from your portfolio contact form.</p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to user
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Dhiraj Pandit',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Thank You for Your Message!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reaching out through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
          
          <p>In the meantime, feel free to check out my latest projects on GitHub or connect with me on LinkedIn.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="https://github.com/dhiraj-pandit" 
               style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; margin: 0 10px; border-radius: 4px;">
              GitHub
            </a>
            <a href="https://linkedin.com/in/dhiraj-pandit" 
               style="display: inline-block; background: #0077b5; color: #fff; padding: 12px 24px; text-decoration: none; margin: 0 10px; border-radius: 4px;">
              LinkedIn
            </a>
          </div>
          
          <p>Best regards,<br>Dhiraj Pandit</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border-left: 4px solid #000;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(autoReplyOptions);

    res.json({ 
      message: 'Message sent successfully!',
      contactId: contact.id
    });

  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/contact - Get all contact messages (Admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// PUT /api/contact/:id/read - Mark contact as read (Admin only)
router.put('/:id/read', async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: {
        id: req.params.id
      },
      data: {
        read: true
      }
    });

    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

module.exports = router;
