
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
  console.log('Função questionario-auth iniciada')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, email, senha, nomeResponsavel, linkPublico } = await req.json() as AuthRequest

    console.log('Dados recebidos:', { action, email, linkPublico, nomeResponsavel })

    // Verificar se existe um questionário com este link público
    const { data: questionarioExistente, error: errorBusca } = await supabaseClient
      .from('questionarios_noivos')
      .select('*')
      .eq('link_publico', linkPublico)
      .maybeSingle()

    console.log('Questionário existente:', questionarioExistente)
    console.log('Erro na busca:', errorBusca)

    if (errorBusca) {
      console.error('Erro ao buscar questionário:', errorBusca)
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar questionário' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Hash da senha
    const senhaHash = createHash('sha256').update(senha).digest('hex')

    if (action === 'login') {
      console.log('Tentativa de login para:', email)
      
      if (!questionarioExistente) {
        console.log('Questionário não encontrado para login')
        return new Response(
          JSON.stringify({ error: 'Link de questionário não encontrado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Verificar se já existe uma conta com este email para este questionário
      const { data: contaExistente } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .maybeSingle()

      if (!contaExistente) {
        console.log('Conta não encontrada para este email e questionário')
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      // Verificar senha
      if (contaExistente.senha_hash !== senhaHash) {
        console.log('Senha incorreta')
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      console.log('Login realizado com sucesso')
      
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
      console.log('Tentativa de registro para:', email, 'nome:', nomeResponsavel)
      
      if (!nomeResponsavel) {
        return new Response(
          JSON.stringify({ error: 'Nome é obrigatório' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Verificar se já existe uma conta com este email para este questionário
      const { data: contaExistente } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .maybeSingle()

      if (contaExistente) {
        console.log('Já existe uma conta com este email para este questionário')
        return new Response(
          JSON.stringify({ error: 'Já existe uma conta com este email para este questionário' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        )
      }

      let questionarioData

      if (questionarioExistente && questionarioExistente.email === 'aguardando@preenchimento.com') {
        // Atualizar o registro placeholder existente
        console.log('Atualizando registro placeholder existente')
        
        const { data, error } = await supabaseClient
          .from('questionarios_noivos')
          .update({
            nome_responsavel: nomeResponsavel,
            email: email,
            senha_hash: senhaHash,
            status: 'rascunho',
            respostas_json: {}
          })
          .eq('id', questionarioExistente.id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar questionário:', error)
          return new Response(
            JSON.stringify({ error: 'Erro ao criar conta' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }

        questionarioData = data
      } else {
        // Criar novo registro
        console.log('Criando novo registro de questionário')
        
        const { data, error } = await supabaseClient
          .from('questionarios_noivos')
          .insert({
            link_publico: linkPublico,
            nome_responsavel: nomeResponsavel,
            email: email,
            senha_hash: senhaHash,
            status: 'rascunho',
            respostas_json: {}
          })
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar questionário:', error)
          return new Response(
            JSON.stringify({ error: 'Erro ao criar conta' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }

        questionarioData = data
      }

      console.log('Registro criado/atualizado com sucesso:', questionarioData.id)

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
    console.error('Erro na função questionario-auth:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
