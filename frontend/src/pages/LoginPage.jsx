import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (usuario) => {
    if (usuario.rol === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/perfil');
    }
  };

  return (
    <div className="login-page">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}