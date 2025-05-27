
export interface QuestionSection {
  id: string
  title: string
  range: [number, number]
  questions: string[]
}

export const questionarioSections: QuestionSection[] = [
  {
    id: 'casal',
    title: 'Sobre o Casal',
    range: [0, 10],
    questions: [
      "Como se conheceram?",
      "Foi atração imediata?",
      "Há quanto tempo estão juntos? (namoro, noivado, morando juntos...)",
      "O que mais chamou sua atenção nele(a) quando se conheceram?",
      "O que te fez escolher ele(a) entre tantas pessoas no mundo?",
      "Sobre a admiração que sente por ele(a):",
      "Quais os maiores desafios que já enfrentaram (se houver)?",
      "Quais as maiores alegrias até hoje?",
      "Momento inesquecível do início do namoro:",
      "Melhor surpresa que já fez e a que recebeu:",
      "A declaração de amor inesquecível (com data e local):"
    ]
  },
  {
    id: 'familia',
    title: 'Família e Relacionamento',
    range: [11, 19],
    questions: [
      "Qual o papel de Deus na relação de vocês?",
      "Praticam alguma religião?",
      "Como é sua convivência com sua família?",
      "E com a família dele(a)?",
      "Seus pais estão vivos e casados?",
      "Alguma viagem inesquecível? Qual e por quê?",
      "O que significa casamento para você?",
      "O que significa formar uma família?",
      "O que vocês mais gostam de fazer juntos?"
    ]
  },
  {
    id: 'vida-comum',
    title: 'Vida em Comum',
    range: [20, 29],
    questions: [
      "O que a pandemia mudou na vida ou nos planos de vocês?",
      "Ele(a) te colocou algum apelido? Qual?",
      "Quem é o mais amoroso?",
      "Como é seu jeito de ser?",
      "Como é o jeito de ser dele(a)?",
      "Possuem algum animal de estimação? Qual?",
      "Vocês se consideram parecidos? De que maneira?",
      "Como você enxerga vocês enquanto casal?",
      "Você prefere praia ou montanha?",
      "Qual música marcou a relação de vocês?"
    ]
  },
  {
    id: 'cerimonia',
    title: 'Cerimônia e Detalhes',
    range: [30, 39],
    questions: [
      "O que mais deseja em sua cerimônia?",
      "Sua cor preferida:",
      "Você cozinha? Se sim, o que ele(a) mais gosta que você faça?",
      "Alguma mania dele(a) que te tira do sério?",
      "E aquele jeitinho dele(a) que te mantém apaixonado(a) até hoje...",
      "As principais qualidades dele(a):",
      "Quais sonhos vocês sonham juntos?",
      "Sobre sentir saudade dele(a):",
      "Quem é o primeiro a estender a mão após uma discussão?",
      "Qual seu pedido para o futuro?"
    ]
  },
  {
    id: 'curiosidades',
    title: 'Curiosidades e Preferências',
    range: [40, 47],
    questions: [
      "Desejam ter filhos ou já têm? (Se sim, quantos e nomes)",
      "Pretendem se casar no civil? Quando?",
      "Quantos casais de padrinhos terão no total?",
      "Quem levará as alianças? (Nome, idade e parentesco)",
      "Desejam alguma entrada diferente (Bíblia, Espírito Santo, etc)?",
      "Já escolheram as músicas da cerimônia? Quais?",
      "Algum detalhe, curiosidade ou fato importante sobre o relacionamento?",
      "Algo que vocês não querem de jeito nenhum na cerimônia?"
    ]
  }
]

export const getAllQuestions = (): string[] => {
  return questionarioSections.flatMap(section => section.questions)
}

export const getSectionByQuestionIndex = (index: number): QuestionSection | undefined => {
  return questionarioSections.find(section => 
    index >= section.range[0] && index <= section.range[1]
  )
}
