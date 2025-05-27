
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

  // Função para adicionar nova página se necessário
  const checkPageBreak = (neededHeight: number) => {
    if (yPosition + neededHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Função para quebrar texto longo
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

  return doc.output('arraybuffer')
}

// Função para gerar Word
async function generateWord(questionario: any) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('https://esm.sh/docx@8.2.2')
  
  const respostas = questionario.respostas_json || {}
  const dataAtual = new Date().toLocaleDateString('pt-BR')

  const children = [
    // Cabeçalho
    new Paragraph({
      children: [
        new TextRun({
          text: "QUESTIONÁRIO DE NOIVOS",
          bold: true,
          size: 32,
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Anrielly Gomes Cerimonialista",
          size: 24,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // Dados do responsável
    new Paragraph({
      children: [
        new TextRun({
          text: "DADOS DO RESPONSÁVEL",
          bold: true,
          size: 24,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Nome: ${questionario.nome_responsavel}`,
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Email: ${questionario.email}`,
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Status: ${questionario.status}`,
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Data de Exportação: ${dataAtual}`,
          size: 20,
        }),
      ],
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Progresso: ${questionario.total_perguntas_resp || 0}/48 perguntas respondidas`,
          size: 20,
        }),
      ],
      spacing: { after: 400 },
    }),

    // Perguntas e respostas
    new Paragraph({
      children: [
        new TextRun({
          text: "PERGUNTAS E RESPOSTAS",
          bold: true,
          size: 24,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
  ]

  // Adicionar perguntas e respostas
  perguntas.forEach((pergunta, index) => {
    const resposta = respostas[index] || 'Não respondida'
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${pergunta}`,
            bold: true,
            size: 20,
          }),
        ],
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `R: ${resposta}`,
            size: 18,
          }),
        ],
        spacing: { after: 200 },
      })
    )
  })

  // Rodapé
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Questionário exportado em ${dataAtual}`,
          italics: true,
          size: 16,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Anrielly Gomes Cerimonialista",
          bold: true,
          size: 16,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Tel: (11) 99999-9999 | Email: contato@anriellygomes.com.br",
          size: 14,
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

  return await Packer.toBuffer(doc)
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

    // Buscar questionário
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

    const nomeArquivo = `questionario_${questionario.nome_responsavel.replace(/\s+/g, '_')}_${Date.now()}`

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
      console.log('Gerando Word...')
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
      // Manter funcionalidade existente para TXT
      let conteudo = `QUESTIONÁRIO DE NOIVOS\n`
      conteudo += `Anrielly Gomes Cerimonialista\n\n`
      conteudo += `Responsável: ${questionario.nome_responsavel}\n`
      conteudo += `Email: ${questionario.email}\n`
      conteudo += `Status: ${questionario.status}\n`
      conteudo += `Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}\n`
      conteudo += `Progresso: ${questionario.total_perguntas_resp || 0}/48 perguntas respondidas\n\n`
      conteudo += `${'='.repeat(80)}\n\n`

      const respostas = questionario.respostas_json || {}
      perguntas.forEach((pergunta, index) => {
        const resposta = respostas[index] || 'Não respondida'
        conteudo += `${index + 1}. ${pergunta}\n`
        conteudo += `R: ${resposta}\n\n`
      })

      conteudo += `${'='.repeat(80)}\n`
      conteudo += `Questionário exportado em ${new Date().toLocaleDateString('pt-BR')}\n`
      conteudo += `Anrielly Gomes Cerimonialista`

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
