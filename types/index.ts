export interface Department {
  id: string;
  label: string;
}

export interface Member {
  id: string; // Auth UUID
  name: string;
  role: string;
  department: string;
  email: string;
  github?: string;
  member_code?: string;
  is_admin: boolean;
  created_at?: string;
}

export interface Task {
  id: string;
  title: string;
  assignee_id: string | null;
  status: 'open' | 'doing' | 'done';
  progress: number;
  due_date: string | null;
  created_at?: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  icon: string;
  cat: string;
  pinned?: boolean;
  desc?: string;
  url: string;
  badge?: string;
}

export interface HubGroupInfo {
  name: string;
  eyebrow: string;
  headline: string;
  tagline: string;
  note: string;
}

export interface HubConfig {
  group: HubGroupInfo;
  categories: Category[];
  departments: Department[];
  links: ResourceLink[];
}
