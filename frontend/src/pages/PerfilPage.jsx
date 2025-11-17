import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Container,
  Snackbar
} from '@mui/material';
import {
  Person,
  SportsEsports,
  CalendarToday,
  EmojiEvents,
  HowToReg,
  LocationOn,
  TrendingUp,
  Group
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { getUsuario } from '../utils/auth';
import api from '../services/api';

// Componente para las pestañas
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PerfilPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [datosAtleta, setDatosAtleta] = useState({
    inscripciones: [],
    resultados: [],
    torneosDisponibles: []
  });
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const usuario = getUsuario();

  useEffect(() => {
    fetchDatosAtleta();
  }, []);

  const fetchDatosAtleta = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data } = await api.get('/atleta/perfil');
      setDatosAtleta(data);
      
    } catch (err) {
      console.error('Error fetching datos atleta:', err);
      setError('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirse = async (torneoId, torneoNombre) => {
    try {
      await api.post(`/atleta/inscribirse/${torneoId}`);
      
      setSnackbar({
        open: true,
        message: `¡Inscripción exitosa en ${torneoNombre}!`,
        severity: 'success'
      });
      
      // Recargar datos
      fetchDatosAtleta();
      
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Error al inscribirse',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Inscrito': return 'success';
      case 'En progreso': return 'warning';
      case 'Finalizado': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header del Perfil */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 3, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'white',
                    color: '#667eea',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    border: '4px solid rgba(255,255,255,0.3)'
                  }}
                >
                  {usuario?.nombre?.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {usuario?.nombre}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                    {usuario?.email}
                  </Typography>
                  <Chip 
                    label="Atleta Deportivo" 
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {datosAtleta.inscripciones.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Inscripciones
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {datosAtleta.resultados.filter(r => r.posicion === 1).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Victorias
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {datosAtleta.resultados.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Torneos
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Navegación por Pestañas */}
        <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }
            }}
          >
            <Tab icon={<Person />} label="MI PERFIL" />
            <Tab icon={<HowToReg />} label="MIS INSCRIPCIONES" />
            <Tab icon={<EmojiEvents />} label="MIS RESULTADOS" />
            <Tab icon={<SportsEsports />} label="TORNEOS DISPONIBLES" />
          </Tabs>

          {/* Contenido de las pestañas */}
          <Box sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1 }} />
                        Información Personal
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Nombre completo
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {usuario?.nombre}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Correo electrónico
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {usuario?.email}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Tipo de cuenta
                        </Typography>
                        <Chip 
                          label="Atleta" 
                          color="primary" 
                          icon={<Group />}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ mr: 1 }} />
                        Estadísticas
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ mb: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total de torneos jugados
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {datosAtleta.resultados.length}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Inscripciones activas
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="secondary">
                          {datosAtleta.inscripciones.filter(i => i.estado === 'Inscrito').length}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Mejor posición
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {datosAtleta.resultados.length > 0 
                            ? `${Math.min(...datosAtleta.resultados.map(r => r.posicion))}°` 
                            : 'N/A'
                          }
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <HowToReg sx={{ mr: 1 }} />
                    Mis Inscripciones
                  </Typography>
                  
                  {datosAtleta.inscripciones.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <HowToReg sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No tienes inscripciones
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Participa en torneos disponibles para comenzar tu historial deportivo
                      </Typography>
                      <Button 
                        variant="contained"
                        onClick={() => setTabValue(3)}
                      >
                        Ver Torneos Disponibles
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {datosAtleta.inscripciones.map((inscripcion) => (
                        <ListItem 
                          key={inscripcion.id} 
                          divider
                          sx={{ py: 2 }}
                        >
                          <ListItemIcon>
                            <SportsEsports color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="h6" component="div">
                                {inscripcion.torneo}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <CalendarToday sx={{ fontSize: 16 }} />
                                  <Typography variant="body2">
                                    {new Date(inscripcion.fecha).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  {inscripcion.deporte} • {inscripcion.ubicacion}
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip 
                            label={inscripcion.estado} 
                            color={getEstadoColor(inscripcion.estado)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmojiEvents sx={{ mr: 1 }} />
                    Mis Resultados
                  </Typography>
                  
                  {datosAtleta.resultados.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <EmojiEvents sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No hay resultados registrados
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tus resultados aparecerán aquí después de participar en torneos
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {datosAtleta.resultados.map((resultado) => (
                        <Grid item xs={12} md={6} key={resultado.id}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <EmojiEvents sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
                                <Typography variant="h6" component="div">
                                  {resultado.torneo}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Posición
                                  </Typography>
                                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                                    {resultado.posicion}°
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Fecha
                                  </Typography>
                                  <Typography variant="body1" fontWeight="medium">
                                    {new Date(resultado.fecha).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <SportsEsports sx={{ mr: 1 }} />
                    Torneos Disponibles
                  </Typography>
                  
                  {datosAtleta.torneosDisponibles.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <SportsEsports sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No hay torneos disponibles
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vuelve pronto para ver los próximos torneos programados
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {datosAtleta.torneosDisponibles.map((torneo) => (
                        <Grid item xs={12} md={6} lg={4} key={torneo.id}>
                          <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {torneo.nombre}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {new Date(torneo.fecha).toLocaleDateString()}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {torneo.ubicacion}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Chip 
                                  label={`${torneo.cupos} cupos`} 
                                  size="small"
                                  color={torneo.cupos > 5 ? 'success' : 'warning'}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {torneo.deporte}
                                </Typography>
                              </Box>
                              
                              <Button 
                                variant="contained" 
                                fullWidth
                                startIcon={<HowToReg />}
                                onClick={() => handleInscribirse(torneo.id, torneo.nombre)}
                                disabled={torneo.cupos === 0}
                              >
                                {torneo.cupos === 0 ? 'Sin Cupos' : 'Inscribirse'}
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </TabPanel>
          </Box>
        </Paper>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Container>
    </Layout>
  );
}