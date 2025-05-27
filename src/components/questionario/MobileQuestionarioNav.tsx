
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ArrowUp, List } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { questionarioSections } from '@/utils/questionarioSections'

interface MobileQuestionarioNavProps {
  respostas: Record<string, string>
  onNavigateToSection: (sectionId: string) => void
  currentSection: string
}

const MobileQuestionarioNav = ({
  respostas,
  onNavigateToSection,
  currentSection
}: MobileQuestionarioNavProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSectionClick = (sectionId: string) => {
    onNavigateToSection(sectionId)
    setIsOpen(false)
  }

  const getSectionProgress = (section: any) => {
    const answeredQuestions = section.questions.filter((_: any, index: number) => {
      const globalIndex = section.range[0] + index
      return respostas[globalIndex] && respostas[globalIndex].trim().length > 0
    }).length
    
    return {
      answered: answeredQuestions,
      total: section.questions.length,
      percentage: Math.round((answeredQuestions / section.questions.length) * 100)
    }
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden flex flex-col gap-2">
        <Button
          size="icon"
          onClick={scrollToTop}
          className="rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg"
            >
              <List className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <h2 className="font-playfair text-xl font-bold text-gray-800">
                  Navegação
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Ir para uma seção específica
                </p>
              </div>
              
              <div className="flex-1 py-4 overflow-y-auto">
                {questionarioSections.map((section) => {
                  const progress = getSectionProgress(section)
                  const isActive = currentSection === section.id
                  
                  return (
                    <div key={section.id} className="px-4 mb-4">
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start p-4 h-auto flex-col items-start ${
                          isActive ? 'bg-rose-50 text-rose-700 border border-rose-200' : ''
                        }`}
                        onClick={() => handleSectionClick(section.id)}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="font-medium text-sm text-left">
                            {section.title}
                          </span>
                          <Badge 
                            variant={progress.percentage === 100 ? "default" : "secondary"}
                            className="ml-2 text-xs"
                          >
                            {progress.answered}/{progress.total}
                          </Badge>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-rose-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        
                        <span className="text-xs text-gray-500 mt-1">
                          {progress.percentage}% concluído
                        </span>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default MobileQuestionarioNav
