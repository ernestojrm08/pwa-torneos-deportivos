import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Person,
  AdminPanelSettings,
  Group
} from '@mui/icons-material';
import api from '../services/api';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [form, setForm] = useState({ 
    nombre: '', 
    email: '', 
    rol: 'atleta' 
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/usuarios');
      setUsuarios(data);
    } catch (err) {
      console.error('Error fetching usuarios:', err);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMenu = (event, usuario) => {
    setMenuAnchor(event.currentTarget);
    setUsuarioSeleccionado(usuario);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setUsuarioSeleccionado(null);
  };

  const handleOpenEditDialog = () => {
    if (usuarioSeleccionado) {
      setForm({
        nombre: usuarioSeleccionado.nombre,
        email: usuarioSeleccionado.email,
        rol: usuarioSeleccionado.rol
      });
      setDialogOpen(true);
    }
    handleCloseMenu();
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteDialogOpen(false);
    setUsuarioSeleccionado(null);
    setForm({ nombre: '', email: '', rol: 'atleta' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/usuarios/${usuarioSeleccionado.id}`, form);
      await fetchUsuarios();
      setSuccess('Usuario actualizado correctamente');
      handleCloseDialog();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/usuarios/${usuarioSeleccionado.id}`);
      await fetchUsuarios();
      setSuccess('Usuario eliminado correctamente');
      handleCloseDialog();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  // Estadísticas
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(u => u.rol === 'admin').length;
  const totalAtletas = usuarios.filter(u => u.rol === 'atleta').length;

  return (
    <Box>
      <Typography variant="h4" fontWeight="800" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="800" color="#667eea">
                    {totalUsuarios}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Usuarios
                  </Typography>
                </Box>
                <Group sx={{ fontSize: 40, color: '#667eea', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="800" color="#4caf50">
                    {totalAtletas}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Atletas
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: '#4caf50', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="800" color="#ff9800">
                    {totalAdmins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administradores
                  </Typography>
                </Box>
                <AdminPanelSettings sx={{ fontSize: 40, color: '#ff9800', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Usuarios */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Usuario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Rol</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Fecha Registro</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="600">
                      {usuario.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={usuario.rol}
                      color={usuario.rol === 'admin' ? 'primary' : 'default'}
                      variant={usuario.rol === 'admin' ? 'filled' : 'outlined'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {usuario.created_at ? new Date(usuario.created_at).toLocaleDateString('es-ES') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleOpenMenu(e, usuario)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Menu de acciones */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOpenEditDialog}>
          <Edit sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>

      {/* Dialog para editar usuario */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                value={form.rol}
                label="Rol"
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
              >
                <MenuItem value="atleta">Atleta</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">Actualizar</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al usuario <strong>{usuarioSeleccionado?.nombre}</strong>?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}