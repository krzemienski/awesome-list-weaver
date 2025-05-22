
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchAwesomeList } from "@/services/awesome-list";
import { Category, Resource } from "@/types";

// Default awesome list URL - in production this would come from an env var
const DEFAULT_AWESOME_LIST_URL = "https://raw.githubusercontent.com/vinta/awesome-python/master/README.md";

export function useAwesomeData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [listName, setListName] = useState<string>("Awesome List");
  const [githubUrl, setGithubUrl] = useState<string>("https://github.com");
  const { toast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching data from awesome list...");
      const awesomeListUrl = import.meta.env.VITE_AWESOME_LIST_URL || DEFAULT_AWESOME_LIST_URL;
      console.log("Using URL:", awesomeListUrl);
      
      const { categories, resources, listName, githubUrl } = await fetchAwesomeList(awesomeListUrl);
      console.log(`Loaded ${resources.length} resources in ${categories.length} categories`);
      console.log(`List name: ${listName}, GitHub URL: ${githubUrl}`);
      
      if (resources.length === 0) {
        console.warn("No resources found in the awesome list");
        
        // Still set the data we have, so we can show a proper empty state
        setCategories(categories);
        setAllResources(resources);
        setListName(listName);
        setGithubUrl(githubUrl);
        
        // But also set an error to show an error state
        throw new Error(
          "No resources could be found in this awesome list. This might be due to a formatting issue or an unsupported markdown structure."
        );
      }
      
      setCategories(categories);
      setAllResources(resources);
      setListName(listName);
      setGithubUrl(githubUrl);
      
      toast({
        title: "Resources loaded",
        description: `${resources.length} awesome resources are ready`,
      });
    } catch (error) {
      console.error("Failed to load awesome list:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Error loading resources",
        description: "Failed to load the awesome list. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    isLoading,
    error,
    categories,
    allResources,
    listName,
    githubUrl,
    reloadData: loadData,
  };
}
