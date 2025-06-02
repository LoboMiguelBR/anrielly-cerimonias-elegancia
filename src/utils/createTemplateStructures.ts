
import { supabase } from '@/integrations/supabase/client';

interface TemplateStructure {
  sections: {
    titulo: string;
    descricao: string;
    ordem: number;
    questions: {
      texto: string;
      tipo_resposta: string;
      placeholder?: string;
      obrigatoria: boolean;
      ordem: number;
    }[];
  }[];
}

const templateStructures: Record<string, TemplateStructure> = {
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
  },

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

export async function createTemplateStructures() {
  try {
    console.log('Iniciando criação das estruturas de templates...');
    
    // Buscar todos os templates
    const { data: templates, error: templatesError } = await supabase
      .from('questionario_templates')
      .select('*');
    
    if (templatesError) throw templatesError;
    
    for (const template of templates) {
      const structure = templateStructures[template.tipo_evento];
      if (!structure) {
        console.log(`Estrutura não encontrada para tipo: ${template.tipo_evento}`);
        continue;
      }
      
      console.log(`Criando estrutura para template: ${template.nome}`);
      
      // Verificar se já existem seções para este template
      const { data: existingSections } = await supabase
        .from('questionario_template_secoes')
        .select('id')
        .eq('template_id', template.id)
        .limit(1);
      
      if (existingSections && existingSections.length > 0) {
        console.log(`Template ${template.nome} já possui estrutura, pulando...`);
        continue;
      }
      
      // Criar seções
      for (const section of structure.sections) {
        const { data: newSection, error: sectionError } = await supabase
          .from('questionario_template_secoes')
          .insert({
            template_id: template.id,
            titulo: section.titulo,
            descricao: section.descricao,
            ordem: section.ordem,
            ativo: true
          })
          .select()
          .single();
        
        if (sectionError) throw sectionError;
        
        // Criar perguntas para a seção
        for (const question of section.questions) {
          const { error: questionError } = await supabase
            .from('questionario_template_perguntas')
            .insert({
              template_id: template.id,
              secao_id: newSection.id,
              texto: question.texto,
              tipo_resposta: question.tipo_resposta,
              placeholder: question.placeholder,
              obrigatoria: question.obrigatoria,
              ordem: question.ordem,
              ativo: true
            });
          
          if (questionError) throw questionError;
        }
      }
      
      console.log(`Estrutura criada para template: ${template.nome}`);
    }
    
    console.log('Criação das estruturas concluída!');
    return true;
  } catch (error) {
    console.error('Erro ao criar estruturas de templates:', error);
    throw error;
  }
}
