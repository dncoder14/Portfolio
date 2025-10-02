const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/skills - Get all available skills
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// GET /api/skills/categories - Get all skill categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.skill.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category']
    });

    const categoryList = categories
      .map(c => c.category)
      .filter(Boolean)
      .sort();

    res.json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/skills - Create a new skill (Admin only)
router.post('/', async (req, res) => {
  try {
    const { name, logoUrl, logoSvg, category } = req.body;

    if (!name || (!logoUrl && !logoSvg)) {
      return res.status(400).json({ error: 'Name and a logo (URL or SVG) is required' });
    }

    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: { name }
    });

    if (existingSkill) {
      return res.status(400).json({ error: 'Skill already exists' });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        logoUrl: logoUrl || null,
        logoSvg: logoSvg || null,
        category: category || 'Other'
      }
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// PUT /api/skills/:id - Update a skill (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, logoSvg, category, isActive } = req.body;

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(logoUrl && { logoUrl }),
        ...(logoSvg !== undefined && { logoSvg }),
        ...(category && { category }),
        ...(typeof isActive === 'boolean' && { isActive })
      }
    });

    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// DELETE /api/skills/:id - Delete a skill (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all user skills associated with this skill first
    await prisma.userSkill.deleteMany({
      where: { skillId: id }
    });

    // Delete the skill
    await prisma.skill.delete({
      where: { id }
    });

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// GET /api/skills/user/:userId - Get user's skills with details
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true
      },
      orderBy: {
        skill: {
          name: 'asc'
        }
      }
    });

    const skillsWithDetails = userSkills.map(us => ({
      id: us.id,
      name: us.skill.name,
      logoUrl: us.skill.logoUrl,
      logoSvg: us.skill.logoSvg,
      category: us.skill.category,
      level: us.level,
      skillId: us.skillId
    }));

    res.json(skillsWithDetails);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  }
});

// POST /api/skills/user/:userId - Add skills to user
router.post('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { skillIds } = req.body; // Array of { skillId, level }

    if (!Array.isArray(skillIds)) {
      return res.status(400).json({ error: 'skillIds must be an array' });
    }

    // Remove existing user skills
    await prisma.userSkill.deleteMany({
      where: { userId }
    });

    // Add new user skills
    const userSkills = await Promise.all(
      skillIds.map(({ skillId, level = 50 }) =>
        prisma.userSkill.create({
          data: {
            userId,
            skillId,
            level: Math.max(0, Math.min(100, level)) // Ensure level is between 0-100
          },
          include: {
            skill: true
          }
        })
      )
    );

    const skillsWithDetails = userSkills.map(us => ({
      id: us.id,
      name: us.skill.name,
      logoUrl: us.skill.logoUrl,
      logoSvg: us.skill.logoSvg,
      category: us.skill.category,
      level: us.level,
      skillId: us.skillId
    }));

    res.json(skillsWithDetails);
  } catch (error) {
    console.error('Error updating user skills:', error);
    res.status(500).json({ error: 'Failed to update user skills' });
  }
});

// PUT /api/skills/user/:userId/:userSkillId - Update user skill level
router.put('/user/:userId/:userSkillId', async (req, res) => {
  try {
    const { userId, userSkillId } = req.params;
    const { level } = req.body;

    if (typeof level !== 'number' || level < 0 || level > 100) {
      return res.status(400).json({ error: 'Level must be a number between 0 and 100' });
    }

    const userSkill = await prisma.userSkill.update({
      where: {
        id: userSkillId,
        userId // Ensure the skill belongs to the user
      },
      data: { level },
      include: {
        skill: true
      }
    });

    const skillWithDetails = {
      id: userSkill.id,
      name: userSkill.skill.name,
      logoUrl: userSkill.skill.logoUrl,
      logoSvg: userSkill.skill.logoSvg,
      category: userSkill.skill.category,
      level: userSkill.level,
      skillId: userSkill.skillId
    };

    res.json(skillWithDetails);
  } catch (error) {
    console.error('Error updating user skill level:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User skill not found' });
    }
    res.status(500).json({ error: 'Failed to update user skill level' });
  }
});

// DELETE /api/skills/user/:userId/:userSkillId - Remove skill from user
router.delete('/user/:userId/:userSkillId', async (req, res) => {
  try {
    const { userId, userSkillId } = req.params;

    await prisma.userSkill.delete({
      where: {
        id: userSkillId,
        userId // Ensure the skill belongs to the user
      }
    });

    res.json({ message: 'Skill removed from user successfully' });
  } catch (error) {
    console.error('Error removing user skill:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User skill not found' });
    }
    res.status(500).json({ error: 'Failed to remove user skill' });
  }
});

module.exports = router;
