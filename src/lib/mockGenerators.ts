export function getContextualActors(dependencyLabel: string, count: number = 2) {
  const label = dependencyLabel.toLowerCase();
  
  const profiles = {
    design: [
      { name: 'Mia Wong', role: 'UI/UX Visual Designer', avatar: 'Mia', rating: 4.9, cost: '$85/hr', isBot: false, proposal: 'I will create a comprehensive design system in Figma, including responsive mockups and interactive prototypes tailored to your brand identity.' },
      { name: 'Studio X', role: 'Creative Agency', avatar: 'Studio', rating: 4.8, cost: '$120/hr', isBot: false, proposal: 'Our team will deliver a premium, market-tested visual direction complete with asset libraries and brand guidelines within 48 hours.' },
      { name: 'AutoLayout Bot', role: 'AI Generation Agent', avatar: 'Layout', rating: 4.7, cost: '$0.02/op', isBot: true, proposal: 'Automated generation of 50+ UI permutations based on current design trends. Output provided via React components and Tailwind utility classes.' },
      { name: 'Alex Rivera', role: 'Brand Identity Expert', avatar: 'Alex', rating: 4.95, cost: '$90/hr', isBot: false, proposal: 'I focus on typography and color psychology. I will craft a distinctive visual language that communicates trust and modern aesthetics.' }
    ],
    code: [
      { name: 'Sarah Jenkins', role: 'Senior System Architect', avatar: 'Sarah', rating: 4.9, cost: '$120/hr', isBot: false, proposal: 'I will design a scalable, fault-tolerant microservices architecture and implement the core execution engine with 99% test coverage.' },
      { name: 'Nexus Logic Bot', role: 'Automated Pipeline AI', avatar: 'Nexus', rating: 4.99, cost: '$0.05/op', isBot: true, proposal: 'Executing automated dependency resolution and compiling standardized boilerplate. Guaranteed zero syntax errors and optimal CI/CD integration.' },
      { name: 'David Chen', role: 'Full-stack Engineer', avatar: 'David', rating: 4.7, cost: '$95/hr', isBot: false, proposal: 'I will bridge the frontend UI with the backend API, ensuring seamless state management, fast re-renders, and secure data handling.' },
      { name: 'Elena Rodriguez', role: 'QA & Testing Expert', avatar: 'Elena', rating: 4.8, cost: '$105/hr', isBot: false, proposal: 'I will write rigorous end-to-end Cypress tests, set up Jest for unit testing, and perform manual edge-case verification to ensure absolute stability.' }
    ],
    db: [
      { name: 'Postgres Automator', role: 'DB Provisioning Agent', avatar: 'DB', rating: 5.0, cost: '$0.01/op', isBot: true, proposal: 'Instant provisioning of a scalable PostgreSQL cluster. Includes automated read-replicas, daily backups, and connection pooling.' },
      { name: 'Dr. Alan Turing (Clone)', role: 'Data Architect', avatar: 'Alan', rating: 4.9, cost: '$150/hr', isBot: false, proposal: 'I will design a normalized relational schema optimized for complex joins, ensuring data integrity and query speeds under 50ms.' },
      { name: 'SchemaSync AI', role: 'Migration Bot', avatar: 'Sync', rating: 4.85, cost: '$0.03/op', isBot: true, proposal: 'I will safely generate and apply non-destructive schema migrations based on your ORM definitions without downtime.' }
    ],
    marketing: [
      { name: 'Growth Hacker Pro', role: 'Marketing Strategy', avatar: 'Growth', rating: 4.8, cost: '$100/hr', isBot: false, proposal: 'I will identify key user acquisition channels, set up A/B testing for landing pages, and establish a viral loop architecture.' },
      { name: 'CopyGen AI', role: 'SEO Content Generator', avatar: 'Copy', rating: 4.6, cost: '$0.01/word', isBot: true, proposal: 'I will generate 10,000 words of SEO-optimized, highly engaging copy tailored to your target demographic.' }
    ]
  };

  let category = 'code';
  if (label.includes('design') || label.includes('ui') || label.includes('logo') || label.includes('brand') || label.includes('visual')) category = 'design';
  else if (label.includes('db') || label.includes('database') || label.includes('schema') || label.includes('data') || label.includes('storage')) category = 'db';
  else if (label.includes('market') || label.includes('seo') || label.includes('content') || label.includes('copy')) category = 'marketing';

  const pool = profiles[category as keyof typeof profiles];
  
  // Shuffle pool to get random actors
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, count).map(p => ({
    label: p.name,
    data: {
      role: p.role,
      rating: p.rating,
      cost: p.cost,
      proposal: p.proposal,
      successRate: (p.rating / 5 * 100).toFixed(1) + '%',
      avatar: p.isBot 
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${p.avatar}` 
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.avatar}`,
      proofOfReality: {
        totalResolutions: Math.floor(Math.random() * 200) + 15,
        gravityScore: (Math.random() * 1000 + 500).toFixed(0),
        reliabilityIndex: (p.rating / 5 * 100).toFixed(1) + '%',
        recentHashes: [
          '0x' + Math.random().toString(16).slice(2, 10).toUpperCase(),
          '0x' + Math.random().toString(16).slice(2, 10).toUpperCase()
        ]
      }
    }
  }));
}

export function getContextualEvidence(actorRole: string) {
    const role = actorRole.toLowerCase();
    const hash = '0x' + Math.random().toString(16).slice(2, 10).toUpperCase();
    
    if (role.includes('design') || role.includes('creative') || role.includes('visual')) {
        return { 
          label: 'final_mockups_v1.fig', 
          fileType: 'Figma Document', 
          size: (Math.random() * 20 + 2).toFixed(1) + ' MB',
          summary: 'Exported all vector assets, completed auto-layout for responsive breakpoints, and verified WCAG AA color contrast ratios.',
          hash
        };
    }
    if (role.includes('db') || role.includes('data') || role.includes('schema')) {
        return { 
          label: 'schema_migration_001.sql', 
          fileType: 'SQL Script', 
          size: (Math.random() * 100 + 10).toFixed(0) + ' KB',
          summary: 'Successfully executed DDL operations. Indexes built on foreign keys. Verified zero data loss during staging dry-run.',
          hash
        };
    }
    if (role.includes('marketing') || role.includes('content') || role.includes('copy')) {
        return { 
          label: 'campaign_copy_final.docx', 
          fileType: 'Word Document', 
          size: '1.2 MB',
          summary: 'Drafted primary and secondary copy. Ran through plagiarism checks and SEO keyword density analyzers. Ready for publication.',
          hash
        };
    }
    
    return { 
      label: 'core_module_build.zip', 
      fileType: 'Source Code Archive', 
      size: (Math.random() * 5 + 1).toFixed(1) + ' MB',
      summary: 'Compiled TypeScript successfully. Unit tests passed (104/104). Linting complete. Ready for production deployment.',
      hash
    };
}
