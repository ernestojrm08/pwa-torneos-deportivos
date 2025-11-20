import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Button,
  Box,
  Alert,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  SportsScore, 
  EventAvailable, 
  EmojiEvents,
  Person,
  CalendarMonth,
  LocationOn,
  Group,
  TrendingUp,
  NotificationsActive,
  Refresh,
  AccessTime,
  MilitaryTech
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PerfilAtleta = () => {
  const { user } = useAuth();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await api.get('/atleta/perfil');
      setDatos(response.data);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const inscribirseEnTorneo = async (torneoId, categoriaId = null) => {
    try {
      await api.post(`/atleta/inscribirse/${torneoId}`, {
        categoria_id: categoriaId
      });
      // Mostrar notificación de éxito
      setError('');
      cargarDatos(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error en la inscripción');
    }
  };

  const getProximoEvento = () => {
    if (!datos?.inscripciones?.length) return null;
    
    const inscripcionesActivas = datos.inscripciones.filter(
      ins => ins.estado_torneo === 'Inscrito' || ins.estado_torneo === 'En progreso'
    );
    
    if (inscripcionesActivas.length === 0) return null;
    
    return inscripcionesActivas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0];
  };

  const getEstadisticas = () => {
    const totalInscripciones = datos?.inscripciones?.length || 0;
    const totalResultados = datos?.resultados?.length || 0;
    const victorias = datos?.resultados?.filter(r => r.posicion === 1).length || 0;
    const podios = datos?.resultados?.filter(r => r.posicion <= 3).length || 0;

    return { totalInscripciones, totalResultados, victorias, podios };
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Box textAlign="center">
            <LinearProgress sx={{ width: 200, height: 8, borderRadius: 4, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Cargando tu dashboard...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  const estadisticas = getEstadisticas();
  const proximoEvento = getProximoEvento();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* HEADER MEJORADO */}
      <Paper 
        elevation={0}
        sx={{ 
          mb: 4, 
          p: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Elementos decorativos */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h3" fontWeight="800" gutterBottom>
                ¡Hola, {user?.nombre}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Bienvenido a tu centro de control deportivo
              </Typography>
            </Box>
            
            <Tooltip title="Actualizar datos">
              <IconButton 
                onClick={() => cargarDatos(true)}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255,255,255,0.2)',
                  '&:hover': { background: 'rgba(255,255,255,0.3)' }
                }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {estadisticas.totalInscripciones}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Inscripciones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {estadisticas.totalResultados}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Competencias
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {estadisticas.victorias}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Victorias
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700">
                  {estadisticas.podios}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Podios
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        
        {/* PRÓXIMO EVENTO */}
        {proximoEvento && (
          <Grid item xs={12}>
            <Card 
              elevation={2}
              sx={{ 
                borderLeft: '6px solid',
                borderLeftColor: 'warning.main',
                borderRadius: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsActive color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="600">
                    Próximo Evento
                  </Typography>
                </Box>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      {proximoEvento.torneo}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarMonth sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {new Date(proximoEvento.fecha).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{proximoEvento.ubicacion}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                    <Chip 
                      label={proximoEvento.estado_torneo}
                      color="warning"
                      variant="filled"
                      sx={{ fontWeight: '600', fontSize: '0.9rem' }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* MIS INSCRIPCIONES */}
        <Grid item xs={12} md={6}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventAvailable color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" fontWeight="600">
                    Mis Inscripciones
                  </Typography>
                </Box>
                <Chip 
                  label={datos?.inscripciones?.length || 0}
                  color="primary"
                  size="small"
                />
              </Box>
              
              {datos?.inscripciones?.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {datos.inscripciones.map(inscripcion => (
                    <Paper 
                      key={inscripcion.id} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        borderLeft: '4px solid',
                        borderLeftColor: 
                          inscripcion.estado_torneo === 'Inscrito' ? 'success.main' :
                          inscripcion.estado_torneo === 'En progreso' ? 'warning.main' : 'grey.500'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        {inscripcion.torneo}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonth sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(inscripcion.fecha).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {inscripcion.ubicacion}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={inscripcion.deporte} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        {inscripcion.categoria && (
                          <Chip 
                            label={inscripcion.categoria} 
                            size="small" 
                            color="secondary" 
                          />
                        )}
                        <Chip 
                          label={inscripcion.estado_torneo} 
                          size="small"
                          color={
                            inscripcion.estado_torneo === 'Inscrito' ? 'success' :
                            inscripcion.estado_torneo === 'En progreso' ? 'warning' : 'default'
                          }
                          variant="filled"
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventAvailable sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No tienes inscripciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inscríbete en algún torneo para comenzar
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* TORNEOS DISPONIBLES */}
        <Grid item xs={12} md={6}>
          <Card elevation={1} sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SportsScore color="success" sx={{ mr: 1 }} />
                  <Typography variant="h5" fontWeight="600">
                    Torneos Disponibles
                  </Typography>
                </Box>
                <Chip 
                  label={datos?.torneosDisponibles?.length || 0}
                  color="success"
                  size="small"
                />
              </Box>
              
              {datos?.torneosDisponibles?.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {datos.torneosDisponibles.map(torneo => (
                    <Paper 
                      key={torneo.id} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        background: torneo.cupos > 0 ? 'transparent' : 'rgba(0,0,0,0.02)'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        {torneo.nombre}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarMonth sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(torneo.fecha).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {torneo.ubicacion}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                          label={torneo.deporte} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={`${torneo.cupos} cupos`} 
                          size="small" 
                          color={torneo.cupos > 5 ? 'success' : torneo.cupos > 0 ? 'warning' : 'error'} 
                        />
                      </Box>

                      {torneo.categorias_disponibles?.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" fontWeight="600" display="block" gutterBottom>
                            Categorías disponibles:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {torneo.categorias_disponibles.slice(0, 3).map(categoria => (
                              <Chip
                                key={categoria.id}
                                label={categoria.nombre}
                                onClick={() => inscribirseEnTorneo(torneo.id, categoria.id)}
                                color="primary"
                                variant="outlined"
                                size="small"
                                clickable
                              />
                            ))}
                            {torneo.categorias_disponibles.length > 3 && (
                              <Chip
                                label={`+${torneo.categorias_disponibles.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      )}

                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => inscribirseEnTorneo(torneo.id)}
                        disabled={torneo.cupos <= 0}
                        fullWidth
                      >
                        {torneo.cupos > 0 ? 'Inscribirse' : 'Cupos Agotados'}
                      </Button>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <SportsScore sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No hay torneos disponibles
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vuelve pronto para nuevos torneos
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* MIS RESULTADOS */}
        <Grid item xs={12}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEvents color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="h5" fontWeight="600">
                    Mis Resultados
                  </Typography>
                </Box>
                <Chip 
                  label={datos?.resultados?.length || 0}
                  color="secondary"
                  size="small"
                />
              </Box>
              
              {datos?.resultados?.length > 0 ? (
                <Grid container spacing={2}>
                  {datos.resultados.map(resultado => (
                    <Grid item xs={12} sm={6} md={4} key={resultado.id}>
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: 3, 
                          textAlign: 'center',
                          borderRadius: 2,
                          background: resultado.posicion === 1 ? 
                            'linear-gradient(135deg, #FFD700 0%, #FFEC8B 100%)' :
                            resultado.posicion <= 3 ?
                            'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%)' :
                            'background.paper'
                        }}
                      >
                        <Box sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '50%', 
                          background: resultado.posicion === 1 ? '#FFD700' : 
                                    resultado.posicion === 2 ? '#C0C0C0' : 
                                    resultado.posicion === 3 ? '#CD7F32' : '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          color: resultado.posicion <= 3 ? 'white' : 'text.primary',
                          fontWeight: '800',
                          fontSize: '1.5rem'
                        }}>
                          {resultado.posicion}°
                        </Box>
                        
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                          {resultado.torneo}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {resultado.deporte}
                        </Typography>
                        
                        {resultado.categoria && (
                          <Chip 
                            label={resultado.categoria} 
                            size="small" 
                            color="primary"
                            sx={{ mb: 1 }}
                          />
                        )}
                        
                        {resultado.tiempo && (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight="500">
                              {resultado.tiempo}
                            </Typography>
                          </Box>
                        )}
                        
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                          {new Date(resultado.fecha).toLocaleDateString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EmojiEvents sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Aún no tienes resultados
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tus resultados aparecerán aquí después de competir
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {refreshing && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: 3,
            zIndex: 9999 
          }} 
        />
      )}
    </Container>
  );
};

export default PerfilAtleta;