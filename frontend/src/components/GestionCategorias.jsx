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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Category,
  SportsEsports
} from '@mui/icons-material';
import api from '../services/api';

export default function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    deporte_id: '',
    edad_minima: '',
    edad_maxima: '',
    distancia: '',
    unidad: ''
  });

  useEffect(() => {
    fetchCategorias();
    fetchDeportes();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categorias');
      setCategorias(data);
    } catch (err) {
      console.error('Error fetching categorias:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeportes = async () => {
    try {
      const { data } = await api.get('/deportes');
      setDeportes(data);
    } catch (err) {
      console.error('Error fetching deportes:', err);
    }
  };

  const handleOpenDialog = (categoria = null) => {
    setEditingCategoria(categoria);
    setForm({
      nombre: categoria?.nombre || '',
      descripcion: categoria?.descripcion || '',
      deporte_id: categoria?.deporte_id || '',
      edad_minima: categoria?.edad_minima || '',
      edad_maxima: categoria?.edad_maxima || '',
      distancia: categoria?.distancia || '',
      unidad: categoria?.unidad || ''
    });
    setError('');
    setSuccess('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategoria(null);
    setForm({
      nombre: '',
      descripcion: '',
      deporte_id: '',
      edad_minima: '',
      edad_maxima: '',
      distancia: '',
      unidad: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCategoria) {
        await api.put(`/categorias/${editingCategoria.id}`, form);
        setSuccess('Categoría actualizada exitosamente');
      } else {
        await api.post('/categorias', form);
        setSuccess('Categoría creada exitosamente');
      }
      
      fetchCategorias();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  const handleDelete = async (categoria) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/categorias/${categoria.id}`);
      setSuccess('Categoría eliminada exitosamente');
      fetchCategorias();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar la categoría');
    }
  };

  const getRangoEdad = (categoria) => {
    if (categoria.edad_minima && categoria.edad_maxima) {
      return `${categoria.edad_minima}-${categoria.edad_maxima} años`;
    } else if (categoria.edad_minima) {
      return `Desde ${categoria.edad_minima} años`;
    } else if (categoria.edad_maxima) {
      return `Hasta ${categoria.edad_maxima} años`;
    }
    return 'Sin límite';
  };

  const getDistancia = (categoria) => {
    if (categoria.distancia && categoria.unidad) {
      return `${categoria.distancia} ${categoria.unidad}`;
    }
    return 'No especificado';
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
            Gestión de Categorías
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
            Nueva Categoría
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Administra las categorías por deporte (edad, distancia, etc.)
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
                    {categorias.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Categorías
                  </Typography>
                </Box>
                <Category sx={{ fontSize: 40, color: '#667eea', opacity: 0.7 }} />
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
                    {new Set(categorias.map(c => c.deporte_id)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deportes con Categorías
                  </Typography>
                </Box>
                <SportsEsports sx={{ fontSize: 40, color: '#764ba2', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Categorías */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Categoría</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Deporte</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Rango de Edad</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Distancia</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {categoria.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {categoria.descripcion || 'Sin descripción'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={categoria.deporte_nombre}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getRangoEdad(categoria)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getDistancia(categoria)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(categoria)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(categoria)}
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

      {/* Dialog para crear/editar categoría */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Nombre de la Categoría"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  fullWidth
                  placeholder="Ej: Infantil A, Sprint, 5K"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth required>
                  <InputLabel>Deporte</InputLabel>
                  <Select
                    value={form.deporte_id}
                    label="Deporte"
                    onChange={(e) => setForm({ ...form, deporte_id: e.target.value })}
                  >
                    <MenuItem value="">
                      <em>Selecciona un deporte</em>
                    </MenuItem>
                    {deportes.map((deporte) => (
                      <MenuItem key={deporte.id} value={deporte.id}>
                        {deporte.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size xs={12}>
                <TextField
                  label="Descripción"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Descripción de la categoría..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Edad Mínima"
                  type="number"
                  value={form.edad_minima}
                  onChange={(e) => setForm({ ...form, edad_minima: e.target.value })}
                  fullWidth
                  placeholder="Ej: 8"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Edad Máxima"
                  type="number"
                  value={form.edad_maxima}
                  onChange={(e) => setForm({ ...form, edad_maxima: e.target.value })}
                  fullWidth
                  placeholder="Ej: 12"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label="Distancia"
                  type="number"
                  value={form.distancia}
                  onChange={(e) => setForm({ ...form, distancia: e.target.value })}
                  fullWidth
                  placeholder="Ej: 100"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Unidad</InputLabel>
                  <Select
                    value={form.unidad}
                    label="Unidad"
                    onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                  >
                    <MenuItem value="metros">Metros</MenuItem>
                    <MenuItem value="kilometros">Kilómetros</MenuItem>
                    <MenuItem value="millas">Millas</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!form.nombre || !form.deporte_id}
            >
              {editingCategoria ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}