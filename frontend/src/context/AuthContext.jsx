import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, getUsuario, clearAuth } from '../utils/auth';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🎯 AuthProvider montado, verificando autenticación...');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getToken();
      const userData = getUsuario();

      console.log('🔐 Verificando autenticación...', { 
        tieneToken: !!token, 
        tieneUsuario: !!userData 
      });

      if (token && userData) {
        try {
          // Intentar verificar el token con el backend
          console.log('🔄 Verificando token con backend...');
          await api.get('/auth/verify');
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ Sesión restaurada automáticamente');
        } catch (error) {
          console.log('❌ Error verificando token:', error.response?.status, error.message);
          
          // Si es error 404 (endpoint no existe), usar verificación local
          if (error.response?.status === 404) {
            console.log('⚠️ Endpoint /auth/verify no existe, usando verificación local');
            // Verificar localmente si el token no está expirado
            if (!isTokenExpired(token)) {
              setUser(userData);
              setIsAuthenticated(true);
              console.log('✅ Sesión restaurada (verificación local)');
            } else {
              console.log('❌ Token expirado');
              logout();
            }
          } else if (error.response?.status === 401) {
            console.log('❌ Token inválido');
            logout();
          } else {
            console.log('⚠️ Error de conexión, intentando continuar con sesión local');
            // En caso de error de conexión, mantener la sesión local
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } else {
        console.log('ℹ️ No hay token o usuario en localStorage');
      }
    } catch (error) {
      console.error('Error inesperado en checkAuth:', error);
    } finally {
      // ⚠️ IMPORTANTE: Siempre establecer loading a false, sin importar el resultado
      console.log('🏁 Finalizando verificación de autenticación');
      setLoading(false);
    }
  };

  // Función auxiliar para verificar expiración del token
  const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      console.log('⏰ Token expira:', new Date(payload.exp * 1000), 'Expirado:', isExpired);
      return isExpired;
    } catch (error) {
      console.error('Error verificando expiración del token:', error);
      return true;
    }
  };

  const login = (userData, token) => {
    console.log('🔑 Iniciando sesión...');
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false); // ⚠️ IMPORTANTE: Establecer loading a false después del login
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false); // ⚠️ IMPORTANTE: Establecer loading a false después del logout
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem('usuario', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};