
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Json } from '@/integrations/supabase/types';
import CasalCardHeader from './CasalCardHeader';
import CasalCardContent from './CasalCardContent';
import CasalCardActions from './CasalCardActions';

interface QuestionarioCasal {
  id: string;
  link_publico: string;
  nome_responsavel: string;
  email: string;
  status: string | null;
  historia_gerada: string | null;
  historia_processada: boolean | null;
  data_criacao: string | null;
  data_atualizacao: string | null;
  total_perguntas_resp: number | null;
  respostas_json: Json | null;
  senha_hash: string;
  temPersonalizacao?: boolean;
}

interface CasalCardProps {
  linkPublico: string;
  casalGroup: QuestionarioCasal[];
  isGenerating: string | null;
  onPersonalizacao: (linkPublico: string) => void;
  onGerarHistoria: (linkPublico: string) => void;
  onVerHistoria: (linkPublico: string) => void;
}

const CasalCard = ({
  linkPublico,
  casalGroup,
  isGenerating,
  onPersonalizacao,
  onGerarHistoria,
  onVerHistoria
}: CasalCardProps) => {
  const primeiroDoGrupo = casalGroup[0];
  const temHistoria = primeiroDoGrupo.historia_gerada;
  const temPersonalizacao = primeiroDoGrupo.temPersonalizacao;

  return (
    <Card key={linkPublico} className="relative">
      <CardHeader>
        <CasalCardHeader
          linkPublico={linkPublico}
          status={primeiroDoGrupo.status}
          temPersonalizacao={!!temPersonalizacao}
          totalQuestionarios={casalGroup.length}
        />
      </CardHeader>

      <CardContent>
        <CasalCardContent
          casalGroup={casalGroup}
          historiaGerada={primeiroDoGrupo.historia_gerada}
        />

        <CasalCardActions
          linkPublico={linkPublico}
          temHistoria={!!temHistoria}
          isGenerating={isGenerating === linkPublico}
          casalGroupLength={casalGroup.length}
          onPersonalizacao={onPersonalizacao}
          onGerarHistoria={onGerarHistoria}
          onVerHistoria={onVerHistoria}
        />
      </CardContent>
    </Card>
  );
};

export default CasalCard;
