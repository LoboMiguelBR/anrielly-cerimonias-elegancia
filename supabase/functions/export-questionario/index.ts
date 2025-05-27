
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

    const respostas = questionario.respostas_json || {}
    const dataAtual = new Date().toLocaleDateString('pt-BR')

    if (format === 'txt') {
      // Formato texto simples para base do PDF/Word
      let conteudo = `QUESTIONÁRIO DE NOIVOS\n`
      conteudo += `Anrielly Gomes Cerimonialista\n\n`
      conteudo += `Responsável: ${questionario.nome_responsavel}\n`
      conteudo += `Email: ${questionario.email}\n`
      conteudo += `Status: ${questionario.status}\n`
      conteudo += `Data de Exportação: ${dataAtual}\n`
      conteudo += `Progresso: ${questionario.total_perguntas_resp || 0}/48 perguntas respondidas\n\n`
      conteudo += `${'='.repeat(80)}\n\n`

      perguntas.forEach((pergunta, index) => {
        const resposta = respostas[index] || 'Não respondida'
        conteudo += `${index + 1}. ${pergunta}\n`
        conteudo += `R: ${resposta}\n\n`
      })

      conteudo += `${'='.repeat(80)}\n`
      conteudo += `Questionário exportado em ${dataAtual}\n`
      conteudo += `Anrielly Gomes Cerimonialista`

      return new Response(
        JSON.stringify({ 
          success: true, 
          content: conteudo,
          filename: `questionario_${questionario.nome_responsavel.replace(/\s+/g, '_')}_${Date.now()}.txt`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Formato não suportado' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Erro na exportação:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
