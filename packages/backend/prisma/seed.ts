import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ===== CREATE ROLES =====
  console.log('Creating roles...');
  
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
      permissions: ['*'] // All permissions
    }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user with limited access',
      permissions: ['read:own', 'write:own', 'delete:own']
    }
  });

  const moderatorRole = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: {
      name: 'moderator',
      description: 'Moderator with review access',
      permissions: ['read:all', 'write:review', 'delete:review']
    }
  });

  console.log('✅ Roles created:', { adminRole, userRole, moderatorRole });

  // ===== CREATE USERS =====
  console.log('Creating users...');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bypass-tool.com' },
    update: {},
    create: {
      email: 'admin@bypass-tool.com',
      name: 'System Administrator',
      roleId: adminRole.id,
      status: 'active'
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@bypass-tool.com' },
    update: {},
    create: {
      email: 'demo@bypass-tool.com',
      name: 'Demo User',
      roleId: userRole.id,
      status: 'active'
    }
  });

  console.log('✅ Users created:', { adminUser, demoUser });

  // ===== CREATE PROJECTS =====
  console.log('Creating projects...');
  
  const seoProject = await prisma.project.upsert({
    where: { domain: 'example.com' },
    update: {},
    create: {
      name: 'SEO Example Project',
      domain: 'example.com',
      description: 'Example project for SEO testing',
      status: 'active',
      createdBy: adminUser.id
    }
  });

  const blogProject = await prisma.project.upsert({
    where: { domain: 'blog.example.com' },
    update: {},
    create: {
      name: 'Blog Project',
      domain: 'blog.example.com',
      description: 'Blog project for content testing',
      status: 'active',
      createdBy: demoUser.id
    }
  });

  console.log('✅ Projects created:', { seoProject, blogProject });

  // ===== CREATE KEYWORDS =====
  console.log('Creating keywords...');
  
  const keywords = await Promise.all([
    prisma.keyword.create({
      data: {
        text: 'SEO tools',
        projectId: seoProject.id,
        status: 'checked',
        position: 5,
        resultLink: 'https://example.com/seo-tools',
        lastChecked: new Date()
      }
    }),
    prisma.keyword.create({
      data: {
        text: 'keyword research',
        projectId: seoProject.id,
        status: 'checked',
        position: 12,
        resultLink: 'https://example.com/keyword-research',
        lastChecked: new Date()
      }
    }),
    prisma.keyword.create({
      data: {
        text: 'content optimization',
        projectId: blogProject.id,
        status: 'pending'
      }
    })
  ]);

  console.log('✅ Keywords created:', keywords.length);

  // ===== CREATE KEYWORD RANKS =====
  console.log('Creating keyword ranks...');
  
  const keywordRanks = await Promise.all([
    prisma.keywordRank.create({
      data: {
        position: 5,
        url: 'https://example.com/seo-tools',
        title: 'Best SEO Tools for 2024',
        snippet: 'Comprehensive guide to the best SEO tools...',
        keywordId: keywords[0].id,
        checkedAt: new Date()
      }
    }),
    prisma.keywordRank.create({
      data: {
        position: 12,
        url: 'https://example.com/keyword-research',
        title: 'Keyword Research Guide',
        snippet: 'Learn how to research keywords effectively...',
        keywordId: keywords[1].id,
        checkedAt: new Date()
      }
    })
  ]);

  console.log('✅ Keyword ranks created:', keywordRanks.length);

  // ===== CREATE LINK POSITIONS =====
  console.log('Creating link positions...');
  
  const linkPositions = await Promise.all([
    prisma.linkPosition.create({
      data: {
        projectId: seoProject.id,
        keyword: 'SEO tools',
        domain: 'example.com',
        position: 5,
        resultLink: 'https://example.com/seo-tools',
        contentArea: '//div[@class="content"]',
        isHidden: false,
        status: 'checked',
        checkedAt: new Date()
      }
    }),
    prisma.linkPosition.create({
      data: {
        projectId: seoProject.id,
        keyword: 'keyword research',
        domain: 'example.com',
        position: 12,
        resultLink: 'https://example.com/keyword-research',
        contentArea: '//div[@class="content"]',
        isHidden: true,
        hiddenMethod: 'display: none',
        status: 'checked',
        checkedAt: new Date()
      }
    })
  ]);

  console.log('✅ Link positions created:', linkPositions.length);

  // ===== CREATE SCHEMAS =====
  console.log('Creating schemas...');
  
  const schemas = await Promise.all([
    prisma.schema.create({
      data: {
        name: 'Article Schema',
        description: 'Schema markup for articles',
        formFields: [
          { name: 'title', type: 'text', required: true },
          { name: 'author', type: 'text', required: true },
          { name: 'datePublished', type: 'date', required: true },
          { name: 'description', type: 'textarea', required: false }
        ],
        isPublic: true,
        isTemplate: true,
        version: '1.0.0',
        createdBy: adminUser.id,
        projectId: seoProject.id
      }
    }),
    prisma.schema.create({
      data: {
        name: 'Product Schema',
        description: 'Schema markup for products',
        formFields: [
          { name: 'name', type: 'text', required: true },
          { name: 'price', type: 'number', required: true },
          { name: 'description', type: 'textarea', required: false },
          { name: 'image', type: 'url', required: false }
        ],
        isPublic: false,
        isTemplate: true,
        version: '1.0.0',
        createdBy: demoUser.id,
        projectId: blogProject.id
      }
    })
  ]);

  console.log('✅ Schemas created:', schemas.length);

  // ===== CREATE SCHEMA ACCESS CONTROLS =====
  console.log('Creating schema access controls...');
  
  const accessControls = await Promise.all([
    prisma.schemaAccessControl.create({
      data: {
        schemaId: schemas[0].id,
        roleId: userRole.id,
        canRead: true,
        canWrite: false,
        canDelete: false
      }
    }),
    prisma.schemaAccessControl.create({
      data: {
        schemaId: schemas[1].id,
        roleId: userRole.id,
        canRead: true,
        canWrite: true,
        canDelete: false
      }
    })
  ]);

  console.log('✅ Schema access controls created:', accessControls.length);

  // ===== CREATE TAGS =====
  console.log('Creating tags...');
  
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        name: 'Google Analytics',
        domain: 'example.com',
        description: 'Google Analytics tracking code',
        code: '<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>',
        placement: 'head',
        status: 'active',
        createdBy: adminUser.id,
        projectId: seoProject.id
      }
    }),
    prisma.tag.create({
      data: {
        name: 'Facebook Pixel',
        domain: 'blog.example.com',
        description: 'Facebook Pixel tracking code',
        code: '<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,"script","https://connect.facebook.net/en_US/fbevents.js");</script>',
        placement: 'head',
        status: 'active',
        createdBy: demoUser.id,
        projectId: blogProject.id
      }
    })
  ]);

  console.log('✅ Tags created:', tags.length);

  // ===== CREATE XML IMPORTS =====
  console.log('Creating XML imports...');
  
  const xmlImports = await Promise.all([
    prisma.xmlImport.create({
      data: {
        url: 'https://example.com/sitemap.xml',
        xpath: '//url/loc',
        result: 'https://example.com/page1,https://example.com/page2',
        status: 'success',
        createdBy: adminUser.id,
        projectId: seoProject.id
      }
    }),
    prisma.xmlImport.create({
      data: {
        url: 'https://blog.example.com/feed.xml',
        xpath: '//item/title',
        result: 'Blog Post 1,Blog Post 2,Blog Post 3',
        status: 'success',
        createdBy: demoUser.id,
        projectId: blogProject.id
      }
    })
  ]);

  console.log('✅ XML imports created:', xmlImports.length);

  // ===== CREATE KEYWORD ANALYSIS =====
  console.log('Creating keyword analysis...');
  
  const keywordAnalysis = await Promise.all([
    prisma.keywordAnalysis.create({
      data: {
        projectId: seoProject.id,
        keyword1: 'SEO tools',
        keyword2: 'SEO software',
        similarityScore: 0.85,
        commonResults: ['https://example.com/seo-tools', 'https://example.com/seo-software'],
        isDuplicate: true,
        analyzedAt: new Date()
      }
    }),
    prisma.keywordAnalysis.create({
      data: {
        projectId: seoProject.id,
        keyword1: 'keyword research',
        keyword2: 'content optimization',
        similarityScore: 0.25,
        commonResults: [],
        isDuplicate: false,
        analyzedAt: new Date()
      }
    })
  ]);

  console.log('✅ Keyword analysis created:', keywordAnalysis.length);

  // ===== CREATE SYSTEM CONFIGS =====
  console.log('Creating system configs...');
  
  const systemConfigs = await Promise.all([
    prisma.systemConfig.create({
      data: {
        key: 'app_name',
        value: 'Bypass Tool Pro',
        type: 'string',
        description: 'Application name'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'max_keywords_per_project',
        value: '1000',
        type: 'number',
        description: 'Maximum keywords per project'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'enable_audit_logging',
        value: 'true',
        type: 'boolean',
        description: 'Enable audit logging'
      }
    })
  ]);

  console.log('✅ System configs created:', systemConfigs.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Created: ${keywords.length} keywords, ${schemas.length} schemas, ${tags.length} tags`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
