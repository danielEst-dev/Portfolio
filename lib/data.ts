export const personalInfo = {
  name: "Daniel Anthony S. Estrella",
  title: "Software Development · Backend Engineer",
  summary:
    "Magna Cum Laude BS Information Technology graduate and backend developer with professional experience building production-grade microservice architectures using ASP.NET Core (C#). Independently developed 130+ RESTful API endpoints across 7 microservice repositories within a live commercial product. Proficient in .NET Core, Node.js, Express.js, PostgreSQL, MariaDB, and Redis, with working knowledge of React and Next.js. Experienced in Agile/Scrum workflows, Git, and relational database schema design. Oracle Cloud 2025 Certified Developer Professional.",
  phone: "+63 962 827 1366",
  email: "daniel.anth.est.03@gmail.com",
  location: "Meycauayan City, Bulacan",
  linkedin: "https://linkedin.com/in/daniel-est",
  github: "https://github.com/danielEst-dev",
};

export const experiences = [
  {
    company: "Xentra Solutions, Inc.",
    role: "Junior Backend Developer",
    date: "September 2025 — Present",
    bullets: [
      "Led backend development for an upcoming product version, building over 130 RESTful API endpoints across the microservice ecosystem within 1.5 months.",
      "Manages 7 microservice Git repositories, overseeing branch strategy, code integration, version control practices, and interservice RESTful API communication patterns.",
      "Translates Figma designs into backend specifications and API contracts, deriving and confirming 130+ endpoint definitions and response shapes in coordination with client-side developers.",
      "Coordinates with 4 client-side developers (2 Next.js, 2 mobile) to align API response shapes and payload structures, and collaborates with 2 QA testers to investigate and resolve backend bugs.",
      "Designs and maintains dedicated relational database schemas per microservice, creating 10+ tables and modifying 7 existing ones to support new features aligned with client requirements.",
      "Participates in Agile ceremonies including daily standups, managing tasks across Scrum and Kanban workflows in JIRA for sprint planning and progress tracking.",
    ],
  },
  {
    company: "Xentra Solutions, Inc.",
    role: "Backend Developer Intern",
    date: "January 2025 — May 2025 · 500+ hours",
    bullets: [
      "Studied a production-grade microservice ecosystem firsthand, gaining practical understanding of interservice REST API communication and API consumption patterns across distributed services.",
      "Designed relational database schemas as part of structured training exercises, producing 5–10 tables with normalized relationships to model real-world business data.",
      "Built 10–20 practice CRUD endpoints using ASP.NET Core (C#), applying interservice API consumption patterns to simulate real microservice communication flows.",
      "Implemented Role-Based Access Control (RBAC) within a working codebase, configuring role definitions, permission scopes, and route-level authorization middleware.",
    ],
  },
  {
    company: "Centro Escolar University Malolos",
    role: "Data Entry Intern",
    date: "2025 · 50 Hours · Physical Plant & Facilities Department",
    bullets: [
      "Digitized manual pen-and-paper facility logs and records into structured Google Sheets spreadsheets, improving data accessibility and reducing retrieval time for department staff.",
      "Ensured accuracy and consistency of encoded data by cross-referencing physical records, applying data validation practices throughout the digitization process.",
      "Completed the required 50-hour institutional internship as part of the BS Information Technology curriculum, demonstrating reliability and attention to detail in a non-technical office environment.",
    ],
  },
];

