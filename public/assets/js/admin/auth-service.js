/**
 * auth-service.js
 * Gerenciamento de autenticação para o Dashboard Admin
 */

export const authService = {
  /**
   * Realiza o login via e-mail e senha
   */
  async login(email, password) {
    const { data, error } = await window.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data?.user, error };
  },

  /**
   * Realiza o logout
   */
  async logout() {
    const { error } = await window.supabase.auth.signOut();
    window.location.href = "./index.html";
    return { error };
  },

  /**
   * Verifica se o usuário atual está autenticado
   */
  async isAuthenticated() {
    const {
      data: { session },
    } = await window.supabase.auth.getSession();
    return !!session;
  },

  /**
   * Obtém o perfil do usuário atual
   */
  async getUser() {
    const {
      data: { user },
    } = await window.supabase.auth.getUser();
    return user;
  },
};
