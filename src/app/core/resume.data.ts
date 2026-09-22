import type { Experience, NavLink, Project, SkillGroup, Stat } from './types';

export const PROFILE = {
  name: 'Timosh R R',
  first: 'Timosh',
  last: 'R R',
  role: 'Full Stack Developer',
  tagline: 'I build end-to-end products — from the schema up to the last pixel.',
  location: 'Madurai, Tamil Nadu, India',
  email: 'timoshr.work@gmail.com',
  phone: '+91 75400 43603',
  linkedin: 'https://linkedin.com/in/timosh-r-r',
  github: 'https://github.com/T-i-m-o-s-h',
  available: 'Open to Full Stack & Frontend roles',
} as const;

export const ABOUT_PARAGRAPHS: readonly string[] = [
  `I'm a full stack developer with a B.Tech in Artificial Intelligence and Machine Learning, currently building HR and payroll systems at Justo Global. I like the parts of the job most people route around — auth, roles and permissions, the migration that has to run cleanly the first time.`,
  `My path through this has been unusually wide for four years: shipping Laravel automation for Nike's service tracking in Jordan, a multi-role college portal in Kenya, Django projects at EY, and React Native apps serving 500+ test users. Different stacks, different continents, same instinct — find the manual step someone is repeating and delete it.`,
  `Most recently I picked up Angular and .NET from scratch to deliver a client portal solo, end to end. That's the pattern I trust: learn the stack the problem actually needs, then ship it.`,
];

export const STATS: readonly Stat[] = [
  { value: 6, suffix: '', label: 'Engineering roles' },
  { value: 4, suffix: '', label: 'Countries worked with' },
  { value: 500, suffix: '+', label: 'Users served' },
  { value: 40, suffix: '%', label: 'Faster deployments' },
];

export const NAV_LINKS: readonly NavLink[] = [
  { id: 'hero', label: 'Home', index: '00' },
  { id: 'about', label: 'About', index: '01' },
  { id: 'experience', label: 'Experience', index: '02' },
  { id: 'skills', label: 'Skills', index: '03' },
  { id: 'projects', label: 'Projects', index: '04' },
  { id: 'contact', label: 'Contact', index: '05' },
];

export const EXPERIENCE: readonly Experience[] = [
  {
    role: 'Full Stack Developer',
    company: 'Justo Global',
    location: 'India',
    period: 'Jul 2025 — Present',
    start: '2025',
    current: true,
    highlights: [
      'Took a client HR and payroll portal from empty repo to delivery single-handedly, including authentication, role hierarchies and granular permissions.',
      'Learned Angular and .NET on the job to do it, extending past the React/Node stack I had been working in.',
    ],
    stack: ['Angular', '.NET', 'SQL Server', 'RBAC'],
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'Justo Global',
    location: 'India',
    period: 'Jan 2025 — Jun 2025',
    start: '2025',
    highlights: [
      'Cut deployment time for the FMPB web app by 40% by automating tests and tightening the CI/CD pipeline.',
      'Built and shipped 3+ cross-platform apps with React and React Native, reaching 500+ test users.',
      'Worked with backend and QA to reduce integration bugs by 40% through stricter API contracts.',
    ],
    stack: ['React', 'React Native', 'Node.js', 'CI/CD'],
  },
  {
    role: 'Software Developer Intern',
    company: 'MAS Apparel',
    location: 'Jordan',
    period: 'Jul 2024 — Sep 2024',
    start: '2024',
    highlights: [
      "Automated Nike's service tracking system in PHP and Laravel, removing 70% of the manual work.",
      'Wired real-time status updates into reporting dashboards, improving accuracy by 25%.',
    ],
    stack: ['PHP', 'Laravel', 'MySQL'],
  },
  {
    role: 'Software Developer',
    company: 'Dedan Kimathi University',
    location: 'Kenya',
    period: 'May 2024 — Jul 2024',
    start: '2024',
    highlights: [
      'Built a college portal with distinct student, faculty and HoD roles, opening access to 100+ users.',
      'Halved form processing time by reworking the backend workflows in Python.',
    ],
    stack: ['Python', 'Django', 'PostgreSQL'],
  },
  {
    role: 'Full Stack Developer',
    company: 'Ernst & Young Global Ltd.',
    location: 'India',
    period: 'Jan 2024 — Mar 2024',
    start: '2024',
    highlights: [
      'Delivered 2 full-stack academic platforms for university clients using Django and PostgreSQL.',
      'Pulled 15% off delivery time through modular reuse and tighter agile cycles.',
    ],
    stack: ['Django', 'PostgreSQL', 'HTML/CSS'],
  },
  {
    role: 'Programming Intern',
    company: 'CISCO Networking Academy',
    location: 'India',
    period: 'Apr 2022 — Jun 2022',
    start: '2022',
    highlights: [
      'Wrote a Python IP address validator that cut network configuration errors by 60%.',
      'Presented the implementation at the final showcase; recognised for clarity and modularity.',
    ],
    stack: ['Python', 'Networking'],
  },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    label: 'Frontend',
    hint: 'Interfaces people actually use',
    items: ['Angular', 'React.js', 'React Native', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
  },
  {
    label: 'Backend',
    hint: 'The half nobody sees',
    items: ['Python', 'Django', 'Flask', 'Node.js', 'Express.js', '.NET', 'PHP / Laravel'],
  },
  {
    label: 'Data',
    hint: 'Where the truth lives',
    items: ['PostgreSQL', 'MySQL', 'SQLite', 'Pandas', 'NumPy'],
  },
  {
    label: 'Platform',
    hint: 'Getting it out the door',
    items: ['Git', 'Docker', 'Kubernetes', 'REST APIs', 'CI/CD', 'MVC'],
  },
];

