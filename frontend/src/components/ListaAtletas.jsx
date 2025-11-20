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
  Grid
} from '@mui/material';
import {
  Edit,
  Person,
  HowToReg,
  EmojiEvents
} from '@mui/icons-material';
import api from '../services/api';

export default function ListaAtletas() {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [atletaSeleccionado, setAtletaSeleccionado] = useState(null);
  const [form, setForm] = useState({ nombre: '', email: '' });

  useEffect(() => {
    fetchAtletas();
  }, []);

  const fetchAtletas = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/atletas');
      setAtletas(data);
    } catch (err) {
      console.error('Error fetching atletas:', err);
      setError('Error al cargar los atletas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (atleta = null) => {
    setAtletaSeleccionado(atleta);
    setForm({
      nombre: atleta?.nombre || '',
      email: atleta?.email || ''
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setAtletaSeleccionado(null);
    setForm({ nombre: '', email: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/atletas/${atletaSeleccionado.id}`, form);
      fetchAtletas();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar atleta');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="800" gutterBottom>
        Gestión de Atletas
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="800" color="#667eea">
                    {atletas.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Atletas
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: '#667eea', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Atletas */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Atleta</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Inscripciones</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Resultados</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: '800' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {atletas.map((atleta) => (
                <TableRow key={atleta.id} hover>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="600">
                      {atleta.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>{atleta.email}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={<HowToReg />}
                      label={atleta.total_inscripciones || 0}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<EmojiEvents />}
                      label={atleta.total_resultados || 0}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(atleta)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog para editar atleta */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Editar Atleta</DialogTitle>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">Actualizar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}