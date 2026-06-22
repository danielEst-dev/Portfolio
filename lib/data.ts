export const personalInfo = {
  name: "Daniel Anthony S. Estrella",
  role: "Junior Backend Developer",
  title: "Software Development · Backend Engineer",
  shortBio:
    "Magna Cum Laude BS IT graduate. Built 130+ RESTful API endpoints across 7 microservices at Xentra Solutions, Inc. Core stack: ASP.NET Core (C#), Node.js, PostgreSQL, MariaDB, Redis.",
  summary:
    "Magna Cum Laude BS Information Technology graduate and backend developer with professional experience building production-grade microservice architectures using ASP.NET Core (C#). Independently developed 130+ RESTful API endpoints across 7 microservice repositories within a live commercial product. Proficient in .NET Core, Node.js, Express.js, PostgreSQL, MariaDB, and Redis, with working knowledge of React and Next.js. Experienced in Agile/Scrum workflows, Git, and relational database schema design. Oracle Cloud 2025 Certified Developer Professional.",
  phone: "+63 962 827 1366",
  email: "daniel.anth.est.03@gmail.com",
  location: "Philippines",
  linkedin: "https://linkedin.com/in/daniel-est",
  github: "https://github.com/danielEst-dev",
};

type Experience = {
  company: string;
  role: string;
  date: string;
  bullets: string[];
  /** True for low-signal entries rendered as a quiet single line instead of an expandable card. */
  muted?: boolean;
  /** Tech + team-context chips shown under the role, visible even when collapsed. */
  stack?: string[];
};

export const experiences: Experience[] = [
  {
    company: "Xentra Solutions, Inc.",
    role: "Junior Backend Developer",
    date: "September 2025 — Present",
    stack: ["ASP.NET Core", "MariaDB", "Microservices", "JIRA"],
    bullets: [
      "Led backend for an upcoming product version, shipping **130+ RESTful API endpoints** across the microservice ecosystem in 1.5 months.",
      "Own branch strategy, version control, and interservice API contracts across **7 microservice repositories**.",
      "Designed relational schemas per service — **10+ new tables, 7 modified** — translating Figma designs into API contracts with client-side developers.",
    ],
  },
  {
    company: "Xentra Solutions, Inc.",
    role: "Backend Developer Intern",
    date: "January 2025 — May 2025 · 500+ hours",
    stack: ["ASP.NET Core", "C#", "RBAC"],
    bullets: [
      "Implemented **Role-Based Access Control** in a production codebase — roles, permission scopes, and route-level authorization middleware.",
      "Built **10–20 CRUD endpoints** in ASP.NET Core modeling real interservice REST communication, with normalized schemas of 5–10 tables.",
    ],
  }
];

interface Project {
  slug: string;
  kicker: string;
  name: string;
  role: string;
  date: string;
  link?: string;
  shortDescription: string;
  fullDescription: string[];
  tags: string[];
  highlights: string[];
  adminLink?: string;
  repo?: string;
  credentials?: { user: string; pass: string };
  stats?: { endpoints: string; tables: string; year: string };
}