export const projects = [
  {
    slug: "brewbank",
    kicker: "Key Project",
    name: "BrewBank",
    role: "Junior Backend Developer",
    date: "2025 — Present",
    link: "https://brewbank.app",
    shortDescription:
      "Contributed to the backend microservice architecture of BrewBank — a prepaid coffee loyalty platform for Australian cafés — focusing on core transaction and redemption API workflows using ASP.NET Core and MariaDB.",
    fullDescription: [
      "BrewBank is a prepaid coffee loyalty platform serving Australian cafés. As a junior backend developer at Xentra Solutions, I contribute to the backend microservice architecture that powers customer accounts, café transactions, and loyalty redemption workflows.",
      "My work focuses on building and maintaining RESTful API endpoints across multiple microservices, ensuring reliable interservice communication, and designing normalized MariaDB schemas that support high-volume transaction data.",
    ],
    tags: ["ASP.NET Core (C#)", "REST APIs", "Microservices", "MariaDB", "JIRA / Agile"],
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
      "Full-stack equipment reservation system digitizing a manual pen-and-paper lending facility. Designed and implemented both client-side and server-side components using an Express backend, HTML5/Bootstrap frontend, and a modular MVC-inspired architecture.",
    fullDescription: [
      "CEU Vault is a full-stack equipment reservation system built to digitize a manual pen-and-paper lending facility at Centro Escolar University Malolos.",
      "The application features an Express.js backend, an HTML5/Bootstrap frontend, and a modular MVC-inspired architecture. It integrates REST APIs, PostgreSQL, Redis Cloud, Neon DB, Nodemailer, and PDF generation to handle reservations, approvals, notifications, and reporting.",
    ],
    tags: ["HTML/CSS", "Bootstrap", "Express.js", "PostgreSQL", "Redis Cloud", "Neon DB", "Vercel"],
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
      "Solo-built full-stack hotel management system comprising a 15-endpoint RESTful API and a Bootstrap front-end dashboard, built on Node.js and Express with a modular MVC-inspired architecture.",
    fullDescription: [
      "A solo-built full-stack hotel management system with a 15-endpoint RESTful API and a Bootstrap front-end dashboard.",
      "Built on Node.js and Express with a modular MVC-inspired architecture, the system covers room, guest, and booking workflows. It uses Yup for request validation, a normalized 3-table PostgreSQL schema, and stores third-party weather data from Open-Meteo as JSONB. A node-cron scheduled job automates booking completion, and Jest unit tests with mocked database calls ensure reliability.",
    ],
    tags: ["Node.js", "Express.js", "PostgreSQL", "REST APIs", "Yup", "Jest", "node-cron", "HTML", "CSS"],
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
      "Studied LatinPay — a U.S.-based fintech platform serving the Latin American community with prepaid Visa cards, mobile top-up, and bill payments — as a live reference system during internship training.",
    fullDescription: [
      "LatinPay is a U.S.-based fintech platform serving the Latin American community with prepaid Visa cards, mobile top-up, and bill payments.",
      "During my internship at Xentra Solutions, I studied LatinPay as a live reference system to understand production-grade microservice architecture, interservice REST API communication, and Agile team operations.",
    ],
    tags: ["ASP.NET Core (C#)", "Microservices", "REST API Consumption", "MariaDB", "Agile / Daily Standups", "Fintech"],
    highlights: [
      "Studied production microservice architecture and interservice communication",
      "Observed daily standups and sprint workflows in a professional team",
      "Gained exposure to fintech domain concepts and compliance considerations",
    ],
  },
];

export const education = {
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

export const certifications = [
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

export const skills = {
  Languages: ["C#", "JavaScript", "TypeScript", "Python", "Java"],
  Backend: ["ASP.NET Core", ".NET Core", ".NET Framework", "Express.js", "NextJS"],
  Frontend: ["React", "NextJS", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"],
  Databases: ["PostgreSQL", "MySQL", "MariaDB", "MS SQL", "Neon DB", "Redis"],
  "Protocols & Patterns": ["RESTful APIs", "gRPC", "Microservices", "MVC", "Modular Monolith"],
  "Tools & Platforms": ["Git", "GitHub", "JIRA", "Figma", "Visual Studio", "VS Code", "JetBrains", "Claude Code", "GitHub Copilot", "Vercel"],
};

export const additionalSkills = {
  "Soft Skills": ["Problem Solving", "Analytical Thinking", "Communication", "Team Collaboration", "Time Management", "Adaptability"],
  "Microsoft Office": ["Word", "Excel", "PowerPoint", "Outlook", "Teams", "OneDrive"],
  "General & Productivity": ["Google Docs", "Google Sheets", "Google Slides", "Zoom", "Google Meet", "Typing (75+ WPM)"],
  "Photo & Video": ["Adobe Photoshop", "Adobe Firefly", "Gemini Nano", "Adobe Premiere Pro", "CapCut", "iMovie"],
  "Design & Media": ["Canva", "Social Media Management", "Photography (mobile)"],
  "Data Entry & Admin": ["Log digitization", "Google Sheets encoding", "Filing & records management", "Printing & scanning", "Email correspondence"],
  "IT & Technical Support": ["PC troubleshooting & formatting", "Hardware setup & maintenance", "NC2: Computer Systems Servicing"],
  "Research & Writing": ["Academic research", "Report writing", "Technical documentation", "Data analysis & summarization"],
  Languages: ["Filipino — Native", "English — Professional proficiency"],
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];
