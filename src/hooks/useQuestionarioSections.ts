
import { useState, useEffect, useRef } from 'react'

export const useQuestionarioSections = () => {
  const [currentSection, setCurrentSection] = useState<string>('casal')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Intersection Observer for section detection
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
      { threshold: 0.3 }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavigateToSection = (sectionId: string) => {
    const ref = sectionRefs.current[sectionId]
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return {
    currentSection,
    sectionRefs,
    handleNavigateToSection
  }
}
