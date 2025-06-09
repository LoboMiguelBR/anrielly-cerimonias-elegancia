import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const perguntas = [
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
  "A declaração de amor inesquecível (com data e local):",
  "Qual o papel de Deus na relação de vocês?",
  "Praticam alguma religião?",
  "Como é sua convivência com sua família?",
  "E com a família dele(a)?",
  "Seus pais estão vivos e casados?",
  "Alguma viagem inesquecível? Qual e por quê?",
  "O que significa casamento para você?",
  "O que significa formar uma família?",
  "O que vocês mais gostam de fazer juntos?",
  "O que a pandemia mudou na vida ou nos planos de vocês?",
  "Ele(a) te colocou algum apelido? Qual?",
  "Quem é o mais amoroso?",
  "Como é seu jeito de ser?",
  "Como é o jeito de ser dele(a)?",
  "Possuem algum animal de estimação? Qual?",
  "Vocês se consideram parecidos? De que maneira?",
  "Como você enxerga vocês enquanto casal?",
  "Você prefere praia ou montanha?",
  "Qual música marcou a relação de vocês?",
  "O que mais deseja em sua cerimônia?",
  "Sua cor preferida:",
  "Você cozinha? Se sim, o que ele(a) mais gosta que você faça?",
  "Alguma mania dele(a) que te tira do sério?",
  "E aquele jeitinho dele(a) que te mantém apaixonado(a) até hoje...",
  "As principais qualidades dele(a):",
  "Quais sonhos vocês sonham juntos?",
  "Sobre sentir saudade dele(a):",
  "Quem é o primeiro a estender a mão após uma discussão?",
  "Qual seu pedido para o futuro?",
  "Desejam ter filhos ou já têm? (Se sim, quantos e nomes)",
  "Pretendem se casar no civil? Quando?",
  "Quantos casais de padrinhos terão no total?",
  "Quem levará as alianças? (Nome, idade e parentesco)",
  "Desejam alguma entrada diferente (Bíblia, Espírito Santo, etc)?",
  "Já escolheram as músicas da cerimônia? Quais?",
  "Algum detalhe, curiosidade ou fato importante sobre o relacionamento?",
  "Algo que vocês não querem de jeito nenhum na cerimônia?"
]

