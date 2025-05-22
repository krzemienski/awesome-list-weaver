
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TopBar } from "@/components/TopBar";
import { SidebarNav } from "@/components/SidebarNav";
import { SearchDialog } from "@/components/SearchDialog";
import { ThemeFab } from "@/components/ThemeFab";
import { Footer } from "@/components/Footer";
import { Resource } from "@/types";
import { LoadingState } from "@/components/states/LoadingState";
import { ErrorState } from "@/components/states/ErrorState";
import { MainContent } from "@/components/MainContent";
import { useAwesomeData } from "@/hooks/use-awesome-data";
import { useResources } from "@/hooks/use-resources";
import { useSidebarState } from "@/hooks/use-sidebar-state";

const Index = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { toast } = useToast();
  
  // Custom hooks
  const { isLoading, error, categories, allResources, reloadData } = useAwesomeData();
  const { sidebarOpen, toggleSidebar } = useSidebarState();
  const {
    selectedCategory,
    selectedSubcategory,
    selectedTags,
    displayResources,
    pageTitle,
    showFilters,
    handleSelectCategory,
    handleSelectSubcategory,
    handleTagSelect,
    clearFilters,
    toggleFilters,
    setSelectedCategory,
    setSelectedSubcategory
  } = useResources(categories, allResources);

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

  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState message={error} onRetry={reloadData} />;
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
        
        <MainContent 
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          selectedTags={selectedTags}
          displayResources={displayResources}
          pageTitle={pageTitle}
          showFilters={showFilters}
          onSelectCategory={setSelectedCategory}
          onSelectSubcategory={setSelectedSubcategory}
          onTagSelect={handleTagSelect}
          onToggleFilters={toggleFilters}
          onClearFilters={clearFilters}
        />
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
