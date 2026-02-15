-- Migration: Secure History Functions
-- Descrição: Converte funções de histórico para SECURITY INVOKER para respeitar RLS 
-- e reforça políticas para ambiente sem autenticação padrão.
-- Autor: Antigravity (v0.3.15)

-- 1. Converter funções para SECURITY INVOKER
-- Nota: Isso obriga a função a respeitar o RLS definido na tabela.
-- Como o usuário não está logado via Supabase Auth, o acesso é controlado 
-- puramente pelo RLS de 'anon' baseado no user_id (cookie).

ALTER FUNCTION public.get_user_history(varchar, integer) SECURITY INVOKER;
ALTER FUNCTION public.get_user_stats(varchar) SECURITY INVOKER;

-- Nota: add_to_history deve permanecer SECURITY DEFINER se quisermos que ela 
-- consiga inserir em tabelas que o usuário anon não tem permissão direta, 
-- MAS, no nosso caso, o usuário anon TEM permissão de insert. 
-- Para maior segurança, vamos mudar para INVOKER também.
ALTER FUNCTION public.add_to_history(varchar, varchar, varchar, varchar, text, text) SECURITY INVOKER;

-- 2. Função auxiliar para setar contexto de usuário
-- Isso permite que a API Vercel comunique o ID do usuário para o Postgres RLS
CREATE OR REPLACE FUNCTION public.set_app_user_id(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.user_id', p_user_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Reforçar Políticas RLS para historico_consultas
-- O objetivo é impedir que o usuário A veja o histórico do usuário B.

DROP POLICY IF EXISTS "Users can read own history" ON public.historico_consultas;

-- Nova política: O usuário anon só pode ler se o user_id bater com o ID que ele enviou na sessão.
-- No Inelegis, como não temos Auth, usamos o 'app.user_id' que é setado via config da transação 
-- OU simplesmente confiamos no parâmetro da função desde que o RLS filtre.
-- Como as funções agora são INVOKER, o SELECT dentro da função passará por este filtro:

CREATE POLICY "Users can read own history" 
ON public.historico_consultas 
FOR SELECT 
TO anon
USING (
    user_id = current_setting('app.user_id', true)
);

-- Nota: Para que isso funcione, a API Vercel deve executar:
-- SET LOCAL app.user_id = 'id_do_usuario';
-- ANTES de chamar a função.
