
import { TemplateStructures } from './types';

export const religiousEventsTemplates: TemplateStructures = {
  'Batizado': {
    sections: [
      {
        titulo: "Informações da Criança",
        descricao: "Dados sobre o batizando",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome completo da criança?", tipo_resposta: "texto_curto", placeholder: "Nome completo", obrigatoria: true, ordem: 1 },
          { texto: "Qual é a data de nascimento?", tipo_resposta: "data", obrigatoria: true, ordem: 2 },
          { texto: "Qual é o significado do nome escolhido?", tipo_resposta: "texto_longo", placeholder: "Por que escolheram este nome", obrigatoria: false, ordem: 3 },
          { texto: "A criança tem alguma característica especial?", tipo_resposta: "texto_longo", placeholder: "Personalidade, gostos, curiosidades", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Família e Padrinhos",
        descricao: "Informações sobre pais e padrinhos",
        ordem: 2,
        questions: [
          { texto: "Quem são os padrinhos escolhidos?", tipo_resposta: "texto_longo", placeholder: "Nomes e relação com a família", obrigatoria: true, ordem: 1 },
          { texto: "Por que escolheram estes padrinhos?", tipo_resposta: "texto_longo", placeholder: "Motivos da escolha", obrigatoria: false, ordem: 2 },
          { texto: "Como os pais se sentem sobre este momento?", tipo_resposta: "texto_longo", placeholder: "Emoções e expectativas", obrigatoria: false, ordem: 3 },
          { texto: "Qual é a importância da fé na família?", tipo_resposta: "texto_longo", placeholder: "Papel da religião na criação", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Tradições e Celebração",
        descricao: "Tradições familiares e religiosas",
        ordem: 3,
        questions: [
          { texto: "Há alguma tradição familiar para batizados?", tipo_resposta: "texto_longo", placeholder: "Rituais, costumes da família", obrigatoria: false, ordem: 1 },
          { texto: "Qual é o estilo de celebração desejado?", tipo_resposta: "texto_longo", placeholder: "Íntima, festiva, tradicional", obrigatoria: false, ordem: 2 },
          { texto: "Há algum elemento especial para incluir na cerimônia?", tipo_resposta: "texto_longo", placeholder: "Músicas, leituras, símbolos", obrigatoria: false, ordem: 3 },
          { texto: "Como vocês esperam que este dia seja lembrado?", tipo_resposta: "texto_longo", placeholder: "Expectativas e desejos", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Crisma': {
    sections: [
      {
        titulo: "Preparação Espiritual",
        descricao: "Caminho de fé e preparação para o sacramento",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome completo do crismando?", tipo_resposta: "texto_curto", placeholder: "Nome completo", obrigatoria: true, ordem: 1 },
          { texto: "Qual idade tem o crismando?", tipo_resposta: "numero", placeholder: "Idade", obrigatoria: true, ordem: 2 },
          { texto: "Como foi o processo de preparação para a Crisma?", tipo_resposta: "texto_longo", placeholder: "Catequese, estudos, reflexões", obrigatoria: false, ordem: 3 },
          { texto: "O que a fé significa na vida do crismando?", tipo_resposta: "texto_longo", placeholder: "Importância da espiritualidade", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Escolha de Padrinhos",
        descricao: "Padrinhos escolhidos para acompanhar na fé",
        ordem: 2,
        questions: [
          { texto: "Quem são os padrinhos de Crisma escolhidos?", tipo_resposta: "texto_longo", placeholder: "Nomes e relação com o crismando", obrigatoria: true, ordem: 1 },
          { texto: "Por que foram escolhidos estes padrinhos?", tipo_resposta: "texto_longo", placeholder: "Motivos da escolha, qualidades", obrigatoria: false, ordem: 2 },
          { texto: "Como os padrinhos influenciam a vida espiritual?", tipo_resposta: "texto_longo", placeholder: "Papel na formação da fé", obrigatoria: false, ordem: 3 },
          { texto: "Qual nome de Crisma foi escolhido e por quê?", tipo_resposta: "texto_longo", placeholder: "Santo escolhido e motivação", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Significado da Confirmação",
        descricao: "O que representa este sacramento",
        ordem: 3,
        questions: [
          { texto: "O que a Crisma representa para o crismando?", tipo_resposta: "texto_longo", placeholder: "Significado pessoal do sacramento", obrigatoria: false, ordem: 1 },
          { texto: "Como a família vê este momento?", tipo_resposta: "texto_longo", placeholder: "Importância para a família", obrigatoria: false, ordem: 2 },
          { texto: "Quais são os compromissos assumidos?", tipo_resposta: "texto_longo", placeholder: "Responsabilidades como cristão", obrigatoria: false, ordem: 3 },
          { texto: "Como esperam celebrar este dia especial?", tipo_resposta: "texto_longo", placeholder: "Forma de celebração desejada", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Primeira Comunhão': {
    sections: [
      {
        titulo: "Preparação Espiritual",
        descricao: "Caminho de fé até a Primeira Comunhão",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome completo da criança?", tipo_resposta: "texto_curto", placeholder: "Nome completo", obrigatoria: true, ordem: 1 },
          { texto: "Qual idade tem a criança?", tipo_resposta: "numero", placeholder: "Idade", obrigatoria: true, ordem: 2 },
          { texto: "Como foi a preparação na catequese?", tipo_resposta: "texto_longo", placeholder: "Experiência na preparação", obrigatoria: false, ordem: 3 },
          { texto: "O que a criança mais aprendeu sobre Jesus?", tipo_resposta: "texto_longo", placeholder: "Aprendizados importantes", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Significado Espiritual",
        descricao: "O que representa receber Jesus",
        ordem: 2,
        questions: [
          { texto: "O que significa receber Jesus na Eucaristia?", tipo_resposta: "texto_longo", placeholder: "Entendimento da criança", obrigatoria: false, ordem: 1 },
          { texto: "Como a família vive a fé no dia a dia?", tipo_resposta: "texto_longo", placeholder: "Práticas familiares de fé", obrigatoria: false, ordem: 2 },
          { texto: "Qual é a oração favorita da criança?", tipo_resposta: "texto_longo", placeholder: "Orações que mais gosta", obrigatoria: false, ordem: 3 },
          { texto: "Como este momento é especial para a família?", tipo_resposta: "texto_longo", placeholder: "Importância familiar do sacramento", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Celebração Familiar",
        descricao: "Como a família celebra este momento",
        ordem: 3,
        questions: [
          { texto: "Quem são os padrinhos de Primeira Comunhão?", tipo_resposta: "texto_longo", placeholder: "Padrinhos escolhidos", obrigatoria: false, ordem: 1 },
          { texto: "Há alguma tradição familiar para este dia?", tipo_resposta: "texto_longo", placeholder: "Costumes familiares", obrigatoria: false, ordem: 2 },
          { texto: "Como gostariam de celebrar após a cerimônia?", tipo_resposta: "texto_longo", placeholder: "Tipo de celebração", obrigatoria: false, ordem: 3 },
          { texto: "O que esperam que a criança lembre deste dia?", tipo_resposta: "texto_longo", placeholder: "Memórias importantes", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  }
};
