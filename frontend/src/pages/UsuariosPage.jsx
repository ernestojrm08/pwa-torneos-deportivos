import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import ListaUsuarios from "../components/ListaUsuarios";
import EnhancedLayout from "../components/EnhancedLayout";

export default function UsuariosPage() {
  return (
    <EnhancedLayout>
      <Box sx={{ p: 3, width: "100%", maxWidth: "1300px", mx: "auto" }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administra todos los usuarios registrados en el sistema.
          </Typography>
        </Paper>
        
        <ListaUsuarios />
      </Box>
    </EnhancedLayout>
  );
}
