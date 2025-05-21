
export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  subcategory?: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  resources: Resource[];
}

export interface Subcategory {
  id: string;
  name: string;
  resources: Resource[];
}

export interface SearchResult {
  item: Resource;
  refIndex: number;
  score: number;
}

export type Theme = 
  | "default" 
  | "dark" 
  | "red" 
  | "rose" 
  | "orange" 
  | "green" 
  | "blue" 
  | "yellow" 
  | "violet";
