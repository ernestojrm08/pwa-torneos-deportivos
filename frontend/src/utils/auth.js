// Utilidades de autenticación mejoradas
export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getUsuario = () => {
  try {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    console.log('⏰ Token expira:', new Date(payload.exp * 1000), 'Expirado:', isExpired);
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getUserRole = () => {
  const user = getUsuario();
  return user?.rol || null;
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const isAtleta = () => {
  return getUserRole() === 'atleta';
};

