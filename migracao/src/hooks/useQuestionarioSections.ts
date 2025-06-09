
import { useState, useRef, useEffect } from 'react'
import { questionarioSections } from '@/utils/questionarioSections'

export const useQuestionarioSections = () => {
  const [currentSection, setCurrentSection] = useState(questionarioSections[0]?.id || '')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const handleNavigateToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const headerHeight = 120 // Account for sticky header
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id')
            if (sectionId) {
              setCurrentSection(sectionId)
            }
          }
        })
      },
      {
        rootMargin: '-20% 0px -70% 0px'
      }
    )

    // Observe all section elements
    Object.values(sectionRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  return {
    currentSection,
    sectionRefs,
    handleNavigateToSection
  }
}
