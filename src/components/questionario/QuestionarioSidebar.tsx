
import QuestionarioNavigation from './QuestionarioNavigation'

interface QuestionarioSidebarProps {
  respostas: Record<string, string>
  onNavigateToSection: (sectionId: string) => void
  currentSection: string
}

const QuestionarioSidebar = ({
  respostas,
  onNavigateToSection,
  currentSection
}: QuestionarioSidebarProps) => {
  return (
    <div className="hidden lg:block w-80 sticky top-32 h-fit">
      <QuestionarioNavigation
        respostas={respostas}
        onNavigateToSection={onNavigateToSection}
        currentSection={currentSection}
      />
    </div>
  )
}

export default QuestionarioSidebar
