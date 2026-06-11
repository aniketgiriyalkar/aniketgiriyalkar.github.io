export type DomainKey =
  | "software-engineering"
  | "data"
  | "app-development";

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type Project = {
  title: string;
  summary: string;
  domains: DomainKey[];
  year: string;
  technologies: string[];
  accent: string;
  featured?: boolean;
  status?: string;
  links: LinkItem[];
};

export type Domain = {
  key: DomainKey;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  skills: string[];
};
