
import { TemplateStructures } from './types';

export const corporateEventsTemplates: TemplateStructures = {
  'Eventos corporativos': {
    sections: [
      {
        titulo: "Informações do Evento",
        descricao: "Dados básicos sobre o evento corporativo",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome/tema do evento?", tipo_resposta: "texto_curto", placeholder: "Nome oficial do evento", obrigatoria: true, ordem: 1 },
          { texto: "Qual é o objetivo principal do evento?", tipo_resposta: "texto_longo", placeholder: "Metas, propósitos, resultados esperados", obrigatoria: true, ordem: 2 },
          { texto: "Quantos participantes são esperados?", tipo_resposta: "numero", placeholder: "Número aproximado", obrigatoria: true, ordem: 3 },
          { texto: "Qual é o perfil do público-alvo?", tipo_resposta: "texto_longo", placeholder: "Cargos, departamentos, nível hierárquico", obrigatoria: true, ordem: 4 }
        ]
      },
      {
        titulo: "Logística e Organização",
        descricao: "Detalhes operacionais do evento",
        ordem: 2,
        questions: [
          { texto: "Qual é a duração prevista do evento?", tipo_resposta: "texto_curto", placeholder: "Ex: 4 horas, 1 dia, 2 dias", obrigatoria: true, ordem: 1 },
          { texto: "Há necessidade de equipamentos especiais?", tipo_resposta: "texto_longo", placeholder: "Audiovisual, tecnologia, mobiliário", obrigatoria: false, ordem: 2 },
          { texto: "O evento terá palestrantes ou apresentações?", tipo_resposta: "texto_longo", placeholder: "Detalhes sobre apresentações", obrigatoria: false, ordem: 3 },
          { texto: "Há necessidades especiais de catering?", tipo_resposta: "texto_longo", placeholder: "Coffee break, almoço, restrições alimentares", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Networking e Experiência",
        descricao: "Aspectos de relacionamento e experiência dos participantes",
        ordem: 3,
        questions: [
          { texto: "O evento terá momentos de networking?", tipo_resposta: "texto_longo", placeholder: "Como será facilitado o networking", obrigatoria: false, ordem: 1 },
          { texto: "Qual atmosfera vocês desejam criar?", tipo_resposta: "texto_longo", placeholder: "Formal, descontraída, inovadora, tradicional", obrigatoria: false, ordem: 2 },
          { texto: "Há alguma mensagem específica da empresa a transmitir?", tipo_resposta: "texto_longo", placeholder: "Valores, missão, conquistas", obrigatoria: false, ordem: 3 },
          { texto: "Como vocês medirão o sucesso do evento?", tipo_resposta: "texto_longo", placeholder: "KPIs, feedback, resultados esperados", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Outro': {
    sections: [
      {
        titulo: "Informações Básicas",
        descricao: "Dados fundamentais sobre o evento",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome do evento?", tipo_resposta: "texto_curto", placeholder: "Nome ou título do evento", obrigatoria: true, ordem: 1 },
          { texto: "Qual é o tipo específico do evento?", tipo_resposta: "texto_curto", placeholder: "Descreva o tipo de evento", obrigatoria: true, ordem: 2 },
          { texto: "Qual é o objetivo principal do evento?", tipo_resposta: "texto_longo", placeholder: "O que se pretende alcançar", obrigatoria: true, ordem: 3 },
          { texto: "Quantas pessoas são esperadas?", tipo_resposta: "numero", placeholder: "Número aproximado de participantes", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Organização e Logística",
        descricao: "Detalhes sobre a organização do evento",
        ordem: 2,
        questions: [
          { texto: "Qual é a duração do evento?", tipo_resposta: "texto_curto", placeholder: "Tempo total do evento", obrigatoria: false, ordem: 1 },
          { texto: "Há alguma necessidade especial?", tipo_resposta: "texto_longo", placeholder: "Equipamentos, decoração, serviços", obrigatoria: false, ordem: 2 },
          { texto: "Qual é o perfil dos participantes?", tipo_resposta: "texto_longo", placeholder: "Idade, interesses, características", obrigatoria: false, ordem: 3 },
          { texto: "Há alguma tradição ou costume a ser seguido?", tipo_resposta: "texto_longo", placeholder: "Tradições familiares, culturais ou religiosas", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Personalização",
        descricao: "Detalhes únicos e personalizações",
        ordem: 3,
        questions: [
          { texto: "O que torna este evento especial?", tipo_resposta: "texto_longo", placeholder: "Elementos únicos e significativos", obrigatoria: false, ordem: 1 },
          { texto: "Há alguma pessoa especial a ser homenageada?", tipo_resposta: "texto_longo", placeholder: "Homenageados ou pessoas importantes", obrigatoria: false, ordem: 2 },
          { texto: "Qual atmosfera vocês desejam criar?", tipo_resposta: "texto_longo", placeholder: "Ambiente, clima, sentimentos", obrigatoria: false, ordem: 3 },
          { texto: "Há alguma observação adicional importante?", tipo_resposta: "texto_longo", placeholder: "Outros detalhes relevantes", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  }
};
