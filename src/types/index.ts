
export type Resource = {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  subcategory?: string;
  tags?: string[];
};

export type SearchResult = {
  item: Resource;
  refIndex: number;
  score?: number;
};

export type Category = {
  id: string;
  name: string;
  resources: Resource[];
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  resources: Resource[];
};

// Add or update theme type to include all supported themes
export type Theme = 
  | "default" 
  | "rose" 
  | "red" 
  | "orange" 
  | "green" 
  | "blue" 
  | "yellow" 
  | "violet";
