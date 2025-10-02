const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const popularSkills = [
  // Frontend Technologies
  {
    name: 'React',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    category: 'Frontend'
  },
  {
    name: 'Vue.js',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    category: 'Frontend'
  },
  {
    name: 'Angular',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    category: 'Frontend'
  },
  {
    name: 'JavaScript',
    logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#F7DF1E" d="M0 0h256v256H0z"/><path d="M67 213l20-12c3 6 6 11 13 11 7 0 12-3 12-15V116h24v81c0 25-15 36-36 36-19 0-30-10-33-20m80-2l20-11c5 8 10 14 20 14 8 0 13-4 13-10 0-7-5-9-15-14l-5-2c-15-6-26-14-26-31 0-15 11-27 28-27 12 0 21 4 27 16l-19 12c-4-8-8-11-14-11-6 0-10 4-10 11 0 7 4 9 14 14l5 2c17 7 28 15 28 33 0 19-15 29-35 29-19 0-31-9-37-22"/></svg>',
    category: 'Frontend'
  },
  {
    name: 'TypeScript',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    category: 'Frontend'
  },
  {
    name: 'HTML5',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    category: 'Frontend'
  },
  {
    name: 'CSS3',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    category: 'Frontend'
  },
  {
    name: 'Tailwind CSS',
    logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill="#06B6D4" fill-rule="evenodd" d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.5 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.5 12 7 12z" clip-rule="evenodd"/></svg>',
    category: 'Frontend'
  },
  {
    name: 'Bootstrap',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
    category: 'Frontend'
  },
  {
    name: 'Sass',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
    category: 'Frontend'
  },

  // Backend Technologies
  {
    name: 'Node.js',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    category: 'Backend'
  },
  {
    name: 'Express.js',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    category: 'Backend'
  },
  {
    name: 'Python',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    category: 'Backend'
  },
  {
    name: 'Django',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
    category: 'Backend'
  },
  {
    name: 'Flask',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
    category: 'Backend'
  },
  {
    name: 'Java',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    category: 'Backend'
  },
  {
    name: 'Spring Boot',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
    category: 'Backend'
  },
  {
    name: 'C#',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
    category: 'Backend'
  },
  {
    name: '.NET',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',
    category: 'Backend'
  },
  {
    name: 'PHP',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
    category: 'Backend'
  },
  {
    name: 'Laravel',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
    category: 'Backend'
  },
  {
    name: 'Ruby',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
    category: 'Backend'
  },
  {
    name: 'Ruby on Rails',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg',
    category: 'Backend'
  },
  {
    name: 'Go',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
    category: 'Backend'
  },
  {
    name: 'Rust',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg',
    category: 'Backend'
  },

  // Databases
  {
    name: 'MySQL',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
    category: 'Database'
  },
  {
    name: 'PostgreSQL',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    category: 'Database'
  },
  {
    name: 'MongoDB',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    category: 'Database'
  },
  {
    name: 'Redis',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
    category: 'Database'
  },
  {
    name: 'SQLite',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
    category: 'Database'
  },
  {
    name: 'Firebase',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
    category: 'Database'
  },
  {
    name: 'Supabase',
    logoUrl: 'https://supabase.com/brand-assets/supabase-logo-icon.png',
    category: 'Database'
  },

  // DevOps & Cloud
  {
    name: 'Docker',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    category: 'DevOps'
  },
  {
    name: 'Kubernetes',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    category: 'DevOps'
  },
  {
    name: 'AWS',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
    category: 'Cloud'
  },
  {
    name: 'Google Cloud',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
    category: 'Cloud'
  },
  {
    name: 'Microsoft Azure',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
    category: 'Cloud'
  },
  {
    name: 'Vercel',
    logoUrl: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png',
    category: 'Cloud'
  },
  {
    name: 'Netlify',
    logoUrl: 'https://www.netlify.com/v3/img/components/logomark.png',
    category: 'Cloud'
  },
  {
    name: 'Heroku',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg',
    category: 'Cloud'
  },

  // Tools & Others
  {
    name: 'Git',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    category: 'Tools'
  },
  {
    name: 'GitHub',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
    category: 'Tools'
  },
  {
    name: 'GitLab',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
    category: 'Tools'
  },
  {
    name: 'VS Code',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
    category: 'Tools'
  },
  {
    name: 'Figma',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    category: 'Design'
  },
  {
    name: 'Adobe XD',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg',
    category: 'Design'
  },
  {
    name: 'Photoshop',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
    category: 'Design'
  },
  {
    name: 'Webpack',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg',
    category: 'Tools'
  },
  {
    name: 'Vite',
    logoUrl: 'https://vitejs.dev/logo.svg',
    category: 'Tools'
  },
  {
    name: 'Jest',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
    category: 'Testing'
  },
  {
    name: 'Cypress',
    logoUrl: 'https://asset.brandfetch.io/idIq_kF0rb/idv3zwmSiY.jpeg',
    category: 'Testing'
  },
  {
    name: 'Prisma',
    logoUrl: 'https://www.prisma.io/images/favicon-32x32.png',
    category: 'Database'
  },
  {
    name: 'GraphQL',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
    category: 'Backend'
  },
  {
    name: 'Next.js',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    category: 'Frontend'
  },
  {
    name: 'Nuxt.js',
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg',
    category: 'Frontend'
  }
];

async function seedSkills() {
  try {
    console.log('🌱 Starting skills seeding...');

    // Clear existing skills
    await prisma.userSkill.deleteMany({});
    await prisma.skill.deleteMany({});

    // Create skills
    for (const skill of popularSkills) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          category: skill.category,
          logoUrl: skill.logoUrl || null,
          logoSvg: skill.logoSvg || null
        }
      });
      console.log(`✅ Created skill: ${skill.name}`);
    }

    console.log(`🎉 Successfully seeded ${popularSkills.length} skills!`);
  } catch (error) {
    console.error('❌ Error seeding skills:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedSkills()
    .then(() => {
      console.log('✨ Skills seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Skills seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSkills, popularSkills };
