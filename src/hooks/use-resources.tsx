
import { useState, useEffect } from "react";
import { Category, Resource } from "@/types";

export function useResources(
  categories: Category[],
  allResources: Resource[],
) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [displayResources, setDisplayResources] = useState<Resource[]>([]);
  const [pageTitle, setPageTitle] = useState<string>("All Resources");
  const [showFilters, setShowFilters] = useState(false);

  // Filter resources based on selected category, subcategory, and tags
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
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
    setSelectedSubcategory,
  };
}
