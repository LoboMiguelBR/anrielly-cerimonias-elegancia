
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  action: 'login' | 'register'
  email: string
  senha: string
  nomeResponsavel?: string
  linkPublico: string
}

serve(async (req) => {
  console.log('🚀 Função questionario-auth iniciada')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let requestData: AuthRequest
    try {
      requestData = await req.json() as AuthRequest
    } catch (error) {
      console.error('❌ Erro ao parsear JSON da requisição:', error)
      return new Response(
        JSON.stringify({ error: 'Dados da requisição inválidos' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const { action, email, senha, nomeResponsavel, linkPublico } = requestData

    console.log('📝 Dados recebidos:', { action, email, linkPublico, nomeResponsavel: !!nomeResponsavel })

    // Validações básicas
    if (!action || !email || !senha || !linkPublico) {
      console.error('❌ Dados obrigatórios faltando')
      return new Response(
        JSON.stringify({ error: 'Dados obrigatórios faltando' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('❌ Email inválido:', email)
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validação de senha
    if (senha.length < 6) {
      console.error('❌ Senha muito curta')
      return new Response(
        JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Hash da senha
    const senhaHash = createHash('sha256').update(senha).digest('hex')

    if (action === 'login') {
      console.log('🔑 Tentativa de login para:', email)
      
      // Verificar se existe uma conta com este email para este questionário
      const { data: contaExistente, error: errorBusca } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .maybeSingle()

      if (errorBusca) {
        console.error('❌ Erro ao buscar conta:', errorBusca)
        return new Response(
          JSON.stringify({ error: 'Erro ao verificar credenciais' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (!contaExistente) {
        console.log('❌ Conta não encontrada para este email e questionário')
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      // Verificar senha
      if (contaExistente.senha_hash !== senhaHash) {
        console.log('❌ Senha incorreta')
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      console.log('✅ Login realizado com sucesso')
      
      return new Response(
        JSON.stringify({
          success: true,
          questionario: {
            id: contaExistente.id,
            nomeResponsavel: contaExistente.nome_responsavel,
            email: contaExistente.email,
            respostasJson: contaExistente.respostas_json || {},
            status: contaExistente.status
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'register') {
      console.log('📝 Tentativa de registro para:', email, 'nome:', nomeResponsavel)
      
      if (!nomeResponsavel || nomeResponsavel.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Nome é obrigatório' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Verificar se já existe uma conta com este email para este questionário
      const { data: contaExistente, error: errorBuscaExistente } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .maybeSingle()

      if (errorBuscaExistente) {
        console.error('❌ Erro ao verificar conta existente:', errorBuscaExistente)
        return new Response(
          JSON.stringify({ error: 'Erro ao verificar dados' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (contaExistente) {
        console.log('❌ Já existe uma conta com este email para este questionário')
        return new Response(
          JSON.stringify({ error: 'Já existe uma conta com este email para este questionário' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        )
      }

      // Verificar se existe um questionário placeholder para este link
      const { data: questionarioPlaceholder, error: errorBuscaPlaceholder } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', 'aguardando@preenchimento.com')
        .maybeSingle()

      if (errorBuscaPlaceholder) {
        console.error('❌ Erro ao buscar placeholder:', errorBuscaPlaceholder)
        return new Response(
          JSON.stringify({ error: 'Erro ao verificar questionário' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      let questionarioData

      if (questionarioPlaceholder) {
        // Atualizar o registro placeholder existente
        console.log('🔄 Atualizando registro placeholder existente')
        
        const { data, error } = await supabaseClient
          .from('questionarios_noivos')
          .update({
            nome_responsavel: nomeResponsavel.trim(),
            email: email,
            senha_hash: senhaHash,
            status: 'rascunho',
            respostas_json: {},
            data_atualizacao: new Date().toISOString()
          })
          .eq('id', questionarioPlaceholder.id)
          .select()
          .single()

        if (error) {
          console.error('❌ Erro ao atualizar questionário:', error)
          return new Response(
            JSON.stringify({ error: 'Erro ao criar conta' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }

        questionarioData = data
      } else {
        // Criar novo registro
        console.log('➕ Criando novo registro de questionário')
        
        const { data, error } = await supabaseClient
          .from('questionarios_noivos')
          .insert({
            link_publico: linkPublico,
            nome_responsavel: nomeResponsavel.trim(),
            email: email,
            senha_hash: senhaHash,
            status: 'rascunho',
            respostas_json: {},
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.error('❌ Erro ao criar questionário:', error)
          return new Response(
            JSON.stringify({ error: 'Erro ao criar conta' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }

        questionarioData = data
      }

      console.log('✅ Registro criado/atualizado com sucesso:', questionarioData.id)

      return new Response(
        JSON.stringify({
          success: true,
          questionario: {
            id: questionarioData.id,
            nomeResponsavel: questionarioData.nome_responsavel,
            email: questionarioData.email,
            respostasJson: questionarioData.respostas_json || {},
            status: questionarioData.status
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Ação inválida' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('❌ Erro na função questionario-auth:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
