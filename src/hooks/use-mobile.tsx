
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // md breakpoint in Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on initial load
    checkIfMobile()
    
    // Add event listener for both resize and orientation change
    window.addEventListener("resize", checkIfMobile)
    window.addEventListener("orientationchange", checkIfMobile)
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile)
      window.removeEventListener("orientationchange", checkIfMobile)
    }
  }, [])

  return isMobile
}
