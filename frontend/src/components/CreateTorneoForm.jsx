import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert
} from '@mui/material';
import api from '../services/api';

export default function CreateTorneoForm({ open, onClose, onTorneoCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    fecha: '',
    ubicacion: '',
    deporte_id: '',
    estado: 'abierto'
  });
  const [deportes, setDeportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchDeportes();
      setError('');
      setForm({
        nombre: '',
        fecha: '',
        ubicacion: '',
        deporte_id: '',
        estado: 'abierto'
      });
    }
  }, [open]);

  const fetchDeportes = async () => {
    try {
      const { data } = await api.get('/admin/deportes');
      setDeportes(data);
    } catch (err) {
      console.error('Error fetching deportes:', err);
      setError('Error al cargar los deportes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/admin/torneos', {
        ...form,
        deporte_id: parseInt(form.deporte_id)
      });
      onTorneoCreated();
      onClose();
    } catch (err) {
      console.error('Error creating torneo:', err);
      setError(err.response?.data?.message || 'Error al crear torneo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Nuevo Torneo</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              label="Nombre del Torneo"
              value={form.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              required
              fullWidth
              placeholder="Ej: Torneo de Fútbol Primavera 2024"
            />
            
            <TextField
              label="Fecha del Torneo"
              type="date"
              value={form.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            
            <TextField
              label="Ubicación"
              value={form.ubicacion}
              onChange={(e) => handleChange('ubicacion', e.target.value)}
              required
              fullWidth
              placeholder="Ej: Estadio Municipal, Parque Central"
            />
            
            <FormControl fullWidth required>
              <InputLabel>Deporte</InputLabel>
              <Select
                value={form.deporte_id}
                label="Deporte"
                onChange={(e) => handleChange('deporte_id', e.target.value)}
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

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={form.estado}
                label="Estado"
                onChange={(e) => handleChange('estado', e.target.value)}
              >
                <MenuItem value="abierto">Abierto</MenuItem>
                <MenuItem value="en curso">En Curso</MenuItem>
                <MenuItem value="finalizado">Finalizado</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !form.nombre || !form.fecha || !form.ubicacion || !form.deporte_id}
          >
            {loading ? 'Creando...' : 'Crear Torneo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}