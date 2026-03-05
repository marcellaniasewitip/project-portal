import * as React from "react"

/**
 * Defines the maximum width for a screen to be considered "mobile".
 * This is a common breakpoint (768px is the start of most tablets/desktop views).
 */
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to determine if the current viewport width falls within the mobile range.
 * It is fully responsive, updating the state whenever the browser window is resized
 * across the defined breakpoint.
 *
 * @returns {boolean} True if the screen width is less than MOBILE_BREAKPOINT, false otherwise.
 */
export function useIsMobile(): boolean {
  // Use undefined for initial state to correctly handle server-side rendering (SSR) if applicable,
  // but initialize it on the client side immediately in the effect.
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Media query string for screen sizes smaller than the breakpoint
    const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    const mql = window.matchMedia(mediaQuery)

    // Handler function to update state based on the matchMedia result
    const handleMatch = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches)
    }
    
    // 1. Set initial state (required for client-side rendering)
    handleMatch(mql)

    // 2. Set up listener for future changes
    // Check for compatibility, though addEventListener is preferred for modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", handleMatch)
    } else {
      // Fallback for older browsers (e.g., Safari < 14)
      mql.addListener(handleMatch)
    }

    // Cleanup function
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleMatch)
      } else {
        mql.removeListener(handleMatch)
      }
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  return isMobile
}