
import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'

const QuestionarioSecurityCard = () => {
  return (
    <Card className="bg-rose-50 border border-rose-200 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              🔐 Cadastro Essencial para sua Segurança
            </h2>
            <div className="text-sm font-medium text-gray-700 space-y-3">
              <p>
                Para garantir que cada noivo(a) tenha um <strong>acesso exclusivo, seguro e individual</strong>, é necessário realizar um cadastro antes de preencher o questionário.
              </p>
              <p>
                ✅ Isso assegura que suas respostas fiquem salvas com total privacidade, permitindo que você preencha no seu tempo, com tranquilidade, e possa retornar sempre que desejar.
              </p>
              <p>
                🔒 O cadastro é essencial para manter a <strong>confiabilidade, autenticidade e segurança</strong> das informações, além de garantir que cada história seja tratada com o carinho e o cuidado que ela merece.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionarioSecurityCard
