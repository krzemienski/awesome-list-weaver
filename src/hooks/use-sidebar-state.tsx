
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
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

  const toggleSidebar = () => {
    // On mobile, we toggle the sheet directly
    if (isMobile) {
      setMobileSheetOpen(!mobileSheetOpen);
      return;
    }
    
    // On desktop, we toggle the sidebar state
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem("sidebar-state", newState ? "open" : "closed");
  };

  return {
    sidebarOpen,
    mobileSheetOpen,
    setMobileSheetOpen,
    toggleSidebar
  };
}
