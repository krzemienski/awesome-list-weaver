
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TopBar } from "@/components/TopBar";
import { SidebarNav } from "@/components/SidebarNav";
import { ResourceGrid } from "@/components/ResourceGrid";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeFab } from "@/components/ThemeFab";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/hooks/use-theme";
import { mockCategories, mockResources } from "@/data/mock-data";
import { Resource } from "@/types";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [displayResources, setDisplayResources] = useState<Resource[]>(mockResources);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>("All Resources");
  const { toast } = useToast();

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
    handleSelectCategory(mockCategories.find(c => c.id === 
      mockCategories.find(c => c.resources.some(r => r.id === resource.id))?.id)?.id || "");
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <TopBar onOpenSearch={() => setSearchOpen(true)} />
        
        <div className="flex flex-1">
          <SidebarNav 
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectCategory={handleSelectCategory}
            onSelectSubcategory={handleSelectSubcategory}
          />
          
          <main className="flex-1 container py-6 px-4 md:px-6">
            <ResourceGrid 
              resources={displayResources}
              title={pageTitle}
            />
          </main>
        </div>
        
        <Footer />
        
        <SearchDialog 
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onSelectResource={handleSelectResource}
        />
        
        <ThemeFab />
      </div>
    </ThemeProvider>
  );
};

export default Index;
