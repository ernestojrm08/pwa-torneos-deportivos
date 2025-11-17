import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PerfilPage from "./pages/PerfilPage"; // ← Nueva importación
import { getToken, getUsuario } from './utils/auth';
import RegisterPage from "./pages/RegisterPage";

function PrivateRoute({ children }) {
  const token = getToken();
  const user = getUsuario();
  if (!token || !user) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const user = getUsuario();
  if (!user || user.rol !== 'admin') return <Navigate to="/perfil" replace />;
  return <PrivateRoute>{children}</PrivateRoute>;
}

function AtletaRoute({ children }) {
  const user = getUsuario();
  if (!user || user.rol !== 'atleta') return <Navigate to="/dashboard" replace />;
  return <PrivateRoute>{children}</PrivateRoute>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Ruta para administradores */}
        <Route path="/dashboard" element={
          <AdminRoute><DashboardPage /></AdminRoute>
        } />
        
        {/* Nueva ruta para atletas */}
        <Route path="/perfil" element={
          <AtletaRoute><PerfilPage /></AtletaRoute>
        } />
        
        {/* Ruta por defecto según rol */}
        <Route path="/" element={
          <PrivateRoute>
            {getUsuario()?.rol === 'admin' ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/perfil" replace />
            }
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;