
import { TemplateStructures } from './types';

export const relationshipEventsTemplates: TemplateStructures = {
  'Casamento': {
    sections: [
      {
        titulo: "Informações do Casal",
        descricao: "Dados básicos sobre os noivos",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome completo da noiva?", tipo_resposta: "texto_curto", placeholder: "Nome completo", obrigatoria: true, ordem: 1 },
          { texto: "Qual é o nome completo do noivo?", tipo_resposta: "texto_curto", placeholder: "Nome completo", obrigatoria: true, ordem: 2 },
          { texto: "Há quanto tempo vocês estão juntos?", tipo_resposta: "texto_curto", placeholder: "Ex: 5 anos", obrigatoria: true, ordem: 3 },
          { texto: "Como vocês se conheceram?", tipo_resposta: "texto_longo", placeholder: "Conte a história de como se conheceram", obrigatoria: true, ordem: 4 }
        ]
      },
      {
        titulo: "História do Relacionamento",
        descricao: "Momentos especiais e marcos do relacionamento",
        ordem: 2,
        questions: [
          { texto: "Qual foi o primeiro encontro de vocês?", tipo_resposta: "texto_longo", placeholder: "Descreva como foi", obrigatoria: false, ordem: 1 },
          { texto: "Quando e como foi o pedido de casamento?", tipo_resposta: "texto_longo", placeholder: "Conte todos os detalhes", obrigatoria: true, ordem: 2 },
          { texto: "Qual é a música que representa o relacionamento de vocês?", tipo_resposta: "texto_curto", placeholder: "Nome da música e artista", obrigatoria: false, ordem: 3 },
          { texto: "Vocês têm alguma tradição especial como casal?", tipo_resposta: "texto_longo", placeholder: "Tradições, rituais ou hábitos especiais", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Cerimônia e Celebração",
        descricao: "Detalhes sobre a cerimônia de casamento",
        ordem: 3,
        questions: [
          { texto: "Qual é o estilo de cerimônia que vocês desejam?", tipo_resposta: "texto_longo", placeholder: "Tradicional, descontraída, íntima, etc.", obrigatoria: true, ordem: 1 },
          { texto: "Vocês têm alguma preferência religiosa para a cerimônia?", tipo_resposta: "texto_longo", placeholder: "Religião, tradições espirituais", obrigatoria: false, ordem: 2 },
          { texto: "Há algum elemento especial que vocês gostariam de incluir?", tipo_resposta: "texto_longo", placeholder: "Rituais, tradições familiares, etc.", obrigatoria: false, ordem: 3 },
          { texto: "Vocês pretendem escrever os próprios votos?", tipo_resposta: "texto_curto", placeholder: "Sim/Não e por quê", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Família e Convidados",
        descricao: "Informações sobre famílias e pessoas especiais",
        ordem: 4,
        questions: [
          { texto: "Quem são os padrinhos e madrinhas?", tipo_resposta: "texto_longo", placeholder: "Nomes e relação com vocês", obrigatoria: true, ordem: 1 },
          { texto: "Há alguma pessoa especial que não estará presente mas gostariam de homenagear?", tipo_resposta: "texto_longo", placeholder: "Familiares falecidos, pessoas importantes", obrigatoria: false, ordem: 2 },
          { texto: "Qual é a importância da família para vocês?", tipo_resposta: "texto_longo", placeholder: "Como a família influencia o relacionamento", obrigatoria: false, ordem: 3 },
          { texto: "Há alguma tradição familiar que gostariam de incluir?", tipo_resposta: "texto_longo", placeholder: "Tradições das famílias dos noivos", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Noivado': {
    sections: [
      {
        titulo: "História do Relacionamento",
        descricao: "Como chegaram até este momento",
        ordem: 1,
        questions: [
          { texto: "Há quanto tempo vocês estão juntos?", tipo_resposta: "texto_curto", placeholder: "Tempo de relacionamento", obrigatoria: true, ordem: 1 },
          { texto: "Como foi o pedido de noivado?", tipo_resposta: "texto_longo", placeholder: "Detalhes do momento especial", obrigatoria: true, ordem: 2 },
          { texto: "O que os fez ter certeza de que eram um para o outro?", tipo_resposta: "texto_longo", placeholder: "Momento da decisão", obrigatoria: false, ordem: 3 },
          { texto: "Qual é a coisa que mais admiram um no outro?", tipo_resposta: "texto_longo", placeholder: "Qualidades especiais", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Planos para o Futuro",
        descricao: "Sonhos e expectativas como casal",
        ordem: 2,
        questions: [
          { texto: "Quando pretendem se casar?", tipo_resposta: "texto_curto", placeholder: "Data ou período planejado", obrigatoria: false, ordem: 1 },
          { texto: "Como imaginam que será o casamento de vocês?", tipo_resposta: "texto_longo", placeholder: "Estilo, tamanho, características", obrigatoria: false, ordem: 2 },
          { texto: "Quais são os sonhos de vocês como casal?", tipo_resposta: "texto_longo", placeholder: "Planos, objetivos juntos", obrigatoria: false, ordem: 3 },
          { texto: "Onde gostariam de construir sua vida juntos?", tipo_resposta: "texto_longo", placeholder: "Local, estilo de vida", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Família e Amigos",
        descricao: "Pessoas importantes nesta jornada",
        ordem: 3,
        questions: [
          { texto: "Como as famílias reagiram ao noivado?", tipo_resposta: "texto_longo", placeholder: "Reação de pais e familiares", obrigatoria: false, ordem: 1 },
          { texto: "Quem são as pessoas mais importantes para vocês?", tipo_resposta: "texto_longo", placeholder: "Amigos e familiares especiais", obrigatoria: false, ordem: 2 },
          { texto: "Como gostariam de celebrar este noivado?", tipo_resposta: "texto_longo", placeholder: "Tipo de festa ou celebração", obrigatoria: false, ordem: 3 },
          { texto: "Há alguma tradição familiar que querem incluir?", tipo_resposta: "texto_longo", placeholder: "Costumes das famílias", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Bodas': {
    sections: [
      {
        titulo: "Celebração do Tempo Juntos",
        descricao: "Marcos e conquistas ao longo dos anos",
        ordem: 1,
        questions: [
          { texto: "Quantos anos de casamento vocês estão celebrando?", tipo_resposta: "numero", placeholder: "Número de anos", obrigatoria: true, ordem: 1 },
          { texto: "Qual é o tipo de bodas (material)?", tipo_resposta: "texto_curto", placeholder: "Ex: Prata, Ouro, Diamante", obrigatoria: true, ordem: 2 },
          { texto: "O que vocês mais valorizam nestes anos juntos?", tipo_resposta: "texto_longo", placeholder: "Momentos, conquistas, aprendizados", obrigatoria: true, ordem: 3 },
          { texto: "Qual foi o maior desafio superado como casal?", tipo_resposta: "texto_longo", placeholder: "Como superaram juntos", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Marcos do Relacionamento",
        descricao: "Momentos especiais ao longo dos anos",
        ordem: 2,
        questions: [
          { texto: "Qual foi o momento mais marcante destes anos?", tipo_resposta: "texto_longo", placeholder: "Momento especial que ficou na memória", obrigatoria: false, ordem: 1 },
          { texto: "Como vocês mudaram como casal ao longo do tempo?", tipo_resposta: "texto_longo", placeholder: "Evolução do relacionamento", obrigatoria: false, ordem: 2 },
          { texto: "Quais tradições vocês criaram como família?", tipo_resposta: "texto_longo", placeholder: "Rituais, costumes únicos do casal", obrigatoria: false, ordem: 3 },
          { texto: "O que vocês mais esperam dos próximos anos?", tipo_resposta: "texto_longo", placeholder: "Planos e sonhos futuros", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Família Atual",
        descricao: "A família que construíram juntos",
        ordem: 3,
        questions: [
          { texto: "Como está a família de vocês hoje?", tipo_resposta: "texto_longo", placeholder: "Filhos, netos, composição familiar", obrigatoria: false, ordem: 1 },
          { texto: "Qual é o legado que vocês querem deixar?", tipo_resposta: "texto_longo", placeholder: "Valores, ensinamentos", obrigatoria: false, ordem: 2 },
          { texto: "Como gostariam de celebrar esta data especial?", tipo_resposta: "texto_longo", placeholder: "Estilo de celebração desejado", obrigatoria: false, ordem: 3 },
          { texto: "Há alguma pessoa especial que gostariam de homenagear?", tipo_resposta: "texto_longo", placeholder: "Familiares, amigos importantes", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Renovação de Votos': {
    sections: [
      {
        titulo: "Motivos para Renovar",
        descricao: "Por que escolheram renovar os votos",
        ordem: 1,
        questions: [
          { texto: "Quantos anos de casamento vocês têm?", tipo_resposta: "numero", placeholder: "Anos de casamento", obrigatoria: true, ordem: 1 },
          { texto: "O que os motivou a renovar os votos?", tipo_resposta: "texto_longo", placeholder: "Razões para esta decisão", obrigatoria: true, ordem: 2 },
          { texto: "Como o amor de vocês evoluiu ao longo dos anos?", tipo_resposta: "texto_longo", placeholder: "Mudanças no relacionamento", obrigatoria: false, ordem: 3 },
          { texto: "O que querem prometer um ao outro agora?", tipo_resposta: "texto_longo", placeholder: "Novos votos, compromissos", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "História do Casamento",
        descricao: "Jornada percorrida juntos",
        ordem: 2,
        questions: [
          { texto: "Como foi o primeiro casamento de vocês?", tipo_resposta: "texto_longo", placeholder: "Lembranças do casamento original", obrigatoria: false, ordem: 1 },
          { texto: "Qual foi o momento mais desafiador que superaram?", tipo_resposta: "texto_longo", placeholder: "Dificuldades vencidas juntos", obrigatoria: false, ordem: 2 },
          { texto: "Quais foram as maiores alegrias compartilhadas?", tipo_resposta: "texto_longo", placeholder: "Momentos especiais, conquistas", obrigatoria: false, ordem: 3 },
          { texto: "Como vocês cresceram como casal?", tipo_resposta: "texto_longo", placeholder: "Aprendizados, crescimento", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Família e Futuro",
        descricao: "A família de hoje e planos futuros",
        ordem: 3,
        questions: [
          { texto: "Como está a família de vocês hoje?", tipo_resposta: "texto_longo", placeholder: "Filhos, netos, composição atual", obrigatoria: false, ordem: 1 },
          { texto: "O que mais valorizam na vida que construíram?", tipo_resposta: "texto_longo", placeholder: "Conquistas, valores", obrigatoria: false, ordem: 2 },
          { texto: "Quais são os sonhos para os próximos anos?", tipo_resposta: "texto_longo", placeholder: "Planos futuros", obrigatoria: false, ordem: 3 },
          { texto: "Como gostariam de celebrar esta renovação?", tipo_resposta: "texto_longo", placeholder: "Estilo de cerimônia desejado", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  }
};
