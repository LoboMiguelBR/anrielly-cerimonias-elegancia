
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let requestData;
    try {
      requestData = await req.json()
    } catch (error) {
      console.error('Erro ao parsear JSON:', error)
      return new Response(
        JSON.stringify({ error: 'Dados inválidos' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const { action, ...data } = requestData

    if (action === 'login') {
      const { email, senha, linkPublico } = data as LoginRequest
      
      if (!email || !senha || !linkPublico) {
        return new Response(
          JSON.stringify({ error: 'Email, senha e link público são obrigatórios' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Verificar se o link público existe
      const { data: linkExists } = await supabaseClient
        .from('questionarios_noivos')
        .select('id')
        .eq('link_publico', linkPublico)
        .single()

      if (!linkExists) {
        return new Response(
          JSON.stringify({ error: 'Link de questionário não encontrado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Buscar questionário pelo link público e email
      const { data: questionario, error } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .single()

      if (error || !questionario) {
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      // Para simplificar, vamos usar uma verificação básica de senha
      // Em produção, você deve usar bcrypt ou similar
      if (questionario.senha_hash !== senha) {
        return new Response(
          JSON.stringify({ error: 'Credenciais inválidas' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

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
      
      if (!email || !senha || !nomeResponsavel || !linkPublico) {
        return new Response(
          JSON.stringify({ error: 'Todos os campos são obrigatórios' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Verificar se o link público existe
      const { data: linkData } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .single()

      if (!linkData) {
        return new Response(
          JSON.stringify({ error: 'Link de questionário não encontrado' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Verificar se já existe um questionário preenchido para este link
      if (linkData.email !== 'aguardando@preenchimento.com') {
        return new Response(
          JSON.stringify({ error: 'Este questionário já foi preenchido' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        )
      }

      // Atualizar o registro existente com os dados do usuário
      const { data: questionarioAtualizado, error } = await supabaseClient
        .from('questionarios_noivos')
        .update({
          nome_responsavel: nomeResponsavel,
          email: email,
          senha_hash: senha, // Em produção, use bcrypt
          respostas_json: {},
          status: 'rascunho'
        })
        .eq('id', linkData.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar questionário:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao criar questionário' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          questionario: {
            id: questionarioAtualizado.id,
            nomeResponsavel: questionarioAtualizado.nome_responsavel,
            email: questionarioAtualizado.email,
            respostasJson: questionarioAtualizado.respostas_json || {},
            status: questionarioAtualizado.status
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
