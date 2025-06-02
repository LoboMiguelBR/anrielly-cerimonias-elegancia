
import { TemplateStructures } from './types';

export const familyEventsTemplates: TemplateStructures = {
  'Aniversário': {
    sections: [
      {
        titulo: "Informações do Aniversariante",
        descricao: "Dados sobre quem está fazendo aniversário",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome completo do aniversariante?", tipo_resposta: "texto_curto", placeholder: "Nome completo", obrigatoria: true, ordem: 1 },
          { texto: "Que idade está completando?", tipo_resposta: "numero", placeholder: "Idade", obrigatoria: true, ordem: 2 },
          { texto: "Quais são os hobbies e interesses?", tipo_resposta: "texto_longo", placeholder: "O que gosta de fazer", obrigatoria: false, ordem: 3 },
          { texto: "Há alguma conquista especial a ser celebrada?", tipo_resposta: "texto_longo", placeholder: "Marcos importantes do último ano", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Celebração",
        descricao: "Como será a festa",
        ordem: 2,
        questions: [
          { texto: "Qual é o tema da festa?", tipo_resposta: "texto_curto", placeholder: "Tema escolhido", obrigatoria: false, ordem: 1 },
          { texto: "Qual é o estilo de celebração desejado?", tipo_resposta: "texto_longo", placeholder: "Íntima, festa grande, surpresa", obrigatoria: false, ordem: 2 },
          { texto: "Há alguma atividade especial planejada?", tipo_resposta: "texto_longo", placeholder: "Jogos, apresentações, surpresas", obrigatoria: false, ordem: 3 },
          { texto: "Qual é a importância desta idade/data?", tipo_resposta: "texto_longo", placeholder: "Por que esta data é especial", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Formatura': {
    sections: [
      {
        titulo: "Informações Acadêmicas",
        descricao: "Dados sobre o curso e formação",
        ordem: 1,
        questions: [
          { texto: "Qual é o curso de formação?", tipo_resposta: "texto_curto", placeholder: "Nome do curso", obrigatoria: true, ordem: 1 },
          { texto: "Qual é o nome da instituição?", tipo_resposta: "texto_curto", placeholder: "Nome da escola/universidade", obrigatoria: true, ordem: 2 },
          { texto: "Qual foi a duração do curso?", tipo_resposta: "texto_curto", placeholder: "Tempo de estudo", obrigatoria: false, ordem: 3 },
          { texto: "Houve algum momento marcante durante o curso?", tipo_resposta: "texto_longo", placeholder: "Experiências especiais", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Conquistas e Futuro",
        descricao: "Realizações e planos futuros",
        ordem: 2,
        questions: [
          { texto: "Quais foram as principais conquistas?", tipo_resposta: "texto_longo", placeholder: "Prêmios, reconhecimentos, aprendizados", obrigatoria: false, ordem: 1 },
          { texto: "Quais são os planos para o futuro?", tipo_resposta: "texto_longo", placeholder: "Carreira, pós-graduação, projetos", obrigatoria: false, ordem: 2 },
          { texto: "Quem foram as pessoas importantes nesta jornada?", tipo_resposta: "texto_longo", placeholder: "Professores, colegas, família", obrigatoria: false, ordem: 3 },
          { texto: "Como esta formação transformou sua vida?", tipo_resposta: "texto_longo", placeholder: "Impactos pessoais e profissionais", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Chá de Bebê': {
    sections: [
      {
        titulo: "Expectativas dos Pais",
        descricao: "Sentimentos e preparação para a chegada do bebê",
        ordem: 1,
        questions: [
          { texto: "Qual é o nome escolhido para o bebê?", tipo_resposta: "texto_curto", placeholder: "Nome do bebê", obrigatoria: true, ordem: 1 },
          { texto: "É menino ou menina (ou surpresa)?", tipo_resposta: "texto_curto", placeholder: "Sexo do bebê", obrigatoria: true, ordem: 2 },
          { texto: "Como vocês se sentem com a chegada do bebê?", tipo_resposta: "texto_longo", placeholder: "Emoções, expectativas, medos", obrigatoria: true, ordem: 3 },
          { texto: "O que mais os emociona sobre ser pais?", tipo_resposta: "texto_longo", placeholder: "Aspectos da paternidade/maternidade", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Preparativos e Desejos",
        descricao: "Preparação para receber o bebê",
        ordem: 2,
        questions: [
          { texto: "Como está sendo a preparação do enxoval?", tipo_resposta: "texto_longo", placeholder: "Itens escolhidos, decoração do quarto", obrigatoria: false, ordem: 1 },
          { texto: "Há algum item especial que desejam para o bebê?", tipo_resposta: "texto_longo", placeholder: "Presentes especiais, necessidades", obrigatoria: false, ordem: 2 },
          { texto: "Vocês têm alguma tradição familiar para bebês?", tipo_resposta: "texto_longo", placeholder: "Costumes, rituais familiares", obrigatoria: false, ordem: 3 },
          { texto: "Como imaginam os primeiros dias com o bebê?", tipo_resposta: "texto_longo", placeholder: "Expectativas, planos", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Família e Apoio",
        descricao: "Rede de apoio e família",
        ordem: 3,
        questions: [
          { texto: "Como a família reagiu à notícia da gravidez?", tipo_resposta: "texto_longo", placeholder: "Reações de familiares e amigos", obrigatoria: false, ordem: 1 },
          { texto: "Quem são as pessoas mais importantes neste momento?", tipo_resposta: "texto_longo", placeholder: "Rede de apoio, pessoas especiais", obrigatoria: false, ordem: 2 },
          { texto: "Há avós ou padrinhos já escolhidos?", tipo_resposta: "texto_longo", placeholder: "Família estendida, padrinhos", obrigatoria: false, ordem: 3 },
          { texto: "Como gostariam que este chá fosse lembrado?", tipo_resposta: "texto_longo", placeholder: "Expectativas para a celebração", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  },

  'Chá de Panela': {
    sections: [
      {
        titulo: "Nova Vida a Dois",
        descricao: "Preparação para a vida conjugal",
        ordem: 1,
        questions: [
          { texto: "Quando será o casamento de vocês?", tipo_resposta: "data", obrigatoria: true, ordem: 1 },
          { texto: "Como vocês imaginam a vida de casados?", tipo_resposta: "texto_longo", placeholder: "Expectativas, sonhos para o lar", obrigatoria: true, ordem: 2 },
          { texto: "Vocês já moram juntos ou será o primeiro lar?", tipo_resposta: "texto_curto", placeholder: "Situação atual da moradia", obrigatoria: false, ordem: 3 },
          { texto: "O que mais os emociona sobre montar o lar?", tipo_resposta: "texto_longo", placeholder: "Aspectos especiais de ter sua casa", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Preferências Domésticas",
        descricao: "Estilo e necessidades para o lar",
        ordem: 2,
        questions: [
          { texto: "Qual é o estilo de decoração que vocês preferem?", tipo_resposta: "texto_longo", placeholder: "Moderno, clássico, rústico, etc.", obrigatoria: false, ordem: 1 },
          { texto: "Quais são os itens mais necessários para a casa?", tipo_resposta: "texto_longo", placeholder: "Prioridades para o lar", obrigatoria: true, ordem: 2 },
          { texto: "Vocês gostam de cozinhar? Que tipo de culinária?", tipo_resposta: "texto_longo", placeholder: "Hábitos culinários, preferências", obrigatoria: false, ordem: 3 },
          { texto: "Há alguma cor ou tema preferido para a casa?", tipo_resposta: "texto_curto", placeholder: "Paleta de cores, temática", obrigatoria: false, ordem: 4 }
        ]
      },
      {
        titulo: "Lista de Presentes",
        descricao: "Itens desejados para o novo lar",
        ordem: 3,
        questions: [
          { texto: "Quais eletrodomésticos são mais importantes?", tipo_resposta: "texto_longo", placeholder: "Geladeira, fogão, micro-ondas, etc.", obrigatoria: false, ordem: 1 },
          { texto: "Que itens de cozinha vocês mais precisam?", tipo_resposta: "texto_longo", placeholder: "Panelas, utensílios, louças", obrigatoria: false, ordem: 2 },
          { texto: "Há algum item especial ou sonho para a casa?", tipo_resposta: "texto_longo", placeholder: "Algo especial que desejam muito", obrigatoria: false, ordem: 3 },
          { texto: "Preferem itens práticos ou decorativos?", tipo_resposta: "texto_longo", placeholder: "Tipo de presente que mais valorizam", obrigatoria: false, ordem: 4 }
        ]
      }
    ]
  }
};
