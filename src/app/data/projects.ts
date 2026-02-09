export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description?: string;
  role?: string;
  client?: string;
  images?: string[];
  project_type?: 'case_study' | 'selected_work';
  className?: string; // For grid layout in SelectedWork
  is_published?: boolean;
}

export const projects: Project[] = [




];
