
import { Resource, Category, Subcategory } from "@/types";

// Regex patterns for parsing the markdown
const categoryRegex = /^#+\s+(.+?)$/;
const linkRegex = /\*\s+\[(.+?)\]\((.+?)\)(?:\s*-\s*(.+?))?$/;
const titleRegex = /^#\s+(.+?)\s+(?:\[.*?\]\((.*?)\))?/;
const repoUrlRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;

export async function fetchAwesomeList(url: string): Promise<{
  categories: Category[], 
  resources: Resource[],
  listName: string,
  githubUrl: string
}> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch awesome list: ${response.status}`);
    }
    
    const markdown = await response.text();
    return parseAwesomeList(markdown, url);
  } catch (error) {
    console.error("Error fetching awesome list:", error);
    throw error;
  }
}

function parseAwesomeList(
  markdown: string, 
  sourceUrl: string
): {
  categories: Category[], 
  resources: Resource[],
  listName: string,
  githubUrl: string
} {
  const lines = markdown.split('\n');
  const categories: Category[] = [];
  const allResources: Resource[] = [];
  
  // Extract list name and GitHub URL from the first few lines
  let listName = "Awesome List";
  let githubUrl = "https://github.com";
  
  // Try to extract title from first line that starts with #
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const titleMatch = lines[i].match(titleRegex);
    if (titleMatch) {
      listName = titleMatch[1].trim();
      break;
    }
  }
  
  // Extract GitHub URL from source URL or content
  try {
    const urlParts = sourceUrl.match(repoUrlRegex);
    if (urlParts && urlParts.length >= 3) {
      const username = urlParts[1];
      const repo = urlParts[2];
      githubUrl = `https://github.com/${username}/${repo}`;
    }
  } catch (e) {
    console.error("Error extracting GitHub URL:", e);
    // Fall back to searching in content
    for (let i = 0; i < Math.min(50, lines.length); i++) {
      if (lines[i].includes("github.com")) {
        const ghMatch = lines[i].match(/(https:\/\/github\.com\/[^)\s]+)/);
        if (ghMatch && ghMatch[1]) {
          githubUrl = ghMatch[1];
          break;
        }
      }
    }
  }
  
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
      if (categoryName === listName || 
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
    
    // Check if it's a resource (markdown link with * prefix)
    const linkMatch = line.match(linkRegex);
    if (linkMatch && currentCategory) {
      const title = linkMatch[1].trim();
      const url = linkMatch[2].trim();
      const description = linkMatch[3] ? linkMatch[3].trim() : '';
      
      // Create a valid resource object
      const resource: Resource = {
        id: `resource-${allResources.length + 1}`,
        title,
        url,
        description,
        category: currentCategory.name,
        tags: [currentCategory.name],
        source: new URL(url).hostname
      };
      
      // Add bookmark for anything with "Awesome" in the title or "curated" in the description
      if (title.toLowerCase().includes('awesome') || description.toLowerCase().includes('curated')) {
        resource.bookmark = true;
      }
      
      // Add resource to appropriate collections
      allResources.push(resource);
      currentCategory.resources.push(resource);
      
      // If there's an active subcategory, add it there too
      if (currentSubcategory) {
        resource.subcategory = currentSubcategory.name;
        resource.tags = [...resource.tags, currentSubcategory.name];
        currentSubcategory.resources.push(resource);
      }
    }
  });
  
  console.log(`Parsed ${allResources.length} resources in ${categories.length} categories`);
  console.log(`List name: ${listName}, GitHub URL: ${githubUrl}`);
  
  return {
    categories,
    resources: allResources,
    listName,
    githubUrl
  };
}
