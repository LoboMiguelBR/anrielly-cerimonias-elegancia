
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Users, Home, Camera, Sparkles } from 'lucide-react'

interface Section {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  range: [number, number]
  completed: number
  total: number
}

interface QuestionarioNavigationProps {
  respostas: Record<string, string>
  onNavigateToSection: (sectionId: string) => void
  currentSection?: string
}

const QuestionarioNavigation = ({
  respostas,
  onNavigateToSection,
  currentSection
}: QuestionarioNavigationProps) => {
  const sections: Section[] = [
    {
      id: 'casal',
      title: 'Sobre o Casal',
      icon: Heart,
      range: [0, 10],
      completed: 0,
      total: 11
    },
    {
      id: 'familia',
      title: 'Família e Relacionamento',
      icon: Users,
      range: [11, 19],
      completed: 0,
      total: 9
    },
    {
      id: 'vida-comum',
      title: 'Vida em Comum',
      icon: Home,
      range: [20, 29],
      completed: 0,
      total: 10
    },
    {
      id: 'cerimonia',
      title: 'Cerimônia e Detalhes',
      icon: Camera,
      range: [30, 39],
      completed: 0,
      total: 10
    },
    {
      id: 'curiosidades',
      title: 'Curiosidades',
      icon: Sparkles,
      range: [40, 47],
      completed: 0,
      total: 8
    }
  ]

  // Calcular progresso de cada seção
  sections.forEach(section => {
    let completed = 0
    for (let i = section.range[0]; i <= section.range[1]; i++) {
      if (respostas[i] && respostas[i].trim().length > 0) {
        completed++
      }
    }
    section.completed = completed
  })

  return (
    <Card className="p-4 bg-white shadow-sm border border-gray-200 rounded-2xl">
      <h3 className="font-semibold text-gray-800 mb-4 text-center">Navegação por Seções</h3>
      <div className="space-y-3">
        {sections.map((section) => {
          const progressPercent = (section.completed / section.total) * 100
          const Icon = section.icon
          const isActive = currentSection === section.id
          
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onNavigateToSection(section.id)}
              className={`w-full justify-start h-auto p-3 text-left ${
                isActive ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{section.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress 
                      value={progressPercent} 
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs text-gray-500">
                      {section.completed}/{section.total}
                    </span>
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}

export default QuestionarioNavigation
