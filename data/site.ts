import type { Domain, LinkItem, Project } from "@/types/content";

export const profile = {
  name: "Aniket Giriyalkar",
  role: "Software Engineer · Data Builder · App Developer",
  intro:
    "I build dependable software, data products, and interactive experiences. This portfolio connects the engineering decisions, experiments, and outcomes behind the work.",
  location: "United States",
  email: "giriyalkar.aniket@gmail.com",
  resumeUrl: "/resume/Aniket-Giriyalkar-Resume.pdf",
  note:
    "Career dates and selected profile details are being refreshed. Project links and technical descriptions below are verified from the source repositories.",
};

export const socialLinks: LinkItem[] = [
  {
    label: "GitHub",
    href: "https://github.com/aniketgiriyalkar",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/aniket-giriyalkar/",
    external: true,
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
  },
];

export const domains: Domain[] = [
  {
    key: "software-engineering",
    eyebrow: "01 / Systems",
    title: "Software Engineering",
    description:
      "Backend services, API design, distributed systems, databases, testing, and pragmatic full-stack delivery.",
    href: "/software-engineering/",
    accent: "#ff7043",
    skills: ["Python", "Java", "Node.js", "REST APIs", "PostgreSQL", "AWS"],
  },
  {
    key: "data",
    eyebrow: "02 / Intelligence",
    title: "Data Engineering & Science",
    description:
      "Data cleaning, analytical modeling, visualization, predictive systems, and decision-focused storytelling.",
    href: "/data-engineering-science/",
    accent: "#63e6be",
    skills: ["Python", "SQL", "Pandas", "R", "Tableau", "Machine Learning"],
  },
  {
    key: "app-development",
    eyebrow: "03 / Experiences",
    title: "App Development",
    description:
      "Responsive web and mobile applications designed around clear interactions, useful state, and resilient interfaces.",
    href: "/app-development/",
    accent: "#8c7cff",
    skills: ["React", "Next.js", "Vue", "Flutter", "JavaScript", "HTML Canvas"],
  },
];

