
// Corrigindo o import do createClient de volta para a URL ESM correta para Deno Edge Functions Supabase
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.9";
import { hashSync, compareSync } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function hashPassword(senha: string) {
  return hashSync(senha);
}
function verifyPassword(senha: string, hash: string) {
  return compareSync(senha, hash);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { action, email, senha, nomeResponsavel, linkPublico } = await req.json();
    if (!linkPublico) {
      return new Response(JSON.stringify({ error: "Link público obrigatório" }), { headers: corsHeaders, status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // Registro
    if (action === "register") {
      if (!email || !senha || !nomeResponsavel) {
        return new Response(JSON.stringify({ error: "Todos os campos são obrigatórios" }), { headers: corsHeaders, status: 400 });
      }
      if (senha.length < 6) {
        return new Response(JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres" }), { headers: corsHeaders, status: 400 });
      }

      // Verificar se já existe (email + link)
      const { data: exists } = await supabase
        .from("questionarios_noivos")
        .select("*")
        .eq("email", email)
        .eq("link_publico", linkPublico)
        .maybeSingle();

      if (exists) {
        return new Response(JSON.stringify({ error: "Já existe uma conta com este email para este questionário" }), { headers: corsHeaders, status: 409 });
      }

      // Hash
      const senhaHash = hashPassword(senha);

      // Salvar novo acesso
      const { data, error } = await supabase
        .from("questionarios_noivos")
        .insert({
          link_publico: linkPublico,
          email,
          nome_responsavel: nomeResponsavel,
          senha_hash: senhaHash,
          status: "rascunho",
        })
        .select("id, nome_responsavel, email, respostas_json, status")
        .maybeSingle();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
      }
      if (!data) {
        return new Response(JSON.stringify({ error: "Erro ao registrar usuário" }), { headers: corsHeaders, status: 500 });
      }

      // Normalizar campos para compatibilidade
      const questionario = {
        id: data.id,
        nomeResponsavel: data.nome_responsavel,
        email: data.email,
        respostasJson: data.respostas_json || {},
        status: data.status,
      };
      return new Response(JSON.stringify({ questionario }), { headers: corsHeaders });
    }

    // Login
    if (action === "login") {
      if (!email || !senha) {
        return new Response(JSON.stringify({ error: "Email e senha são obrigatórios" }), { headers: corsHeaders, status: 400 });
      }
      const { data, error } = await supabase
        .from("questionarios_noivos")
        .select("id, nome_responsavel, email, senha_hash, respostas_json, status")
        .eq("email", email)
        .eq("link_publico", linkPublico)
        .maybeSingle();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 500 });
      }
      if (!data) {
        return new Response(JSON.stringify({ error: "Credenciais inválidas" }), { headers: corsHeaders, status: 401 });
      }
      if (!data.senha_hash) {
        return new Response(JSON.stringify({ error: "A senha não foi definida corretamente" }), { headers: corsHeaders, status: 401 });
      }
      if (!verifyPassword(senha, data.senha_hash)) {
        return new Response(JSON.stringify({ error: "Credenciais inválidas" }), { headers: corsHeaders, status: 401 });
      }

      // Normalizar campos para compatibilidade
      const questionario = {
        id: data.id,
        nomeResponsavel: data.nome_responsavel,
        email: data.email,
        respostasJson: data.respostas_json || {},
        status: data.status,
      };
      return new Response(JSON.stringify({ questionario }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Ação não suportada" }), { headers: corsHeaders, status: 400 });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Erro de execução",
      details: error.message || error,
    }), { headers: corsHeaders, status: 500 });
  }
});
