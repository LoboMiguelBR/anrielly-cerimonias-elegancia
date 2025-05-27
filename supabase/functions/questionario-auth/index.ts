
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  email: string
  senha: string
  linkPublico: string
}

interface RegisterRequest {
  email: string
  senha: string
  nomeResponsavel: string
  linkPublico: string
}

serve(async (req) => {
  console.log('Function called with method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Environment check:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseServiceKey 
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables')
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor incompleta' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    let requestData;
    try {
      const body = await req.text()
      console.log('Raw request body:', body)
      requestData = JSON.parse(body)
      console.log('Parsed request data:', { 
        action: requestData.action, 
        hasEmail: !!requestData.email,
        hasLinkPublico: !!requestData.linkPublico 
      })
    } catch (error) {
      console.error('Erro ao parsear JSON:', error)
      return new Response(
        JSON.stringify({ error: 'Dados inválidos no corpo da requisição' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const { action, ...data } = requestData

    if (action === 'login') {
      const { email, senha, linkPublico } = data as LoginRequest
      
      console.log('Login attempt:', { email, linkPublico, hasSenha: !!senha })
      
      if (!email || !senha || !linkPublico) {
        return new Response(
          JSON.stringify({ error: 'Email, senha e link público são obrigatórios' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Verificar se o link público existe
      const { data: linkExists, error: linkError } = await supabaseClient
        .from('questionarios_noivos')
        .select('id')
        .eq('link_publico', linkPublico)
        .limit(1)

      if (linkError) {
        console.error('Erro ao verificar link:', linkError)
        return new Response(
          JSON.stringify({ error: 'Erro interno do servidor' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (!linkExists || linkExists.length === 0) {
        console.log('Link não encontrado:', linkPublico)
        return new Response(
          JSON.stringify({ error: 'Link de questionário não encontrado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Buscar questionário pelo link público e email específico
      const { data: questionario, error: questionarioError } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .maybeSingle()

      if (questionarioError) {
        console.error('Erro ao buscar questionário:', questionarioError)
        return new Response(
          JSON.stringify({ error: 'Erro interno do servidor' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (!questionario) {
        console.log('Questionário não encontrado para:', { email, linkPublico })
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      // Verificar senha
      if (questionario.senha_hash !== senha) {
        console.log('Senha incorreta para:', email)
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      console.log('Login bem-sucedido para:', email)
      return new Response(
        JSON.stringify({ 
          success: true, 
          questionario: {
            id: questionario.id,
            nomeResponsavel: questionario.nome_responsavel,
            email: questionario.email,
            respostasJson: questionario.respostas_json || {},
            status: questionario.status
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'register') {
      const { email, senha, nomeResponsavel, linkPublico } = data as RegisterRequest
      
      console.log('Register attempt:', { email, nomeResponsavel, linkPublico, hasSenha: !!senha })
      
      if (!email || !senha || !nomeResponsavel || !linkPublico) {
        return new Response(
          JSON.stringify({ error: 'Todos os campos são obrigatórios' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Verificar se já existe um usuário com este email para este link
      const { data: existingUser, error: existingError } = await supabaseClient
        .from('questionarios_noivos')
        .select('id')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .maybeSingle()

      if (existingError) {
        console.error('Erro ao verificar usuário existente:', existingError)
        return new Response(
          JSON.stringify({ error: 'Erro interno do servidor' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (existingUser) {
        console.log('Usuário já existe:', { email, linkPublico })
        return new Response(
          JSON.stringify({ error: 'Já existe uma conta com este email para este questionário' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        )
      }

      // Verificar se existe um registro placeholder (aguardando preenchimento)
      const { data: placeholderRecord, error: placeholderError } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', 'aguardando@preenchimento.com')
        .maybeSingle()

      if (placeholderError) {
        console.error('Erro ao verificar placeholder:', placeholderError)
        return new Response(
          JSON.stringify({ error: 'Erro interno do servidor' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      if (placeholderRecord) {
        console.log('Atualizando registro placeholder')
        // Atualizar o registro placeholder
        const { data: updatedQuestionario, error: updateError } = await supabaseClient
          .from('questionarios_noivos')
          .update({
            nome_responsavel: nomeResponsavel,
            email: email,
            senha_hash: senha,
            respostas_json: {},
            status: 'rascunho'
          })
          .eq('id', placeholderRecord.id)
          .select()
          .single()

        if (updateError) {
          console.error('Erro ao atualizar questionário:', updateError)
          return new Response(
            JSON.stringify({ error: 'Erro ao criar conta para este questionário' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }

        console.log('Registro atualizado com sucesso')
        return new Response(
          JSON.stringify({ 
            success: true, 
            questionario: {
              id: updatedQuestionario.id,
              nomeResponsavel: updatedQuestionario.nome_responsavel,
              email: updatedQuestionario.email,
              respostasJson: updatedQuestionario.respostas_json || {},
              status: updatedQuestionario.status
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        console.log('Criando novo registro')
        // Criar novo registro se não há placeholder
        const { data: novoQuestionario, error: insertError } = await supabaseClient
          .from('questionarios_noivos')
          .insert({
            link_publico: linkPublico,
            nome_responsavel: nomeResponsavel,
            email: email,
            senha_hash: senha,
            respostas_json: {},
            status: 'rascunho'
          })
          .select()
          .single()

        if (insertError) {
          console.error('Erro ao criar questionário:', insertError)
          return new Response(
            JSON.stringify({ error: 'Erro ao criar conta para este questionário' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          )
        }

        console.log('Novo registro criado com sucesso')
        return new Response(
          JSON.stringify({ 
            success: true, 
            questionario: {
              id: novoQuestionario.id,
              nomeResponsavel: novoQuestionario.nome_responsavel,
              email: novoQuestionario.email,
              respostasJson: novoQuestionario.respostas_json || {},
              status: novoQuestionario.status
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    console.log('Ação não reconhecida:', action)
    return new Response(
      JSON.stringify({ error: 'Ação não reconhecida' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