// Função para gerar PDF
async function generatePDF(questionario: any) {
  const { jsPDF } = await import('https://esm.sh/jspdf@2.5.1')
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  let yPosition = margin

  const checkPageBreak = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  const splitText = (text: string, maxWidth: number) => {
    return doc.splitTextToSize(text, maxWidth)
  }

  // Cabeçalho
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text('QUESTIONÁRIO DE NOIVOS', pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 10
  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text('Anrielly Gomes Cerimonialista', pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 20

  // Dados do casal
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text('DADOS DO RESPONSÁVEL:', margin, yPosition)
  yPosition += 8

  doc.setFont("helvetica", "normal")
  doc.text(`Nome: ${questionario.nome_responsavel}`, margin, yPosition)
  yPosition += 6
  doc.text(`Email: ${questionario.email}`, margin, yPosition)
  yPosition += 6
  doc.text(`Status: ${questionario.status}`, margin, yPosition)
  yPosition += 6

  const dataAtual = new Date().toLocaleDateString('pt-BR')
  doc.text(`Data de Exportação: ${dataAtual}`, margin, yPosition)
  yPosition += 6
  doc.text(`Progresso: ${questionario.total_perguntas_resp || 0}/48 perguntas respondidas`, margin, yPosition)
  yPosition += 15

  // Linha separadora
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 15

  // Perguntas e respostas
  const respostas = questionario.respostas_json || {}
  
  perguntas.forEach((pergunta, index) => {
    checkPageBreak(30)
    
    // Pergunta
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    const perguntaText = `${index + 1}. ${pergunta}`
    const perguntaLines = splitText(perguntaText, pageWidth - 2 * margin)
    doc.text(perguntaLines, margin, yPosition)
    yPosition += perguntaLines.length * 5 + 3

    // Resposta
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const resposta = respostas[index] || 'Não respondida'
    const respostaLines = splitText(`R: ${resposta}`, pageWidth - 2 * margin)
    
    checkPageBreak(respostaLines.length * 4 + 8)
    doc.text(respostaLines, margin, yPosition)
    yPosition += respostaLines.length * 4 + 8
  })

  // Rodapé final
  checkPageBreak(20)
  yPosition += 10
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  doc.setFont("helvetica", "italic")
  doc.setFontSize(9)
  doc.text(`Questionário exportado em ${dataAtual}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 5
  doc.text('Anrielly Gomes Cerimonialista', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 4
  doc.text('Tel: (11) 99999-9999 | Email: contato@anriellygomes.com.br', pageWidth / 2, yPosition, { align: 'center' })

  return new Uint8Array(doc.output('arraybuffer'))
}

// Função para gerar Word com identidade visual
async function generateWord(questionario: any) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } = await import('https://esm.sh/docx@8.2.2')
  
  const respostas = questionario.respostas_json || {}
  const dataAtual = new Date().toLocaleDateString('pt-BR')
  const nomeArquivo = `questionario-${questionario.nome_responsavel.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`

  const children = [
    // Cabeçalho com identidade visual
    new Paragraph({
      children: [
        new TextRun({
          text: "QUESTIONÁRIO DE CELEBRAÇÃO DO AMOR",
          bold: true,
          size: 48,
          color: "d9534f",
          font: "Playfair Display",
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Preenchido por: ${questionario.nome_responsavel}`,
          size: 32,
          color: "555555",
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),

    // Linha divisória
    new Paragraph({
      children: [
        new TextRun({
          text: "━".repeat(50),
          color: "d9534f",
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // Dados do responsável
    new Paragraph({
      children: [
        new TextRun({
          text: "INFORMAÇÕES DO RESPONSÁVEL",
          bold: true,
          size: 28,
          color: "d9534f",
          font: "Playfair Display",
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Nome: `,
          bold: true,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
        new TextRun({
          text: questionario.nome_responsavel,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Email: `,
          bold: true,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
        new TextRun({
          text: questionario.email,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Status: `,
          bold: true,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
        new TextRun({
          text: questionario.status,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Data de Exportação: `,
          bold: true,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
        new TextRun({
          text: dataAtual,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Progresso: `,
          bold: true,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
        new TextRun({
          text: `${questionario.total_perguntas_resp || 0}/48 perguntas respondidas`,
          size: 24,
          color: "555555",
          font: "Arial",
        }),
      ],
      spacing: { after: 400 },
    }),

    // Linha divisória antes das perguntas
    new Paragraph({
      children: [
        new TextRun({
          text: "━".repeat(50),
          color: "d9534f",
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "PERGUNTAS E RESPOSTAS",
          bold: true,
          size: 28,
          color: "d9534f",
          font: "Playfair Display",
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 },
    }),
  ]

  perguntas.forEach((pergunta, index) => {
    const resposta = respostas[index] || 'Resposta não informada.'
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${pergunta}`,
            bold: true,
            size: 26,
            color: "555555",
            font: "Arial",
          }),
        ],
        spacing: { before: 300, after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Resposta: ${resposta}`,
            size: 24,
            color: "555555",
            font: "Arial",
          }),
        ],
        spacing: { after: 250 },
      }),
      // Linha sutil entre perguntas
      new Paragraph({
        children: [
          new TextRun({
            text: "─".repeat(30),
            color: "cccccc",
            size: 16,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    )
  })

  // Rodapé final
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "━".repeat(50),
          color: "d9534f",
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Documento gerado automaticamente pelo sistema Anrielly Gomes Cerimonialista.",
          italics: true,
          size: 20,
          color: "888888",
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Gerado em: ${dataAtual}`,
          italics: true,
          size: 18,
          color: "888888",
          font: "Arial",
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  )

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  })

  return new Uint8Array(await Packer.toBuffer(doc))
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { questionarioId, format } = await req.json()

    if (!questionarioId || !format) {
      return new Response(
        JSON.stringify({ error: 'questionarioId e format são obrigatórios' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const { data: questionario, error } = await supabaseClient
      .from('questionarios_noivos')
      .select('*')
      .eq('id', questionarioId)
      .single()

    if (error || !questionario) {
      return new Response(
        JSON.stringify({ error: 'Questionário não encontrado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const dataAtual = new Date().toISOString().split('T')[0]
    const nomeArquivo = `questionario-${questionario.nome_responsavel.replace(/\s+/g, '-').toLowerCase()}-${dataAtual}`

    if (format === 'pdf') {
      console.log('Gerando PDF...')
      const pdfBuffer = await generatePDF(questionario)
      
      return new Response(pdfBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${nomeArquivo}.pdf"`,
        },
      })
    }

    if (format === 'word') {
      console.log('Gerando Word com identidade visual...')
      const wordBuffer = await generateWord(questionario)
      
      return new Response(wordBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${nomeArquivo}.docx"`,
        },
      })
    }

    if (format === 'txt') {
      let conteudo = `QUESTIONÁRIO DE CELEBRAÇÃO DO AMOR\n`
      conteudo += `Anrielly Gomes Cerimonialista\n\n`
      conteudo += `Preenchido por: ${questionario.nome_responsavel}\n`
      conteudo += `Email: ${questionario.email}\n`
      conteudo += `Status: ${questionario.status}\n`
      conteudo += `Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}\n`
      conteudo += `Progresso: ${questionario.total_perguntas_resp || 0}/48 perguntas respondidas\n\n`
      conteudo += `${'='.repeat(80)}\n\n`

      const respostas = questionario.respostas_json || {}
      perguntas.forEach((pergunta, index) => {
        const resposta = respostas[index] || 'Resposta não informada.'
        conteudo += `${index + 1}. ${pergunta}\n`
        conteudo += `Resposta: ${resposta}\n\n`
      })

      conteudo += `${'='.repeat(80)}\n`
      conteudo += `Documento gerado automaticamente pelo sistema Anrielly Gomes Cerimonialista.\n`
      conteudo += `Gerado em ${new Date().toLocaleDateString('pt-BR')}`

      return new Response(conteudo, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain;charset=utf-8',
          'Content-Disposition': `attachment; filename="${nomeArquivo}.txt"`,
        },
      })
    }

    return new Response(
      JSON.stringify({ error: 'Formato não suportado. Use: pdf, word ou txt' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Erro na exportação:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
