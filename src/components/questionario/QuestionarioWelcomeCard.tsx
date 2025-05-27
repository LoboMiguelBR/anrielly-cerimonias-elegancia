
import { Card, CardContent } from '@/components/ui/card'

const QuestionarioWelcomeCard = () => {
  return (
    <Card className="bg-white border border-rose-100 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-playfair text-center text-gray-800 mb-4">
          📝 Mensagem de Boas-vindas ao Questionário
        </h2>
        <div className="text-sm text-gray-700 space-y-3">
          <p>
            Olá! Seja muito bem-vindo(a) ao nosso <strong>Questionário de Celebração do Amor</strong>.
          </p>
          <p>
            Queremos te lembrar que este não é um simples formulário... é um momento especial para você refletir, reviver memórias e contar a linda história de vocês, com todo carinho, verdade e coração.
          </p>
          <p className="text-rose-600 font-medium">
            💖 Não tenha pressa!
          </p>
          <p>
            Sinta-se totalmente à vontade para responder no seu tempo, com toda sinceridade e tranquilidade.
          </p>
          <p>
            Você pode salvar suas respostas a qualquer momento e, sempre que desejar, retornar para continuar de onde parou. Basta usar o seu email e senha cadastrados no início do preenchimento.
          </p>
          <p>
            Nosso maior desejo é que esse questionário seja uma experiência leve, divertida e cheia de amor. Afinal, cada detalhe que você compartilha nos ajuda a tornar a cerimônia ainda mais única, verdadeira e especial.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionarioWelcomeCard
