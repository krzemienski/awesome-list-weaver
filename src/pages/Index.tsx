
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TopBar } from "@/components/TopBar";
import { SidebarNav } from "@/components/SidebarNav";
import { ResourceGrid } from "@/components/ResourceGrid";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeFab } from "@/components/ThemeFab";
import { Footer } from "@/components/Footer";
import { mockCategories, mockResources } from "@/data/mock-data";
import { Resource } from "@/types";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [displayResources, setDisplayResources] = useState<Resource[]>(mockResources);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>("All Resources");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    if (selectedCategory && selectedSubcategory) {
      const category = mockCategories.find(c => c.id === selectedCategory);
      const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory);
      
      if (subcategory) {
        setDisplayResources(subcategory.resources);
        setPageTitle(`${subcategory.name} (${category?.name})`);
      }
    } else if (selectedCategory) {
      const category = mockCategories.find(c => c.id === selectedCategory);
      
      if (category) {
        setDisplayResources(category.resources);
        setPageTitle(category.name);
      }
    } else {
      setDisplayResources(mockResources);
      setPageTitle("All Resources");
    }
  }, [selectedCategory, selectedSubcategory]);

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
    const categoryWithResource = mockCategories.find(c => 
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopBar 
        onOpenSearch={() => setSearchOpen(true)}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 relative">
        <SidebarNav 
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
                {mockCategories.find(c => c.id === selectedCategory)?.name}
              </span>
              {selectedSubcategory && (
                <>
                  {' / '}
                  <span className="text-primary">
                    {mockCategories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                  </span>
                </>
              )}
            </div>
          )}
          <ResourceGrid 
            resources={displayResources}
            title={pageTitle}
          />
        </motion.main>
      </div>
      
      <Footer />
      
      <SearchDialog 
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectResource={handleSelectResource}
      />
      
      <ThemeFab />
    </div>
  );
};

export default Index;
