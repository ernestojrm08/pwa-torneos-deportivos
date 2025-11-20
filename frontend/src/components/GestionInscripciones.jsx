import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Divider,
  CircularProgress,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Delete, 
  CalendarMonth, 
  LocationOn,
  Sports,
  HowToReg,
  EmojiEvents,
  Cancel,
  CheckCircle,
  Group,
  AccessTime,
  TrendingUp,
  ExpandMore,
  Info
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GestionInscripciones = () => {
  const { user } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [torneosDisponibles, setTorneosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [inscripcionesRes, torneosRes] = await Promise.all([
        api.get('/atleta/inscripciones'),
        api.get('/atleta/torneos-disponibles')
      ]);
      setInscripciones(inscripcionesRes.data);
      setTorneosDisponibles(torneosRes.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cancelarInscripcion = async (inscripcionId, torneoNombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres cancelar tu inscripción en "${torneoNombre}"?`)) {
      return;
    }

    try {
      setProcesando(true);
      await api.delete(`/atleta/inscripciones/${inscripcionId}`);
      await cargarDatos();
      setSuccessMessage(`Inscripción en "${torneoNombre}" cancelada exitosamente`);
      setError('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error cancelando inscripción:', err);
      setError('Error al cancelar la inscripción. Por favor, intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  const abrirDialogInscripcion = (torneo) => {
    setTorneoSeleccionado(torneo);
    setCategoriaSeleccionada('');
    setDialogOpen(true);
  };

  const confirmarInscripcion = async () => {
    if (!torneoSeleccionado) return;

    try {
      setProcesando(true);
      await api.post(`/atleta/inscribirse/${torneoSeleccionado.id}`, {
        categoria_id: categoriaSeleccionada || null
      });
      
      setDialogOpen(false);
      await cargarDatos();
      
      setSuccessMessage(`¡Inscripción exitosa en "${torneoSeleccionado.nombre}"!`);
      setError('');
      setTimeout(() => setSuccessMessage(''), 4000);
      
    } catch (err) {
      console.error('Error en inscripción:', err);
      setError(err.response?.data?.message || 'Error en la inscripción. Por favor, intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'confirmada': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'confirmada': return <CheckCircle fontSize="small" />;
      case 'pendiente': return <AccessTime fontSize="small" />;
      case 'cancelada': return <Cancel fontSize="small" />;
      default: return <HowToReg fontSize="small" />;
    }
  };

  const getCuposColor = (cupos) => {
    if (cupos > 10) return 'success';
    if (cupos > 5) return 'warning';
    if (cupos > 0) return 'error';
    return 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>Cargando torneos e inscripciones...</Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* HEADER MEJORADO */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4, 
          p: 4, 
          background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="800" gutterBottom>
            Gestión de Inscripciones
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: '600px' }}>
            Descubre nuevos torneos y gestiona tus participaciones activas
          </Typography>
          
          {/* ESTADÍSTICAS RÁPIDAS */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {torneosDisponibles.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Torneos Disponibles
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {inscripciones.length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Mis Inscripciones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {inscripciones.filter(i => i.estado === 'confirmada').length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Confirmadas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {torneosDisponibles.reduce((sum, t) => sum + t.cupos_disponibles, 0)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Cupos Totales
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* MENSAJES DE ALERTA */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={4}>
        
        {/* TORNEOS DISPONIBLES - MEJORADO */}
        <Grid item xs={12} lg={7}>
          <Card elevation={1} sx={{ borderRadius: 3, height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Sports sx={{ mr: 2, fontSize: 32, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="700" gutterBottom>
                    Torneos Disponibles
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Inscríbete en los próximos torneos deportivos
                  </Typography>
                </Box>
                <Chip 
                  label={torneosDisponibles.length} 
                  color="success" 
                  sx={{ ml: 'auto', fontSize: '1rem', px: 2, py: 1 }} 
                />
              </Box>
              
              {torneosDisponibles.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Sports sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay torneos disponibles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vuelve pronto para descubrir nuevos torneos
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {torneosDisponibles.map(torneo => (
                    <Grid item xs={12} key={torneo.id}>
                      <Paper 
                        elevation={2}
                        sx={{ 
                          p: 3, 
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: torneo.cupos_disponibles > 0 ? 'success.light' : 'grey.300',
                          background: torneo.cupos_disponibles > 0 ? 'white' : 'grey.50',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          {/* Información del Torneo */}
                          <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: 'success.main', 
                                  mr: 2,
                                  width: 56,
                                  height: 56
                                }}
                              >
                                <Sports />
                              </Avatar>
                              <Box>
                                <Typography variant="h5" fontWeight="600" gutterBottom>
                                  {torneo.nombre}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarMonth sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body1" fontWeight="500">
                                      {new Date(torneo.fecha).toLocaleDateString('es-ES', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOn sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                                    <Typography variant="body1" fontWeight="500">
                                      {torneo.ubicacion}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  <Chip 
                                    label={torneo.deporte_nombre} 
                                    color="primary"
                                    variant="filled"
                                  />
                                  <Chip 
                                    icon={<Group />}
                                    label={`${torneo.cupos_disponibles} cupos`} 
                                    color={getCuposColor(torneo.cupos_disponibles)}
                                    variant="outlined"
                                  />
                                  {torneo.categorias_disponibles?.length > 0 && (
                                    <Chip 
                                      label={`${torneo.categorias_disponibles.length} categorías`} 
                                      color="secondary"
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Botón de Acción */}
                          <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                            <Button
                              variant="contained"
                              size="large"
                              onClick={() => abrirDialogInscripcion(torneo)}
                              disabled={torneo.cupos_disponibles <= 0 || procesando}
                              startIcon={procesando ? <CircularProgress size={20} /> : <HowToReg />}
                              sx={{
                                minWidth: '160px',
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: '600',
                                background: torneo.cupos_disponibles > 0 ? 
                                  'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)' : 'grey.500',
                                '&:hover': {
                                  background: torneo.cupos_disponibles > 0 ? 
                                    'linear-gradient(135deg, #0083b0 0%, #006a8e 100%)' : 'grey.500'
                                }
                              }}
                            >
                              {torneo.cupos_disponibles > 0 ? 'Inscribirse' : 'Cupos Agotados'}
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* MIS INSCRIPCIONES ACTIVAS - MEJORADO */}
        <Grid item xs={12} lg={5}>
          <Card elevation={1} sx={{ borderRadius: 3, height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <HowToReg sx={{ mr: 2, fontSize: 32, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="700" gutterBottom>
                    Mis Inscripciones
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Gestiona tus participaciones activas
                  </Typography>
                </Box>
                <Chip 
                  label={inscripciones.length} 
                  color="secondary" 
                  sx={{ ml: 'auto', fontSize: '1rem', px: 2, py: 1 }} 
                />
              </Box>
              
              {inscripciones.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <HowToReg sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tienes inscripciones activas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inscríbete en algún torneo para comenzar
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {inscripciones.map(inscripcion => (
                    <Paper 
                      key={inscripcion.id} 
                      elevation={1}
                      sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        borderLeft: '6px solid',
                        borderLeftColor: 
                          inscripcion.estado === 'confirmada' ? 'success.main' :
                          inscripcion.estado === 'pendiente' ? 'warning.main' : 'error.main',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: 3
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            {inscripcion.torneo_nombre}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarMonth sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body1">
                                {new Date(inscripcion.fecha).toLocaleDateString('es-ES')}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body1">
                                {inscripcion.ubicacion}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            <Chip 
                              label={inscripcion.deporte_nombre} 
                              color="primary"
                              variant="outlined"
                            />
                            
                            {inscripcion.categoria_nombre && (
                              <Chip 
                                label={inscripcion.categoria_nombre} 
                                color="secondary"
                              />
                            )}
                            
                            <Chip 
                              icon={getEstadoIcon(inscripcion.estado)}
                              label={inscripcion.estado?.toUpperCase()} 
                              color={getEstadoColor(inscripcion.estado)}
                              variant="filled"
                              sx={{ fontWeight: '600' }}
                            />
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary">
                            Inscrito el {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-ES')}
                          </Typography>
                        </Box>
                        
                        <Tooltip title="Cancelar inscripción">
                          <IconButton
                            onClick={() => cancelarInscripcion(inscripcion.id, inscripcion.torneo_nombre)}
                            disabled={procesando}
                            sx={{ 
                              ml: 2,
                              color: 'error.main',
                              background: 'rgba(211, 47, 47, 0.1)',
                              '&:hover': {
                                background: 'rgba(211, 47, 47, 0.2)'
                              }
                            }}
                          >
                            {procesando ? <CircularProgress size={20} /> : <Delete />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* DIALOG PARA INSCRIPCIÓN - MEJORADO */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => !procesando && setDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HowToReg sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
            <Box>
              <Typography variant="h5" fontWeight="700">
                Confirmar Inscripción
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completa los detalles de tu participación
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {torneoSeleccionado && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
              }}
            >
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {torneoSeleccionado.nombre}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarMonth sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {new Date(torneoSeleccionado.fecha).toLocaleDateString('es-ES')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2">{torneoSeleccionado.ubicacion}</Typography>
                </Box>
                <Chip 
                  label={torneoSeleccionado.deporte_nombre} 
                  size="small" 
                  color="primary" 
                />
              </Box>
            </Paper>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {torneoSeleccionado?.categorias_disponibles?.length > 0 ? (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="categoria-label">Seleccionar Categoría *</InputLabel>
              <Select
                labelId="categoria-label"
                value={categoriaSeleccionada}
                label="Seleccionar Categoría *"
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                disabled={procesando}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <em>Selecciona una categoría</em>
                </MenuItem>
                {torneoSeleccionado.categorias_disponibles.map(categoria => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        {categoria.nombre}
                      </Typography>
                      {categoria.descripcion && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {categoria.descripcion}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        {categoria.edad_minima && (
                          <Chip 
                            label={`${categoria.edad_minima}-${categoria.edad_maxima} años`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                        {categoria.distancia && (
                          <Chip 
                            label={`${categoria.distancia} ${categoria.unidad}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              Este torneo no requiere selección de categoría específica.
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            disabled={procesando}
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmarInscripcion} 
            variant="contained"
            disabled={procesando || (torneoSeleccionado?.categorias_disponibles?.length > 0 && !categoriaSeleccionada)}
            startIcon={procesando ? <CircularProgress size={16} /> : <CheckCircle />}
            size="large"
            sx={{ 
              borderRadius: 2, 
              px: 3,
              background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0083b0 0%, #006a8e 100%)'
              }
            }}
          >
            {procesando ? 'Procesando...' : 'Confirmar Inscripción'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GestionInscripciones;