export const projects: Project[] = [
  {
    title: "Emberbound — A Python Arcade Game Rebuilt for the Web",
    summary:
      "An original Canvas arcade experience evolved from a Pygame training project, with responsive controls, endless progression, multi-villain encounters, and local high-score persistence.",
    domains: ["software-engineering", "app-development"],
    year: "2026",
    technologies: ["Canvas", "JavaScript", "Web Audio", "localStorage"],
    accent: "#ff7043",
    featured: true,
    status: "Playable",
    links: [
      { label: "Play Game", href: "/games/emberbound/", external: true },
      {
        label: "Original Python Version",
        href: "https://github.com/aniketgiriyalkar/Arcade_Game-Internshala-Certified-Python-Training-",
        external: true,
      },
    ],
  },
  {
    title: "Football Lab — European Soccer Analytics",
    summary:
      "A multi-metric analytics product for comparing players, teams, matches, and manager tenures across Europe, with historical xG, discipline, game-state context, and explicit data coverage.",
    domains: ["data"],
    year: "2026",
    technologies: ["Next.js", "TypeScript", "Python", "Polars", "DuckDB", "Parquet"],
    accent: "#63e6be",
    featured: true,
    status: "Interactive",
    links: [
      {
        label: "Open Football Lab",
        href: "/football-lab/",
      },
      {
        label: "View Repository",
        href: "https://github.com/aniketgiriyalkar/Soccer-Analytics",
        external: true,
      },
    ],
  },
  {
    title: "Orders Microservice",
    summary:
      "An order-processing API with normalized PostgreSQL models, Sequelize migrations, Express routes, tests, logging, and Swagger documentation.",
    domains: ["software-engineering", "data"],
    year: "2020",
    technologies: ["Node.js", "Express", "PostgreSQL", "Sequelize", "Jest"],
    accent: "#ffb454",
    featured: true,
    links: [
      {
        label: "View Repository",
        href: "https://github.com/aniketgiriyalkar/Orders_Microservice",
        external: true,
      },
    ],
  },
  {
    title: "Appointment Booking",
    summary:
      "A component-driven Vue application for creating, editing, deleting, searching, and sorting appointment records.",
    domains: ["app-development"],
    year: "2020",
    technologies: ["Vue", "JavaScript", "Bootstrap", "Axios"],
    accent: "#8c7cff",
    links: [
      {
        label: "View Repository",
        href: "https://github.com/aniketgiriyalkar/Appointment-booking-management-system",
        external: true,
      },
    ],
  },
  {
    title: "Shopping Cart",
    summary:
      "A Vue storefront featuring product filtering, animated inventory, cart state, totals, and routed checkout workflows.",
    domains: ["app-development"],
    year: "2020",
    technologies: ["Vue", "Vue Router", "JavaScript", "Bootstrap"],
    accent: "#a68cff",
    links: [
      {
        label: "View Repository",
        href: "https://github.com/aniketgiriyalkar/ShoppingCart",
        external: true,
      },
    ],
  },
  {
    title: "Flutter Login",
    summary:
      "A mobile login and registration prototype connecting a Flutter client to a PHP and MySQL service.",
    domains: ["app-development"],
    year: "2020",
    technologies: ["Flutter", "Dart", "PHP", "MySQL"],
    accent: "#69c7ff",
    links: [
      {
        label: "View Repository",
        href: "https://github.com/aniketgiriyalkar/login_flutter",
        external: true,
      },
    ],
  },
  {
    title: "Traffic Alert System",
    summary:
      "A location-aware Android and web platform for reporting and sharing traffic conditions through a central server.",
    domains: ["software-engineering", "app-development"],
    year: "2016",
    technologies: ["Java", "Android", "PHP", "SQL"],
    accent: "#ff786d",
    links: [
      {
        label: "View Repository",
        href: "https://github.com/aniketgiriyalkar/Traffic-Alert-System-Using-VANET",
        external: true,
      },
    ],
  },
  {
    title: "ARP Spoof Detection",
    summary:
      "A Python and Scapy implementation of an ICMP-based ARP spoof detection method, including corrections to the referenced algorithm.",
    domains: ["software-engineering"],
    year: "2018",
    technologies: ["Python", "Scapy", "Wireshark", "Networking"],
    accent: "#ff9d66",
    links: [
      {
        label: "View Repository",
        href: "https://github.com/aniketgiriyalkar/ARP-Spoof-Detection-Algorithm-Using-ICMP-Protocol",
        external: true,
      },
    ],
  },
];

export const experience = [
  {
    period: "June 2019 — December 2019",
    organization: "Rochester Regional Health",
    role: "Software Engineering Co-op",
    summary:
      "Built reusable React and Redux components for a serverless workforce scheduling application and created analytical reports for hospital stakeholders.",
    technologies: "React, Redux, AWS Lambda, DynamoDB, Node.js, Python, R, Tableau",
  },
  {
    period: "October 2015 — March 2016",
    organization: "Bhabha Atomic Research Centre",
    role: "Project Trainee",
    summary:
      "Developed a location-based traffic information system combining an Android application with a central web service.",
    technologies: "Java, Android, HTML, CSS, PHP, JavaScript, SQL",
  },
];

export const education = [
  {
    school: "Rochester Institute of Technology",
    degree: "M.S. in Computer Science",
    focus: "Data Management and Analytics",
    status: "Dates to be refreshed",
  },
  {
    school: "University of Mumbai",
    degree: "B.E. in Information Technology",
    focus: "Software engineering, databases, distributed systems, and data mining",
    status: "Completed 2016",
  },
];

export const personalCards = [
  {
    index: "01",
    title: "The beautiful game",
    text:
      "Soccer appears throughout my work, from predictive analytics and player comparisons to the projects I choose to explore.",
    status: "Verified from project work",
  },
  {
    index: "02",
    title: "PlayStation",
    text:
      "Gaming is part of how I study feedback, difficulty, systems, and interaction. Add a PlayStation ID here when ready.",
    status: "Profile ID placeholder",
  },
  {
    index: "03",
    title: "Building in public",
    text:
      "I use GitHub to document what I learn across engineering, data, mobile, security, and interactive development.",
    status: "GitHub linked",
  },
  {
    index: "04",
    title: "Beyond work",
    text:
      "This space is reserved for the hobbies, communities, and passions that deserve more than a line in a résumé.",
    status: "Content placeholder",
  },
];
