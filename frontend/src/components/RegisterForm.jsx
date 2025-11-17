import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from "@mui/material";
import api from "../services/api";

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const { data } = await api.post("/register", {
        nombre: form.nombre,
        email: form.email,
        password: form.password
      });

      setSuccess("Usuario registrado correctamente");

      // Si quieres guardar token:
      // localStorage.setItem("token", data.token);

    } catch (err) {
      if (err.response?.status === 409) {
        setError("El correo ya está registrado");
      } else {
        setError("Error al registrar usuario");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        background: "#fff",
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
        Crear Cuenta
      </Typography>

      <TextField
        label="Nombre completo"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Confirmar contraseña"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
      >
        Registrarme
      </Button>
    </Box>
  );
}