export const projects: Project[] = [
  {
    slug: "brewbank",
    kicker: "Key Project",
    name: "BrewBank",
    role: "Junior Backend Developer",
    date: "2025 — Present",
    link: "https://brewbank.app",
    shortDescription:
      "Microservices-based prepaid coffee loyalty platform for Australian cafés. Built RESTful transaction and redemption APIs across distributed services.",
    fullDescription: [
      "BrewBank is a prepaid coffee loyalty platform serving Australian cafés. As a junior backend developer at Xentra Solutions, I contribute to the backend microservice architecture that powers customer accounts, café transactions, and loyalty redemption workflows.",
      "My work focuses on building and maintaining RESTful API endpoints across multiple microservices, ensuring reliable interservice communication, and designing normalized MariaDB schemas that support high-volume transaction data.",
    ],
    tags: ["ASP.NET Core", "MariaDB", "Microservices"],
    highlights: [
      "Built and maintained RESTful API endpoints for transaction and redemption workflows",
      "Collaborated with frontend and mobile teams to align API contracts",
      "Designed normalized relational schemas per microservice",
      "Participated in Agile ceremonies and sprint planning via JIRA",
    ],
  },
  {
    slug: "ceu-vault",
    kicker: "Full Stack Developer",
    name: "CEU Vault",
    role: "Full Stack Developer",
    date: "Oct 2024 — Dec 2024",
    link: "https://ceu-vault.vercel.app",
    adminLink: "https://ceu-vault.vercel.app/admin",
    repo: "https://github.com/danielEst-dev/CEUVault-Redis",
    shortDescription:
      "Full-stack equipment reservation system digitizing a manual pen-and-paper lending facility. Express backend, Bootstrap frontend, PostgreSQL and Redis.",
    fullDescription: [
      "CEU Vault is a full-stack equipment reservation system built to digitize a manual pen-and-paper lending facility at Centro Escolar University Malolos.",
      "The application features an Express.js backend, an HTML5/Bootstrap frontend, and a modular MVC-inspired architecture. It integrates REST APIs, PostgreSQL, Redis Cloud, Neon DB, Nodemailer, and PDF generation to handle reservations, approvals, notifications, and reporting.",
    ],
    tags: ["Express.js", "PostgreSQL", "Bootstrap", "Redis"],
    highlights: [
      "Digitized manual lending workflows into a web-based reservation system",
      "Built RESTful APIs with Express.js and PostgreSQL",
      "Integrated Redis Cloud for session/caching needs",
      "Automated email notifications with Nodemailer",
      "Generated PDF reports for reservations and returns",
    ],
    credentials: {
      user: "admin@test.com",
      pass: "admin123",
    },
  },
  {
    slug: "hotel-booking",
    kicker: "Full Stack Developer",
    name: "Hotel Booking System",
    role: "Full Stack Developer",
    date: "2026",
    repo: "https://github.com/danielEst-dev/hotel_booking",
    shortDescription:
      "Solo-built full-stack hotel management system with a 15-endpoint REST API, Bootstrap dashboard, and automated cron jobs.",
    fullDescription: [
      "A solo-built full-stack hotel management system with a 15-endpoint RESTful API and a Bootstrap front-end dashboard.",
      "Built on Node.js and Express with a modular MVC-inspired architecture, the system covers room, guest, and booking workflows. It uses Yup for request validation, a normalized 3-table PostgreSQL schema, and stores third-party weather data from Open-Meteo as JSONB. A node-cron scheduled job automates booking completion, and Jest unit tests with mocked database calls ensure reliability.",
    ],
    tags: ["Node.js", "Express.js", "PostgreSQL", "Jest"],
    highlights: [
      "Built 15 RESTful API endpoints for room, guest, and booking workflows",
      "Designed a normalized 3-table PostgreSQL schema",
      "Implemented request validation with Yup",
      "Fetched and stored Open-Meteo weather data as JSONB",
      "Automated booking completion with node-cron",
      "Wrote Jest unit tests with mocked database calls",
    ],
    stats: {
      endpoints: "15 REST",
      tables: "3 schemas",
      year: "2026",
    },
  },
  {
    slug: "latinpay",
    kicker: "Internship Project",
    name: "LatinPay",
    role: "Backend Developer Intern",
    date: "2025",
    link: "https://latinpay.com/",
    shortDescription:
      "Internship reference project: a U.S.-based fintech platform for prepaid cards, mobile top-up, and bill payments.",
    fullDescription: [
      "LatinPay is a U.S.-based fintech platform serving the Latin American community with prepaid Visa cards, mobile top-up, and bill payments.",
      "During my internship at Xentra Solutions, I studied LatinPay as a live reference system to understand production-grade microservice architecture, interservice REST API communication, and Agile team operations.",
    ],
    tags: ["ASP.NET Core", "Microservices", "MariaDB"],
    highlights: [
      "Studied production microservice architecture and interservice communication",
      "Observed daily standups and sprint workflows in a professional team",
      "Gained exposure to fintech domain concepts and compliance considerations",
    ],
  },
];