export const MARQUEE_SKILLS: readonly string[] = [
  'Angular', 'React', 'React Native', 'TypeScript', 'Python', 'Django',
  'Node.js', 'Express', '.NET', 'Laravel', 'PostgreSQL', 'MySQL',
  'Docker', 'Kubernetes', 'REST APIs', 'Git', 'Flask', 'Pandas',
];

export const PROJECTS: readonly Project[] = [
  {
    name: 'Pneumonia Detector',
    kind: 'Machine Learning',
    blurb:
      'A convolutional neural network that reads chest X-rays and flags pneumonia, trained end-to-end on labelled radiographs.',
    stack: ['Python', 'TensorFlow', 'CNN'],
    accent: '#7c5cff',
  },
  {
    name: 'Movie Recommendation System',
    kind: 'Machine Learning',
    blurb:
      'Collaborative filtering over user rating history to surface films someone would plausibly pick themselves.',
    stack: ['Python', 'Pandas', 'NumPy'],
    accent: '#00d9c0',
  },
  {
    name: 'Hotel Reservation System',
    kind: 'Systems',
    blurb:
      'A booking engine with live availability, date-range conflict handling and a clean reservation lifecycle.',
    stack: ['Python', 'SQLite'],
    accent: '#ff7847',
  },
  {
    name: 'Webcam Motion Detector',
    kind: 'Computer Vision',
    blurb:
      'Frame-differencing on a live webcam feed that detects movement and emails a snapshot the moment it happens.',
    stack: ['Python', 'OpenCV', 'SMTP'],
    accent: '#3fa9ff',
  },
];

export const EDUCATION = [
  {
    degree: 'B.Tech, Artificial Intelligence and Machine Learning',
    place: 'Karunya Institute of Technology and Sciences, Coimbatore',
    period: '2021 — 2025',
  },
  {
    degree: 'Higher Secondary Education',
    place: 'S.B.O.A. Matriculation Hr. Sec. School, Madurai',
    period: '2009 — 2021',
  },
] as const;

export const CERTIFICATIONS: readonly string[] = [
  'Google IT Automation with Python',
  'Machine Learning — Coursera',
  'Pandas, Data Cleaning & Visualization',
  'NPTEL Technical English for Engineers',
];

export const LANGUAGES = [
  { name: 'English', level: 'Fluent', strength: 95 },
  { name: 'Tamil', level: 'Native', strength: 100 },
  { name: 'French', level: 'Intermediate', strength: 60 },
  { name: 'Malayalam', level: 'Conversational', strength: 45 },
] as const;
