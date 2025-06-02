
import { useState, useEffect } from 'react'

export const useMobileLayout = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      // Verificação de segurança para window
      if (typeof window === 'undefined') {
        console.warn('useMobileLayout: window is undefined')
        return
      }

      const width = window.innerWidth
      const height = window.innerHeight
      
      const newIsMobile = width < 768
      const newIsTablet = width >= 768 && width < 1024
      const newIsLandscape = width > height

      console.log('useMobileLayout: Detectando dispositivo:', {
        width,
        height,
        isMobile: newIsMobile,
        isTablet: newIsTablet,
        isDesktop: !newIsMobile && !newIsTablet,
        isLandscape: newIsLandscape
      })
      
      setIsMobile(newIsMobile)
      setIsTablet(newIsTablet)
      setIsLandscape(newIsLandscape)
    }

    checkDevice()
    
    const resizeHandler = () => {
      console.log('useMobileLayout: Resize detectado')
      checkDevice()
    }

    const orientationHandler = () => {
      console.log('useMobileLayout: Mudança de orientação detectada')
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

  const result = { 
    isMobile: isMobile || false, 
    isTablet: isTablet || false, 
    isDesktop: (!isMobile && !isTablet) || false,
    isLandscape: isLandscape || false,
    isPortrait: (!isLandscape) || false
  }

  console.log('useMobileLayout: Retornando:', result)
  return result
}
