
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TopBar } from "@/components/TopBar";
import { SidebarNav } from "@/components/SidebarNav";
import { ResourceGrid } from "@/components/ResourceGrid";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeFab } from "@/components/ThemeFab";
import { Footer } from "@/components/Footer";
import { Resource, Category } from "@/types";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchAwesomeList } from "@/services/awesome-list";
import { Loader2 } from "lucide-react";

// Default awesome list URL - in production this would come from an env var
const DEFAULT_AWESOME_LIST_URL = "https://raw.githubusercontent.com/vinta/awesome-python/master/README.md";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [displayResources, setDisplayResources] = useState<Resource[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>("All Resources");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fetch data from the awesome list
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const awesomeListUrl = import.meta.env.VITE_AWESOME_LIST_URL || DEFAULT_AWESOME_LIST_URL;
        const { categories, resources } = await fetchAwesomeList(awesomeListUrl);
        setCategories(categories);
        setAllResources(resources);
        setDisplayResources(resources);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load awesome list:", error);
        toast({
          title: "Error loading resources",
          description: "Failed to load the awesome list. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  useEffect(() => {
    // Check if there's a stored sidebar preference
    const storedSidebarState = localStorage.getItem("sidebar-state");
    if (storedSidebarState) {
      setSidebarOpen(storedSidebarState === "open");
    } else {
      // Default to closed on mobile, open on desktop
      setSidebarOpen(!isMobile);
      localStorage.setItem("sidebar-state", isMobile ? "closed" : "open");
    }
  }, [isMobile]);

  useEffect(() => {
    if (selectedTags.length === 0 && !selectedCategory && !selectedSubcategory) {
      setDisplayResources(allResources);
      setPageTitle("All Resources");
      return;
    }
    
    let filteredResources = [...allResources];
    
    // Filter by category first
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      
      if (category) {
        if (selectedSubcategory) {
          const subcategory = category.subcategories.find(s => s.id === selectedSubcategory);
          
          if (subcategory) {
            filteredResources = subcategory.resources;
            setPageTitle(`${subcategory.name} (${category.name})`);
          }
        } else {
          filteredResources = category.resources;
          setPageTitle(category.name);
        }
      }
    }
    
    // Then filter by tags if any are selected
    if (selectedTags.length > 0) {
      filteredResources = filteredResources.filter(resource => 
        resource.tags?.some(tag => selectedTags.includes(tag))
      );
      
      if (!selectedCategory) {
        setPageTitle(`Filtered by ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`);
      }
    }
    
    setDisplayResources(filteredResources);
  }, [selectedCategory, selectedSubcategory, selectedTags, allResources, categories]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(undefined);
  };

  const handleSelectSubcategory = (categoryId: string, subcategoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
  };

  const handleSelectResource = (resource: Resource) => {
    // Show toast with resource info
    toast({
      title: `Selected: ${resource.title}`,
      description: "Opening resource link",
    });
    
    // Open resource URL
    window.open(resource.url, "_blank", "noopener,noreferrer");
    
    // Update category/subcategory selection
    const categoryWithResource = categories.find(c => 
      c.resources.some(r => r.id === resource.id));
    
    if (categoryWithResource) {
      handleSelectCategory(categoryWithResource.id);
    }
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem("sidebar-state", newState ? "open" : "closed");
  };
  
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  const clearFilters = () => {
    setSelectedTags([]);
    if (!selectedCategory) {
      setPageTitle("All Resources");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading awesome resources...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar 
        onOpenSearch={() => setSearchOpen(true)}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 relative">
        <SidebarNav 
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onSelectCategory={handleSelectCategory}
          onSelectSubcategory={handleSelectSubcategory}
          isOpen={sidebarOpen}
        />
        
        <motion.main 
          className="flex-1 container py-6 px-4 md:px-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedCategory && (
            <div className="mb-4 text-sm text-muted-foreground">
              <span className="hover:text-primary cursor-pointer" onClick={() => {
                setSelectedCategory(undefined);
                setSelectedSubcategory(undefined);
              }}>Home</span>
              {' / '}
              <span className={!selectedSubcategory ? "text-primary" : "hover:text-primary cursor-pointer"} onClick={() => {
                setSelectedSubcategory(undefined);
              }}>
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
              {selectedSubcategory && (
                <>
                  {' / '}
                  <span className="text-primary">
                    {categories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                  </span>
                </>
              )}
            </div>
          )}
          <ResourceGrid 
            resources={displayResources}
            title={pageTitle}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
            onClearFilters={clearFilters}
          />
        </motion.main>
      </div>
      
      <Footer />
      
      <SearchDialog 
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectResource={handleSelectResource}
        resources={allResources}
      />
      
      <ThemeFab />
    </div>
  );
};

export default Index;
