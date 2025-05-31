
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Json } from '@/integrations/supabase/types';
import CasalCardHeader from './CasalCardHeader';
import CasalCardContent from './CasalCardContent';
import CasalCardActions from './CasalCardActions';
import { usePersonalizacaoIA } from '@/hooks/usePersonalizacaoIA';

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
  const [temPersonalizacao, setTemPersonalizacao] = useState(false);
  const { buscarPersonalizacao } = usePersonalizacaoIA();
  const primeiroDoGrupo = casalGroup[0];

  useEffect(() => {
    const verificarPersonalizacao = async () => {
      const personalizacao = await buscarPersonalizacao(linkPublico);
      setTemPersonalizacao(!!personalizacao);
    };
    
    verificarPersonalizacao();
  }, [linkPublico, buscarPersonalizacao]);

  const temHistoria = primeiroDoGrupo.historia_gerada;

  return (
    <Card className="relative">
      <CardHeader>
        <CasalCardHeader
          linkPublico={linkPublico}
          status={primeiroDoGrupo.status}
          temPersonalizacao={temPersonalizacao}
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
