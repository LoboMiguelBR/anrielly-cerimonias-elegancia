
import { useState, useEffect } from 'react'

export const useMobileLayout = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsLandscape(width > height)
    }

    checkDevice()
    
    const resizeHandler = () => {
      checkDevice()
    }

    const orientationHandler = () => {
      // Small delay to account for orientation change
      setTimeout(checkDevice, 100)
    }

    window.addEventListener('resize', resizeHandler)
    window.addEventListener('orientationchange', orientationHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('orientationchange', orientationHandler)
    }
  }, [])

  return { 
    isMobile, 
    isTablet, 
    isDesktop: !isMobile && !isTablet,
    isLandscape,
    isPortrait: !isLandscape
  }
}
