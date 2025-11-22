import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Grid, CircularProgress, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { Delete, Sports, Edit, HowToReg } from '@mui/icons-material';
import api from '../services/api';
import { getUserRole } from '../utils/auth';

const GestionTorneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const role = getUserRole();

  const loadTorneos = async () => {
    try {
      setLoading(true);
      const endpoint = role === 'admin' ? '/torneos/admin' : '/torneos/atleta/torneos-disponibles';
      const { data } = await api.get(endpoint);
      setTorneos(data);
    } catch (err) {
      console.error('Error cargando torneos', err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarTorneo = async () => {
    try {
      await api.delete(`/torneos/admin/${selected}`);
      setOpenDelete(false);
      loadTorneos();
    } catch (err) {
      console.error('Error eliminando torneo', err);
    }
  };

  useEffect(() => { loadTorneos(); }, []);

  if (loading) return (
    <Box textAlign="center" sx={{ mt: 6 }}>
      <CircularProgress />
      <Typography variant="h6" mt={2}>Cargando torneos...</Typography>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        {role === 'admin' ? 'Gestión de Torneos' : 'Torneos Disponibles'}
      </Typography>
      <Grid container spacing={3}>
        {torneos.map((t) => (
          <Grid item xs={12} md={6} key={t.id}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="600">{t.nombre}</Typography>
              <Typography variant="body2" color="text.secondary">{t.deporte_nombre}</Typography>
              <Typography variant="body2">📍 {t.ubicacion}</Typography>
              <Typography variant="body2">🗓️ {new Date(t.fecha).toLocaleDateString('es-ES')}</Typography>
              <Chip label={`${t.cupos_disponibles} cupos`} sx={{ mt: 1 }} color="primary" />

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                {role === 'admin' ? (
                  <>
                    <Tooltip title="Editar torneo"><IconButton color="primary"><Edit /></IconButton></Tooltip>
                    <Tooltip title="Eliminar torneo">
                      <IconButton color="error" onClick={() => { setSelected(t.id); setOpenDelete(true); }}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Button variant="contained" startIcon={<HowToReg />} size="small">
                    Inscribirse
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>¿Eliminar este torneo?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button onClick={eliminarTorneo} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestionTorneos;
