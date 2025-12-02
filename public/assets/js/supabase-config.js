/**
 * Supabase Configuration Injector
 * Este script deve ser carregado ANTES dos outros scripts
 * para injetar as credenciais do Supabase no window
 * 
 * Em produção, este arquivo é gerado pelo build process
 * com as variáveis de ambiente substituídas.
 */

// Configuração do Supabase (será substituída em build/deploy)
window.__SUPABASE_CONFIG__ = {
    // Em desenvolvimento, use valores do .env.local via processo de build
    // Em produção, estes valores vêm das variáveis de ambiente do Vercel
    url: '__NEXT_PUBLIC_SUPABASE_URL__',
    anonKey: '__NEXT_PUBLIC_SUPABASE_ANON_KEY__'
};

// Validação básica
if (window.__SUPABASE_CONFIG__.url.includes('__NEXT')) {
    console.warn('[Supabase] Config não substituída. Usando fallback para dados estáticos.');
    window.__SUPABASE_CONFIG__ = null;
}
