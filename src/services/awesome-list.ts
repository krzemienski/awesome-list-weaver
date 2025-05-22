
import { Resource, Category, Subcategory } from "@/types";

// Regex patterns for parsing the markdown
const categoryRegex = /^#+\s+(.+?)$/;
const linkRegex = /\*\s+\[(.+?)\]\((.+?)\)(?:\s*-\s*(.+?))?$/;
const titleRegex = /^#\s+(.+?)(?:\s+\[.*?\]\((.*?)\))?/;
const badgeRegex = /\[\!\[.*?\]\(.*?\)\]\(.*?\)/g;
const repoUrlRegex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;

export async function fetchAwesomeList(url: string): Promise<{
  categories: Category[], 
  resources: Resource[],
  listName: string,
  githubUrl: string
}> {
  try {
    console.log("Fetching awesome list from URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch awesome list: ${response.status}`);
    }
    
    const markdown = await response.text();
    console.log("Markdown fetched, length:", markdown.length);
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
  
  // Extract GitHub URL from source URL
  let githubUrl = extractGithubUrl(sourceUrl);
  
  // Extract list name and clean it up
  let listName = extractListName(lines, sourceUrl);
  
  console.log(`Initial extraction - List name: "${listName}", GitHub URL: ${githubUrl}`);
  
  let currentCategory: Category | null = null;
  let currentSubcategory: Subcategory | null = null;
  let inContentSection = false;
  
  // Skip header lines and find where the actual content begins
  let contentStartIndex = 0;
  for (let i = 0; i < Math.min(30, lines.length); i++) {
    if (lines[i].match(/^#+\s+Contents?$/i)) {
      inContentSection = true;
      contentStartIndex = i + 1;
      break;
    }
  }
  
  if (!inContentSection) {
    // If no Contents section, look for the first heading that's not the title
    for (let i = 1; i < Math.min(30, lines.length); i++) {
      if (lines[i].startsWith('#') && !lines[i].toLowerCase().includes(listName.toLowerCase())) {
        contentStartIndex = i;
        break;
      }
    }
  }
  
  // Process lines after the content section
  for (let i = contentStartIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Skip lines that appear to be badges or non-content elements
    if (line.match(badgeRegex) || line.startsWith('<!--')) continue;
    
    // Check if it's a category (heading)
    const categoryMatch = line.match(categoryRegex);
    if (categoryMatch) {
      const categoryName = categoryMatch[1].trim();
      
      // Skip unwanted categories
      if (categoryName.toLowerCase() === "contents" || 
          categoryName.toLowerCase() === "contributing" ||
          categoryName.toLowerCase() === "resources") {
        continue;
      }
      
      console.log("Found category:", categoryName);
      
      // Create a new category
      currentCategory = {
        id: `category-${categories.length + 1}`,
        name: categoryName,
        resources: [],
        subcategories: []
      };
      
      currentSubcategory = null;
      categories.push(currentCategory);
      continue;
    }
    
    // Check if it's a subcategory (subheading with multiple #s)
    if (currentCategory && line.match(/^#{2,}\s+(.+?)$/)) {
      const subcategoryName = line.replace(/^#+\s+/, '').trim();
      currentSubcategory = {
        id: `subcategory-${currentCategory.subcategories.length + 1}`,
        name: subcategoryName,
        resources: []
      };
      
      currentCategory.subcategories.push(currentSubcategory);
      continue;
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
        source: extractDomain(url)
      };
      
      // Add bookmark for anything with "Awesome" in the title or "curated" in the description
      if (title.toLowerCase().includes('awesome') || 
          description.toLowerCase().includes('curated')) {
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
  }
  
  console.log(`Parsed ${allResources.length} resources in ${categories.length} categories`);
  console.log(`Final list name: "${listName}", GitHub URL: ${githubUrl}`);
  
  if (allResources.length === 0) {
    console.warn("No resources were found. This might indicate a parsing issue.");
  }
  
  return {
    categories,
    resources: allResources,
    listName,
    githubUrl
  };
}

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return url;
  }
}

// Helper function to extract GitHub URL
function extractGithubUrl(sourceUrl: string): string {
  try {
    // First, try to extract from source URL
    const urlParts = sourceUrl.match(repoUrlRegex);
    if (urlParts && urlParts.length >= 3) {
      const username = urlParts[1];
      const repo = urlParts[2];
      return `https://github.com/${username}/${repo}`;
    }
    
    // If that fails, just return the raw GitHub URL if it is one
    if (sourceUrl.includes('github.com')) {
      return sourceUrl.split('#')[0]; // Remove any fragment
    }
  } catch (e) {
    console.error("Error extracting GitHub URL:", e);
  }
  
  return "https://github.com"; // Fallback
}

// Helper function to extract and clean list name
function extractListName(lines: string[], sourceUrl: string): string {
  // Start with a default name
  let listName = "Awesome List";
  
  // First try to extract from the title (first heading)
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const titleMatch = lines[i].match(titleRegex);
    if (titleMatch) {
      listName = titleMatch[1].trim();
      
      // Clean up the name
      listName = listName
        .replace(badgeRegex, '') // Remove badges
        .replace(/^\s*[#\s]*/, '') // Remove leading # and spaces
        .trim();
      
      break;
    }
  }
  
  // If that didn't work, try to extract from URL
  if (listName === "Awesome List" && sourceUrl.includes('github.com')) {
    try {
      const urlParts = sourceUrl.match(repoUrlRegex);
      if (urlParts && urlParts.length >= 3) {
        const repo = urlParts[2];
        listName = repo
          .replace(/^awesome-/i, 'Awesome ') // Replace awesome- prefix with Awesome space
          .replace(/-/g, ' ') // Replace dashes with spaces
          .split('/')
          .pop() || listName;
          
        // Capitalize first letter of each word
        listName = listName.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    } catch (e) {
      console.error("Error extracting list name from URL:", e);
    }
  }
  
  return listName;
}
