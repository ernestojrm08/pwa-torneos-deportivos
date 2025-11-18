import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PerfilPage from "./pages/PerfilPage";
import RegisterPage from "./pages/RegisterPage";
import EnhancedLayout from "./components/EnhancedLayout";

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

// Componente para rutas privadas
function PrivateRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to={user.rol === 'admin' ? '/dashboard' : '/perfil'} replace />;
  }

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

function MisInscripcionesPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Inscripciones</h1>
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
          
          {/* Rutas de atleta */}
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
          
          <Route path="/perfil/inscripciones" element={
            <PrivateRoute requiredRole="atleta">
              <MisInscripcionesPage />
            </PrivateRoute>
          } />
          
          <Route path="/perfil/resultados" element={
            <PrivateRoute requiredRole="atleta">
              <MisResultadosPage />
            </PrivateRoute>
          } />
          
          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;