
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, ...data } = await req.json()

    if (action === 'login') {
      const { email, senha, linkPublico } = data as LoginRequest
      
      // Buscar questionário pelo link público e email
      const { data: questionario, error } = await supabaseClient
        .from('questionarios_noivos')
        .select('*')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .single()

      if (error || !questionario) {
        return new Response(
          JSON.stringify({ error: 'Questionário não encontrado para este email e link' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, questionario.senha_hash)
      if (!senhaValida) {
        return new Response(
          JSON.stringify({ error: 'Senha incorreta' }),
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
            respostasJson: questionario.respostas_json,
            status: questionario.status
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'register') {
      const { email, senha, nomeResponsavel, linkPublico } = data as RegisterRequest
      
      // Verificar se já existe questionário com este email e link
      const { data: existing } = await supabaseClient
        .from('questionarios_noivos')
        .select('id')
        .eq('link_publico', linkPublico)
        .eq('email', email)
        .single()

      if (existing) {
        return new Response(
          JSON.stringify({ error: 'Já existe um questionário cadastrado com este email para este link' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
        )
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha)

      // Criar novo questionário
      const { data: novoQuestionario, error } = await supabaseClient
        .from('questionarios_noivos')
        .insert({
          link_publico: linkPublico,
          nome_responsavel: nomeResponsavel,
          email: email,
          senha_hash: senhaHash,
          respostas_json: {},
          status: 'rascunho'
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar questionário:', error)
        return new Response(
          JSON.stringify({ error: 'Erro ao criar questionário' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          questionario: {
            id: novoQuestionario.id,
            nomeResponsavel: novoQuestionario.nome_responsavel,
            email: novoQuestionario.email,
            respostasJson: novoQuestionario.respostas_json,
            status: novoQuestionario.status
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
