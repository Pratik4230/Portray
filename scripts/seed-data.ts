export const DEMO_PASSWORD = "Demo1234!"

export type SeedProject = {
  slug: string
  title: string
  description: string
  longDescription?: string
  techStack: string[]
  repoUrl?: string
  liveUrl?: string
  featured?: boolean
  order: number
}

export type SeedExperience = {
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string
  order: number
}

export type SeedContactMessage = {
  senderName: string
  senderEmail: string
  subject: string
  body: string
  read?: boolean
}

export type SeedUser = {
  username: string
  email: string
  name: string
  headline: string
  bio: string
  location: string
  skills: string[]
  socialLinks: {
    github?: string
    linkedin?: string
    website?: string
  }
  projects: SeedProject[]
  experience: SeedExperience[]
  messages?: SeedContactMessage[]
}

export const SEED_USERS: SeedUser[] = [
  {
    username: "jane",
    email: "jane@demo.portray.dev",
    name: "Jane Doe",
    headline: "Full-stack Developer",
    bio: "I build product-focused web apps with Next.js and MongoDB. Previously shipped dashboards and auth flows for early-stage startups.",
    location: "San Francisco, CA",
    skills: ["TypeScript", "Next.js", "MongoDB", "React", "Node.js"],
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://example.com",
    },
    projects: [
      {
        slug: "portray",
        title: "Portray",
        description: "Multi-user portfolio platform for developers and recruiters.",
        longDescription:
          "Built with Next.js App Router, Better Auth, Mongoose, and TanStack Query. Demonstrates SSR, SSG, ISR, REST APIs, and Server Actions.",
        techStack: ["Next.js", "MongoDB", "Better Auth", "TanStack Query"],
        repoUrl: "https://github.com",
        featured: true,
        order: 0,
      },
      {
        slug: "taskflow",
        title: "Taskflow",
        description: "Team task board with real-time updates and role-based access.",
        longDescription:
          "Collaborative kanban app with optimistic UI, websocket sync, and audit logs for distributed teams.",
        techStack: ["React", "PostgreSQL", "Redis", "WebSockets"],
        liveUrl: "https://example.com",
        order: 1,
      },
    ],
    experience: [
      {
        company: "Northwind Labs",
        role: "Senior Full-stack Engineer",
        startDate: "Jan 2022",
        endDate: null,
        description:
          "Led migration to Next.js App Router and introduced typed API layers for customer-facing dashboards.",
        order: 0,
      },
      {
        company: "Brightside",
        role: "Software Engineer",
        startDate: "Jun 2019",
        endDate: "Dec 2021",
        description:
          "Shipped onboarding flows and internal tools used by 50+ support agents daily.",
        order: 1,
      },
    ],
    messages: [
      {
        senderName: "Alex Rivera",
        senderEmail: "alex.recruiter@example.com",
        subject: "Full-stack role at Horizon",
        body: "Hi Jane, your Portray portfolio stood out. Would you be open to a quick chat about a senior full-stack role?",
        read: false,
      },
      {
        senderName: "Morgan Lee",
        senderEmail: "morgan@talent.co",
        subject: "Contract — Next.js product build",
        body: "We have a 3-month contract for a Next.js + MongoDB build. Are you available this quarter?",
        read: true,
      },
    ],
  },
  {
    username: "alex",
    email: "alex@demo.portray.dev",
    name: "Alex Chen",
    headline: "Backend Engineer",
    bio: "API design, data modeling, and reliable services. I enjoy turning messy domains into clear MongoDB schemas and REST contracts.",
    location: "Austin, TX",
    skills: ["Node.js", "MongoDB", "PostgreSQL", "Docker", "AWS"],
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
    projects: [
      {
        slug: "ledger-api",
        title: "Ledger API",
        description: "Double-entry accounting API with idempotent webhooks.",
        longDescription:
          "Event-sourced ledger service with Zod validation, structured errors, and OpenAPI docs for integrators.",
        techStack: ["Node.js", "MongoDB", "Zod", "OpenAPI"],
        repoUrl: "https://github.com",
        featured: true,
        order: 0,
      },
    ],
    experience: [
      {
        company: "Dataforge",
        role: "Backend Engineer",
        startDate: "Mar 2021",
        endDate: null,
        description:
          "Designed billing microservices and reduced p95 latency by 40% through query tuning and caching.",
        order: 0,
      },
    ],
  },
  {
    username: "sam",
    email: "sam@demo.portray.dev",
    name: "Sam Patel",
    headline: "Frontend Developer",
    bio: "UI engineer focused on accessible, performant interfaces with React and design systems.",
    location: "Remote",
    skills: ["React", "TypeScript", "Tailwind CSS", "Accessibility", "Figma"],
    socialLinks: {
      github: "https://github.com",
      website: "https://example.com",
    },
    projects: [
      {
        slug: "design-kit",
        title: "Design Kit",
        description: "Component library and tokens for marketing and dashboard UIs.",
        longDescription:
          "Documented shadcn-based primitives with Storybook, dark mode, and WCAG-focused patterns.",
        techStack: ["React", "Tailwind CSS", "Storybook"],
        liveUrl: "https://example.com",
        featured: true,
        order: 0,
      },
    ],
    experience: [
      {
        company: "Pixel & Co",
        role: "Frontend Developer",
        startDate: "Aug 2020",
        endDate: null,
        description:
          "Built design-system components adopted across four product squads.",
        order: 0,
      },
    ],
  },
]
