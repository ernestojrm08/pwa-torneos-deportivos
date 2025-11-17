export const getToken = () => localStorage.getItem('token');
export const getUsuario = () => {
  try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; }
};
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};
