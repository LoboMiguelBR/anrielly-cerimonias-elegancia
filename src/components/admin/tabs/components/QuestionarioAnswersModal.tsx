
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Questionario } from "./QuestionarioGroup";

interface QuestionarioAnswersModalProps {
  questionario: Questionario | null;
  onClose: () => void;
}

const QuestionarioAnswersModal = ({ questionario, onClose }: QuestionarioAnswersModalProps) => {
  if (!questionario) return null;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Respostas do Questionário</CardTitle>
        <CardDescription>
          {questionario.nome_responsavel} - {questionario.email}
        </CardDescription>
        <Button onClick={onClose} variant="outline">
          Fechar
        </Button>
      </CardHeader>
      <CardContent className="max-h-[60vh] overflow-y-auto">
        {questionario.respostas_json && Object.keys(questionario.respostas_json).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(questionario.respostas_json).map(([perguntaIndex, resposta]) => (
              <div key={perguntaIndex} className="border-b pb-4">
                <p className="font-medium text-sm text-gray-600 mb-2">
                  Pergunta {parseInt(perguntaIndex) + 1}
                </p>
                <p className="bg-gray-50 p-3 rounded text-sm">
                  {resposta || 'Não respondida'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma resposta registrada ainda
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionarioAnswersModal;
