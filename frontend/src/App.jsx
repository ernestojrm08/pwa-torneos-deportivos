import DashboardAtletaPage from "./pages/DashboardAtletaPage";
import InscripcionesPage from "./pages/InscripcionesPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PerfilPage from "./pages/PerfilPage";
import RegisterPage from "./pages/RegisterPage";
import EnhancedLayout from "./components/EnhancedLayout";
import GestionDeportes from './components/GestionDeportes';
import GestionCategorias from './components/GestionCategorias';

// Componente de carga
function LoadingSpinner() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: '#666', margin: 0 }}>Cargando aplicación...</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

// Función auxiliar para verificar expiración del token (copiada de utils/auth)
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

// Componente para rutas privadas - MEJORADO CON DEBUG
function PrivateRoute({ children, requiredRole = null }) {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Debug logs para entender qué está pasando
  console.log('🛡️ PrivateRoute - Estado:', {
    loading,
    isAuthenticated,
    user: user?.email,
    requiredRole,
    path: window.location.pathname
  });
  
  if (loading) {
    console.log('⏳ PrivateRoute: Cargando verificación de autenticación...');
    return <LoadingSpinner />;
  }

  if (!user || !isAuthenticated) {
    console.log('🚫 PrivateRoute: No autenticado, redirigiendo a login');
    
    // Debug: Verificar qué hay en localStorage
    const token = localStorage.getItem('token');
    const usuarioStorage = localStorage.getItem('usuario');
    console.log('📦 Datos en localStorage:', { 
      token: !!token, 
      usuario: !!usuarioStorage,
      tokenExpirado: token ? isTokenExpired(token) : 'no token'
    });
    
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    console.log('⛔ PrivateRoute: Rol incorrecto', {
      userRol: user.rol,
      requiredRole,
      path: window.location.pathname
    });
    return <Navigate to={user.rol === 'admin' ? '/dashboard' : '/atleta/dashboard'} replace />;
  }

  console.log('✅ PrivateRoute: Acceso permitido a', window.location.pathname);
  return <EnhancedLayout>{children}</EnhancedLayout>;
}

// Páginas de placeholder para rutas en desarrollo
function TorneosPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Torneos</h1>
      <p>Página en desarrollo - Próximamente</p>
    </div>
  );
}

function UsuariosPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Usuarios</h1>
      <p>Página en desarrollo - Próximamente</p>
    </div>
  );
}

function TorneosDisponiblesPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Torneos Disponibles</h1>
      <p>Página en desarrollo - Próximamente</p>
    </div>
  );
}

function MisResultadosPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Resultados</h1>
      <p>Página en desarrollo - Próximamente</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rutas de administrador */}
          <Route path="/dashboard" element={
            <PrivateRoute requiredRole="admin">
              <DashboardPage />
            </PrivateRoute>
          } />
          
          {/* ✅ RUTAS AGREGADAS PARA PERSONA A */}
          <Route path="/dashboard/deportes" element={
            <PrivateRoute requiredRole="admin">
              <GestionDeportes />
            </PrivateRoute>
          } />

          <Route path="/dashboard/categorias" element={
            <PrivateRoute requiredRole="admin">
              <GestionCategorias />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/torneos" element={
            <PrivateRoute requiredRole="admin">
              <TorneosPage />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard/usuarios" element={
            <PrivateRoute requiredRole="admin">
              <UsuariosPage />
            </PrivateRoute>
          } />
          
          {/* Rutas de atleta EXISTENTES (se mantienen) */}
          <Route path="/perfil" element={
            <PrivateRoute requiredRole="atleta">
              <PerfilPage />
            </PrivateRoute>
          } />
          
          <Route path="/perfil/torneos" element={
            <PrivateRoute requiredRole="atleta">
              <TorneosDisponiblesPage />
            </PrivateRoute>
          } />
          
          <Route path="/perfil/resultados" element={
            <PrivateRoute requiredRole="atleta">
              <MisResultadosPage />
            </PrivateRoute>
          } />
          
          {/* ✅ NUEVAS RUTAS PARA PERSONA B - MEJORADAS */}
          <Route path="/atleta/dashboard" element={
            <PrivateRoute requiredRole="atleta">
              <DashboardAtletaPage />
            </PrivateRoute>
          } />
          
          <Route path="/atleta/inscripciones" element={
            <PrivateRoute requiredRole="atleta">
              <InscripcionesPage />
            </PrivateRoute>
          } />
          
          {/* Ruta por defecto - MEJORADA para redirigir según rol */}
          <Route path="*" element={<RoutePorDefecto />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Componente para manejar ruta por defecto inteligente
function RoutePorDefecto() {
  const { user, isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.rol === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/atleta/dashboard');
      }
    } else {
      navigate('/');
    }
  }, [user, isAuthenticated]);

  return <LoadingSpinner />;
}

export default App;