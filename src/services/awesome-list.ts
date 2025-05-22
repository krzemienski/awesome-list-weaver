
import { Resource, Category, Subcategory } from "@/types";

// Regex patterns for parsing the markdown
const categoryRegex = /^#+\s+(.+?)$/;
const linkRegex = /\[(.+?)\]\((.+?)\)\s*(?:-+\s*(.+?))?$/;

export async function fetchAwesomeList(url: string): Promise<{categories: Category[], resources: Resource[]}> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch awesome list: ${response.status}`);
    }
    
    const markdown = await response.text();
    return parseAwesomeList(markdown);
  } catch (error) {
    console.error("Error fetching awesome list:", error);
    throw error;
  }
}

function parseAwesomeList(markdown: string): {categories: Category[], resources: Resource[]} {
  const lines = markdown.split('\n');
  const categories: Category[] = [];
  const allResources: Resource[] = [];
  
  let currentCategory: Category | null = null;
  let currentSubcategory: Subcategory | null = null;
  
  lines.forEach((line, index) => {
    // Skip first lines until we hit actual content
    if (index < 10 && !line.startsWith('#')) return;
    
    line = line.trim();
    if (!line) return;
    
    // Check if it's a category (heading)
    const categoryMatch = line.match(categoryRegex);
    if (categoryMatch) {
      const categoryName = categoryMatch[1].trim();
      
      // Skip main title and unwanted categories
      if (categoryName === "Awesome Python" || 
          categoryName === "Contents" || 
          categoryName === "Contributing" ||
          categoryName === "Resources") {
        return;
      }
      
      // Create a new category
      currentCategory = {
        id: `category-${categories.length + 1}`,
        name: categoryName,
        resources: [],
        subcategories: []
      };
      
      currentSubcategory = null;
      categories.push(currentCategory);
      return;
    }
    
    // Check if it's a subcategory (subheading with multiple #s)
    if (currentCategory && line.startsWith('##')) {
      const subcategoryName = line.replace(/^#+\s+/, '').trim();
      currentSubcategory = {
        id: `subcategory-${currentCategory.subcategories.length + 1}`,
        name: subcategoryName,
        resources: []
      };
      
      currentCategory.subcategories.push(currentSubcategory);
      return;
    }
    
    // Check if it's a resource (markdown link)
    const linkMatch = line.match(linkRegex);
    if (linkMatch && currentCategory) {
      const title = linkMatch[1].trim();
      const url = linkMatch[2].trim();
      const description = linkMatch[3] ? linkMatch[3].trim() : '';
      
      const resource: Resource = {
        id: `resource-${allResources.length + 1}`,
        title,
        url,
        description,
        category: currentCategory.name,
        tags: [currentCategory.name],
        source: new URL(url).hostname
      };
      
      if (title.toLowerCase().includes('awesome') || description.toLowerCase().includes('curated')) {
        resource.bookmark = true;
      }
      
      // Add resource to appropriate collections
      allResources.push(resource);
      currentCategory.resources.push(resource);
      
      // If there's an active subcategory, add it there too
      if (currentSubcategory) {
        resource.subcategory = currentSubcategory.name;
        currentSubcategory.resources.push(resource);
      }
    }
  });
  
  return {
    categories,
    resources: allResources
  };
}