interface Education {
  school: string;
  degree: string;
  year: string;
  honors: string;
  detail: string;
  awards: string[];
  shs: { school: string; strand: string; year: string };
}

export const education: Education = {
  school: "Centro Escolar University Malolos",
  degree: "Bachelor of Science in Information Technology",
  year: "2021 — 2025",
  honors: "Magna Cum Laude",
  detail: "Graduated with high distinction · GWA 1.25 · Top 8 Overall, Highest-Ranking Male Graduate",
  awards: [
    "Top 8 Overall Graduate",
    "Highest-Ranking Male Graduate",
    "Dean's List — 1st Year",
    "Consistent President's List — 2nd to 4th Year",
    "Research Forum: 1st in Oral Presentations",
    "Research Forum: 3rd in Poster Presentations",
    "Meritorious Award in Research",
  ],
  shs: {
    school: "St. Mary's College of Meycauayan",
    strand: "Senior High School · Accountancy, Business and Management (ABM) Strand",
    year: "2019 — 2021",
  },
};

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credential?: string;
}

export const certifications: Certification[] = [
  {
    name: "Oracle Cloud 2025 Certified Developer Professional",
    issuer: "Oracle University",
    date: "Oct 2025 — Oct 2027",
    credential:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=7C9D000F6E0EB1B436D1DBCB0F2232B182454039B3266E6A78DA85DCEF12CBB5",
  },
  {
    name: "Fortinet Certified Associate in Cybersecurity",
    issuer: "Fortinet Training Institute",
    date: "May 2025 — May 2027",
    credential: "https://training.fortinet.com/admin/tool/certificate/index.php?code=1301643014DA",
  },
  {
    name: "Fortinet Certified Fundamentals in Cybersecurity",
    issuer: "Fortinet",
    date: "May 2025 — May 2027",
    credential: "https://training.fortinet.com/admin/tool/certificate/index.php?code=3272474919DA",
  },
  {
    name: "Foundational C# with Microsoft",
    issuer: "freeCodeCamp / Microsoft",
    date: "Jun 2025",
    credential: "https://www.freecodecamp.org/certification/daniel_est_03/foundational-c-sharp-with-microsoft",
  },
  {
    name: "Oracle Cloud 2025 Certified AI Foundations Associate",
    issuer: "Oracle University",
    date: "Oct 2025 — Oct 2027",
    credential:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=813EDF5358C156BEB66A7E82B9918C06E8BCC2D3A837D789ED28949EE929689D",
  },
  {
    name: "NC2: Computer Systems Servicing",
    issuer: "TESDA",
    date: "Jul 2022 — Jul 2027",
  },
];


interface SkillSet {
  Backend: string[];
  Databases: string[];
  Frontend: string[];
  "DevOps & Tools": string[];
  Languages: string[];
  [key: string]: string[];
}

export const skills: SkillSet = {
  Backend: ["ASP.NET Core (C#)", ".NET Core", "Node.js", "Express.js", "REST APIs", "Microservices", "gRPC", "MVC"],
  Databases: ["PostgreSQL", "MariaDB", "MySQL", "MS SQL", "Redis"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"],
  "DevOps & Tools": ["Git", "GitHub", "JIRA", "Figma", "Visual Studio", "VS Code", "Vercel"],
  Languages: ["C#", "JavaScript", "TypeScript", "Python", "Java"],
};

export const skillBeltItems = [
  "ASP.NET Core",
  "C#",
  ".NET Core",
  "Node.js",
  "Express.js",
  "REST APIs",
  "Microservices",
  "gRPC",
  "MVC",
  "PostgreSQL",
  "MariaDB",
  "MySQL",
  "MS SQL",
  "Redis",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Bootstrap",
  "HTML5",
  "CSS3",
  "Git",
  "GitHub",
  "JIRA",
  "Figma",
  "Visual Studio",
  "VS Code",
  "Vercel",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
];


export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];
