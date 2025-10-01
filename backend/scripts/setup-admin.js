const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...')

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst()
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      console.log(`Username: ${existingAdmin.username}`)
      console.log(`Email: ${existingAdmin.email}`)
      return
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@dhirajpandit.dev',
        password: hashedPassword
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log('📋 Login Credentials:')
    console.log(`Username: ${admin.username}`)
    console.log(`Email: ${admin.email}`)
    console.log(`Password: admin123`)
    console.log('')
    console.log('⚠️  Please change the default password after first login!')
    console.log('🔗 Admin Panel: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Error setting up admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupAdmin()
