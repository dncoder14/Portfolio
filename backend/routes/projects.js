const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // If no projects exist, create some sample projects
    if (projects.length === 0) {
      const sampleProjects = await prisma.project.createMany({
        data: [
          {
            title: 'E-Commerce Platform',
            description: 'A full-stack e-commerce platform built with React, Node.js, and MySQL. Features include user authentication, product management, shopping cart, and payment integration.',
            imageUrl: '/images/projects/ecommerce.jpg',
            githubUrl: 'https://github.com/dhiraj-pandit/ecommerce-platform',
            demoUrl: 'https://ecommerce-demo.com',
            technologies: ['React', 'Node.js', 'MySQL', 'Stripe', 'Tailwind CSS'],
            featured: true
          },
          {
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
            imageUrl: '/images/projects/taskmanager.jpg',
            githubUrl: 'https://github.com/dhiraj-pandit/task-manager',
            demoUrl: 'https://taskmanager-demo.com',
            technologies: ['React', 'Socket.io', 'MongoDB', 'Express', 'GSAP'],
            featured: true
          },
          {
            title: 'Weather Dashboard',
            description: 'A responsive weather dashboard with location-based forecasts, interactive maps, and beautiful animations using Three.js.',
            imageUrl: '/images/projects/weather.jpg',
            githubUrl: 'https://github.com/dhiraj-pandit/weather-dashboard',
            demoUrl: 'https://weather-demo.com',
            technologies: ['React', 'Three.js', 'OpenWeather API', 'Tailwind CSS'],
            featured: false
          }
        ]
      });

      const newProjects = await prisma.project.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.json(newProjects);
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create new project (Admin only)
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('technologies').isArray().withMessage('Technologies must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, imageUrl, githubUrl, demoUrl, technologies, featured } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        githubUrl,
        demoUrl,
        technologies,
        featured: featured || false
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update project (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, imageUrl, githubUrl, demoUrl, technologies, featured } = req.body;

    const project = await prisma.project.update({
      where: {
        id: req.params.id
      },
      data: {
        title,
        description,
        imageUrl,
        githubUrl,
        demoUrl,
        technologies,
        featured
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: {
        id: req.params.id
      }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
