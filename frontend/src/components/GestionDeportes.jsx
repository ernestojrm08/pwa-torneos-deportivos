import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  SportsEsports,
  Category
} from '@mui/icons-material';
import api from '../services/api';

export default function GestionDeportes() {
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeporte, setEditingDeporte] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchDeportes();
  }, []);

const fetchDeportes = async () => {
  try {
    setLoading(true);
    setError('');
    console.log('🔄 Cargando deportes...');
    
    const { data } = await api.get('/deportes');
    console.log('✅ Deportes cargados:', data);
    setDeportes(data);
    
  } catch (err) {
    console.error('❌ Error fetching deportes:', err);
    
    if (err.response?.status === 500) {
      setError('Error del servidor. Verifica la consola del backend.');
    } else if (err.response?.status === 401) {
      setError('No autorizado. Tu sesión puede haber expirado.');
    } else {
      setError('Error al cargar los deportes: ' + (err.response?.data?.message || err.message));
    }
  } finally {
    setLoading(false);
  }
};

  const handleOpenDialog = (deporte = null) => {
    setEditingDeporte(deporte);
    setForm({
      nombre: deporte?.nombre || '',
      descripcion: deporte?.descripcion || ''
    });
    setError('');
    setSuccess('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDeporte(null);
    setForm({ nombre: '', descripcion: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingDeporte) {
        await api.put(`/deportes/${editingDeporte.id}`, form);
        setSuccess('Deporte actualizado exitosamente');
      } else {
        await api.post('/deportes', form);
        setSuccess('Deporte creado exitosamente');
      }
      
      fetchDeportes();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el deporte');
    }
  };

  const handleDelete = async (deporte) => {
    if (!window.confirm(`¿Estás seguro de eliminar el deporte "${deporte.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/deportes/${deporte.id}`);
      setSuccess('Deporte eliminado exitosamente');
      fetchDeportes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el deporte');
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Gestión de Deportes
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: '600'
            }}
          >
            Nuevo Deporte
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Administra los deportes disponibles en el sistema
        </Typography>
      </Box>

      {/* Alertas */}
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

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="800" color="#667eea">
                    {deportes.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Deportes
                  </Typography>
                </Box>
                <SportsEsports sx={{ fontSize: 40, color: '#667eea', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="800" color="#764ba2">
                    {deportes.reduce((acc, d) => acc + (d.total_categorias || 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Categorías
                  </Typography>
                </Box>
                <Category sx={{ fontSize: 40, color: '#764ba2', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Deportes */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Deporte</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Descripción</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Categorías</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deportes.map((deporte) => (
                <TableRow key={deporte.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="600">
                      {deporte.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {deporte.descripcion || 'Sin descripción'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${deporte.total_categorias || 0} categorías`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(deporte)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(deporte)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog para crear/editar deporte */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDeporte ? 'Editar Deporte' : 'Nuevo Deporte'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Nombre del Deporte"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
                fullWidth
                placeholder="Ej: Natación, Atletismo, Triatlón"
              />
              <TextField
                label="Descripción"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                multiline
                rows={3}
                fullWidth
                placeholder="Descripción del deporte..."
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={!form.nombre}>
              {editingDeporte ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}