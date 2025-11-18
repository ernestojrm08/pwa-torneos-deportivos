import { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider
} from "@mui/material";
import { SportsSoccer, Person, Email, Lock, VpnKey } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from "../services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validaciones del frontend
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/register", {
        nombre: form.nombre,
        email: form.email,
        password: form.password
      });

      // Opción 1: Login automático después del registro
      // login(data.usuario, data.token);
      // navigate(data.usuario.rol === 'admin' ? '/dashboard' : '/perfil');

      // Opción 2: Redirigir al login (actual)
      setSuccess("¡Registro exitoso! Redirigiendo al login...");
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error('Error en registro:', err);
      if (err.response?.status === 409) {
        setError("El correo ya está registrado");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrar usuario. Intente nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            padding: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Logo y Título */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
            >
              <SportsSoccer sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography component="h1" variant="h4" fontWeight="800" color="#333">
              Gestión de Torneos y Competencias
            </Typography>
            <Typography variant="h6" color="#666" sx={{ mt: 1 }}>
              Crear Cuenta
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Campo Nombre */}
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Person 
                sx={{ 
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#667eea',
                  zIndex: 1
                }} 
              />
              <TextField
                required
                fullWidth
                id="nombre"
                label="Nombre Completo"
                name="nombre"
                autoComplete="name"
                autoFocus
                value={form.nombre}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    pl: 4.5,
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  }
                }}
              />
            </Box>

            {/* Campo Email */}
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Email 
                sx={{ 
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#667eea',
                  zIndex: 1
                }} 
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    pl: 4.5,
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  }
                }}
              />
            </Box>

            {/* Campo Contraseña */}
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Lock 
                sx={{ 
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#667eea',
                  zIndex: 1
                }} 
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                helperText="Mínimo 6 caracteres"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    pl: 4.5,
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  }
                }}
              />
            </Box>

            {/* Campo Confirmar Contraseña */}
            <Box sx={{ position: 'relative', mb: 4 }}>
              <VpnKey 
                sx={{ 
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#667eea',
                  zIndex: 1
                }} 
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    pl: 4.5,
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  }
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.3s ease',
                mb: 3
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarme'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes cuenta?
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Button
                component={Link}
                to="/"
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Iniciar Sesión
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}