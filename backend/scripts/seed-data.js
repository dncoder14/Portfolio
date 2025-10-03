const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function seedData() {
  try {
    console.log('🌱 Seeding database with sample data...')

    // Create user info
    const user = await prisma.user.upsert({
      where: { email: 'dhiraj.pandit@adypu.edu.in' },
      update: {
        socialLinks: {
          linkedin: 'https://linkedin.com/in/dhiraj-pandit',
          github: 'https://github.com/dhiraj-pandit',
          email: 'dhiraj.pandit@adypu.edu.in'
        }
      },
      create: {
        name: 'Dhiraj Pandit',
        email: 'dhiraj.pandit@adypu.edu.in',
        summary: 'Full-Stack Developer & UI/UX Enthusiast',
        location: 'Pune, India',
        profileImage: '/images/profile.jpg',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/dhiraj-pandit',
          github: 'https://github.com/dhiraj-pandit',
          email: 'dhiraj.pandit@adypu.edu.in'
        },
        skills: [
          { name: 'React', icon: '⚛️', level: 90 },
          { name: 'JavaScript', icon: '🟨', level: 95 },
          { name: 'Node.js', icon: '🟢', level: 85 },
          { name: 'Python', icon: '🐍', level: 80 },
          { name: 'MySQL', icon: '🗄️', level: 85 },
          { name: 'MongoDB', icon: '🍃', level: 75 },
          { name: 'Tailwind CSS', icon: '🎨', level: 90 },
          { name: 'GSAP', icon: '✨', level: 85 },
          { name: 'Three.js', icon: '🎮', level: 70 },
          { name: 'Prisma', icon: '🔧', level: 80 }
        ]
      }
    })

    console.log('✅ User info created')

    // Create sample projects
    const projects = await prisma.project.createMany({
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
        },
        {
          title: 'Portfolio Website',
          description: 'A modern, animated portfolio website built with React, GSAP, and Three.js. Features smooth scrolling, 3D animations, and a contact form.',
          imageUrl: '/images/projects/portfolio.jpg',
          githubUrl: 'https://github.com/dhiraj-pandit/portfolio',
          demoUrl: 'https://dhirajpandit.dev',
          technologies: ['React', 'GSAP', 'Three.js', 'Tailwind CSS', 'Express'],
          featured: true
        }
      ],
      skipDuplicates: true
    })

    console.log('✅ Sample projects created')

    // Create sample certificates
    const certificates = await prisma.certificate.createMany({
      data: [
        {
          title: 'Full Stack Web Development',
          organization: 'freeCodeCamp',
          date: new Date('2023-06-15'),
          certificateUrl: 'https://freecodecamp.org/certification/dhiraj-pandit/full-stack',
          imageUrl: '/images/certificates/fcc-fullstack.jpg'
        },
        {
          title: 'React Developer Certification',
          organization: 'Meta (Facebook)',
          date: new Date('2023-08-20'),
          certificateUrl: 'https://coursera.org/verify/1234567890',
          imageUrl: '/images/certificates/meta-react.jpg'
        },
        {
          title: 'AWS Cloud Practitioner',
          organization: 'Amazon Web Services',
          date: new Date('2023-10-10'),
          certificateUrl: 'https://aws.amazon.com/verification/1234567890',
          imageUrl: '/images/certificates/aws-practitioner.jpg'
        },
        {
          title: 'JavaScript Algorithms and Data Structures',
          organization: 'freeCodeCamp',
          date: new Date('2023-04-12'),
          certificateUrl: 'https://freecodecamp.org/certification/dhiraj-pandit/javascript-algorithms',
          imageUrl: '/images/certificates/fcc-javascript.jpg'
        },
        {
          title: 'Responsive Web Design',
          organization: 'freeCodeCamp',
          date: new Date('2023-02-28'),
          certificateUrl: 'https://freecodecamp.org/certification/dhiraj-pandit/responsive-web-design',
          imageUrl: '/images/certificates/fcc-responsive.jpg'
        }
      ],
      skipDuplicates: true
    })

    console.log('✅ Sample certificates created')

    // Create sample contact messages
    const contacts = await prisma.contact.createMany({
      data: [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          message: 'Hi Dhiraj! I came across your portfolio and I\'m impressed with your work. I have a project that might interest you. Could we schedule a call to discuss it?',
          read: false
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah.j@company.com',
          message: 'Hello! I\'m looking for a React developer for our startup. Your portfolio shows exactly the kind of skills we need. Are you available for freelance work?',
          read: true
        },
        {
          name: 'Mike Chen',
          email: 'mike.chen@techcorp.com',
          message: 'Great portfolio! I love the animations and the overall design. Do you have experience with Next.js and TypeScript?',
          read: false
        }
      ],
      skipDuplicates: true
    })

    console.log('✅ Sample contact messages created')

    console.log('🎉 Database seeding completed successfully!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`- User info: 1 record`)
    console.log(`- Projects: ${projects.count} records`)
    console.log(`- Certificates: ${certificates.count} records`)
    console.log(`- Contacts: ${contacts.count} records`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedData()
