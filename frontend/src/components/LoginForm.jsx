import { useState } from 'react';
import api from '../services/api';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      onLoginSuccess(data.usuario);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401)
        setError('Contraseña incorrecta');
      else if (err.response?.status === 404)
        setError('Usuario no encontrado');
      else setError('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
      {error && <p className="error">{error}</p>}
      <p>
      ¿No tienes cuenta?{" "}
      <a href="/register">Regístrate aquí</a>
      </p> 
    </form>
  );
}