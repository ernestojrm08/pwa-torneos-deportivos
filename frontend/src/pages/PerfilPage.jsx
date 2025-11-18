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
  Snackbar,
  alpha,
  useTheme
} from '@mui/material';
import {
  Person,
  SportsEsports,
  CalendarToday,
  EmojiEvents,
  HowToReg,
  LocationOn,
  TrendingUp,
  Group,
  MilitaryTech,
  EventAvailable,
  WorkspacePremium,
  NotificationsActive
} from '@mui/icons-material';
import EnhancedLayout from '../components/EnhancedLayout';
import { useAuth } from '../context/AuthContext';
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

// Componente de Estadística Mejorado
function StatCard({ value, label, icon, color = '#667eea', trend }) {
  return (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
      color: 'white',
      transition: 'all 0.3s ease',
      borderRadius: 3,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${alpha(color, 0.3)}`
      }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
              {label}
            </Typography>
            {trend && (
              <Chip 
                label={trend} 
                size="small" 
                sx={{ 
                  mt: 1, 
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontSize: '0.6rem',
                  height: 20
                }} 
              />
            )}
          </Box>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: 'rgba(255,255,255,0.2)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 20 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente de Torneo Disponible Mejorado
function TorneoCard({ torneo, onInscribirse }) {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 3,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
        }
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
        <Box sx={{ flex: 1, mb: 2 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#1e293b', minHeight: '48px' }}>
            {torneo.nombre}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <CalendarToday sx={{ fontSize: 18, mr: 1, color: '#64748b' }} />
            <Typography variant="body2" sx={{ color: '#475569', fontWeight: '500' }}>
              {torneo.fecha ? new Date(torneo.fecha).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              }) : 'Fecha por definir'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ fontSize: 18, mr: 1, color: '#64748b' }} />
            <Typography variant="body2" sx={{ color: '#475569' }}>
              {torneo.ubicacion || 'Ubicación por definir'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Chip 
              label={torneo.deporte || 'General'} 
              size="small"
              variant="outlined"
              sx={{ 
                fontWeight: '500',
                borderColor: '#cbd5e1',
                color: '#475569'
              }} 
            />
            <Chip 
              label={`${torneo.cupos || 0} cupos`} 
              size="small"
              color={(torneo.cupos || 0) > 5 ? 'success' : (torneo.cupos || 0) > 0 ? 'warning' : 'error'}
              sx={{ fontWeight: '600' }}
            />
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<HowToReg />}
          onClick={() => onInscribirse(torneo.id, torneo.nombre)}
          disabled={(torneo.cupos || 0) === 0}
          sx={{
            borderRadius: 2,
            py: 1.2,
            background: (torneo.cupos || 0) === 0 
              ? '#94a3b8' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: '600',
            fontSize: '0.9rem',
            '&:hover': {
              boxShadow: (torneo.cupos || 0) === 0 ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
              transform: (torneo.cupos || 0) === 0 ? 'none' : 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {(torneo.cupos || 0) === 0 ? 'Sin Cupos' : 'Inscribirse'}
        </Button>
      </CardContent>
    </Card>
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
  const { user } = useAuth();
  const theme = useTheme();

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
      // Datos de ejemplo para desarrollo
      setDatosAtleta({
        inscripciones: [
          {
            id: 1,
            torneo: 'Torneo de Verano',
            fecha: '2024-07-15',
            deporte: 'Fútbol',
            ubicacion: 'Estadio Municipal',
            estado: 'Inscrito'
          }
        ],
        resultados: [
          {
            id: 1,
            torneo: 'Campeonato Regional',
            fecha: '2024-06-20',
            posicion: 1
          }
        ],
        torneosDisponibles: [
          {
            id: 1,
            nombre: 'Torneo de Invierno',
            fecha: '2024-08-10',
            ubicacion: 'Polideportivo Central',
            deporte: 'Básquetbol',
            cupos: 12
          }
        ]
      });
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
    switch (estado?.toLowerCase()) {
      case 'inscrito': 
      case 'activo': 
        return 'success';
      case 'en progreso': 
      case 'pendiente': 
        return 'warning';
      case 'finalizado': 
      case 'completado': 
        return 'default';
      default: 
        return 'default';
    }
  };

  const getMedalColor = (posicion) => {
    switch (posicion) {
      case 1: return '#FFD700'; // Oro
      case 2: return '#C0C0C0'; // Plata
      case 3: return '#CD7F32'; // Bronce
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <EnhancedLayout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: 3
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="#64748b">
            Cargando tu perfil deportivo...
          </Typography>
        </Box>
      </EnhancedLayout>
    );
  }

  return (
    <EnhancedLayout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header del Perfil Mejorado */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 5 }, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Efectos de fondo */}
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
              background: 'rgba(255,255,255,0.05)',
            }}
          />
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                <Avatar
                  sx={{
                    width: { xs: 80, md: 120 },
                    height: { xs: 80, md: 120 },
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 'bold',
                    border: '4px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                  }}
                >
                  {user?.nombre?.charAt(0) || 'A'}
                </Avatar>
                <Box sx={{ position: 'relative', zIndex: 2, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h3" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                    {user?.nombre || 'Atleta Deportivo'}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: '300' }}>
                    {user?.email || 'usuario@ejemplo.com'}
                  </Typography>
                  <Chip 
                    label="Atleta Deportivo" 
                    icon={<WorkspacePremium />}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      py: 1
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <StatCard 
                    value={datosAtleta.inscripciones?.length || 0}
                    label="Inscripciones"
                    icon={<HowToReg />}
                    color="#10b981"
                    trend="+2"
                  />
                </Grid>
                <Grid item xs={4}>
                  <StatCard 
                    value={datosAtleta.resultados?.filter(r => r.posicion === 1).length || 0}
                    label="Victorias"
                    icon={<MilitaryTech />}
                    color="#f59e0b"
                    trend="+1"
                  />
                </Grid>
                <Grid item xs={4}>
                  <StatCard 
                    value={datosAtleta.resultados?.length || 0}
                    label="Torneos"
                    icon={<EmojiEvents />}
                    color="#3b82f6"
                    trend="+3"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            action={
              <Button color="inherit" size="small" onClick={() => setError('')}>
                Cerrar
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Navegación por Pestañas Mejorada */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: '600',
                fontSize: '0.9rem',
                py: 2,
                px: 3,
                textTransform: 'none',
                color: '#64748b',
                minHeight: '60px',
                '&.Mui-selected': {
                  color: '#667eea',
                }
              },
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                height: 3
              }
            }}
          >
            <Tab icon={<Person />} label="Mi Perfil" />
            <Tab icon={<HowToReg />} label="Mis Inscripciones" />
            <Tab icon={<EmojiEvents />} label="Mis Resultados" />
            <Tab icon={<SportsEsports />} label="Torneos Disponibles" />
          </Tabs>

          {/* Contenido de las pestañas */}
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.04)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#1e293b',
                        fontWeight: '700',
                        mb: 2
                      }}>
                        <Person sx={{ mr: 2, color: '#667eea' }} />
                        Información Personal
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Typography variant="caption" color="#64748b" gutterBottom>
                          Nombre completo
                        </Typography>
                        <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b' }}>
                          {user?.nombre || 'No especificado'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Typography variant="caption" color="#64748b" gutterBottom>
                          Correo electrónico
                        </Typography>
                        <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b' }}>
                          {user?.email || 'No especificado'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Typography variant="caption" color="#64748b" gutterBottom>
                          Tipo de cuenta
                        </Typography>
                        <Chip 
                          label="Atleta Deportivo" 
                          color="primary" 
                          icon={<Group />}
                          sx={{ fontWeight: '600', mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.04)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#1e293b',
                        fontWeight: '700',
                        mb: 2
                      }}>
                        <TrendingUp sx={{ mr: 2, color: '#667eea' }} />
                        Estadísticas Deportivas
                      </Typography>
                      <Divider sx={{ mb: 3 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            bgcolor: '#f0f9ff',
                            borderRadius: 2,
                            border: '2px solid #e0f2fe'
                          }}>
                            <Typography variant="h4" fontWeight="800" color="#0369a1">
                              {datosAtleta.resultados?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="#64748b" fontWeight="500">
                              Torneos Jugados
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            bgcolor: '#f0fdf4',
                            borderRadius: 2,
                            border: '2px solid #dcfce7'
                          }}>
                            <Typography variant="h4" fontWeight="800" color="#15803d">
                              {datosAtleta.inscripciones?.filter(i => i.estado === 'Inscrito').length || 0}
                            </Typography>
                            <Typography variant="body2" color="#64748b" fontWeight="500">
                              Inscripciones Activas
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            bgcolor: '#fef7ed',
                            borderRadius: 2,
                            border: '2px solid #fed7aa'
                          }}>
                            <Typography variant="h4" fontWeight="800" color="#ea580c">
                              {datosAtleta.resultados?.length > 0 
                                ? `${Math.min(...datosAtleta.resultados.map(r => r.posicion))}°` 
                                : 'N/A'
                              }
                            </Typography>
                            <Typography variant="body2" color="#64748b" fontWeight="500">
                              Mejor Posición
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Resto de los TabPanels */}
            <TabPanel value={tabValue} index={1}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.04)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1e293b',
                    fontWeight: '700',
                    mb: 2
                  }}>
                    <HowToReg sx={{ mr: 2, color: '#667eea' }} />
                    Mis Inscripciones
                  </Typography>
                  
                  {!datosAtleta.inscripciones || datosAtleta.inscripciones.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <HowToReg sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                      <Typography variant="h6" color="#64748b" gutterBottom fontWeight="600">
                        No tienes inscripciones
                      </Typography>
                      <Typography variant="body1" color="#94a3b8" sx={{ mb: 3 }}>
                        Participa en torneos disponibles para comenzar tu historial deportivo
                      </Typography>
                      <Button 
                        variant="contained"
                        onClick={() => setTabValue(3)}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: '600'
                        }}
                      >
                        Explorar Torneos Disponibles
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {datosAtleta.inscripciones.map((inscripcion) => (
                        <ListItem 
                          key={inscripcion.id} 
                          sx={{ 
                            py: 2,
                            mb: 1,
                            borderRadius: 2,
                            bgcolor: '#f8fafc',
                            border: '1px solid rgba(0,0,0,0.04)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: '#f1f5f9',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <ListItemIcon>
                            <SportsEsports sx={{ color: '#667eea', fontSize: 28 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="h6" component="div" sx={{ color: '#1e293b', fontWeight: '600' }}>
                                {inscripcion.torneo}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <CalendarToday sx={{ fontSize: 16, color: '#64748b' }} />
                                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: '500' }}>
                                    {inscripcion.fecha ? new Date(inscripcion.fecha).toLocaleDateString('es-ES', { 
                                      day: 'numeric', 
                                      month: 'long', 
                                      year: 'numeric' 
                                    }) : 'Fecha no especificada'}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  {inscripcion.deporte || 'Deporte no especificado'} • {inscripcion.ubicacion || 'Ubicación no especificada'}
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip 
                            label={inscripcion.estado || 'Desconocido'} 
                            color={getEstadoColor(inscripcion.estado)}
                            sx={{ 
                              fontWeight: '600',
                              fontSize: '0.8rem'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.04)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1e293b',
                    fontWeight: '700',
                    mb: 2
                  }}>
                    <EmojiEvents sx={{ mr: 2, color: '#667eea' }} />
                    Mis Resultados
                  </Typography>
                  
                  {!datosAtleta.resultados || datosAtleta.resultados.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <EmojiEvents sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                      <Typography variant="h6" color="#64748b" gutterBottom fontWeight="600">
                        No hay resultados registrados
                      </Typography>
                      <Typography variant="body1" color="#94a3b8">
                        Tus resultados aparecerán aquí después de participar en torneos
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {datosAtleta.resultados.map((resultado) => (
                        <Grid item xs={12} sm={6} md={4} key={resultado.id}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              height: '100%',
                              borderRadius: 3,
                              transition: 'all 0.3s ease',
                              border: `2px solid ${getMedalColor(resultado.posicion)}`,
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                              }
                            }}
                          >
                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 1 
                              }}>
                                <EmojiEvents sx={{ 
                                  color: getMedalColor(resultado.posicion), 
                                  fontSize: 32, 
                                  mr: 1 
                                }} />
                                <Typography variant="h6" component="div" fontWeight="700" sx={{ fontSize: '1rem' }}>
                                  {resultado.torneo}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 1
                              }}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Posición
                                  </Typography>
                                  <Typography 
                                    variant="h3" 
                                    fontWeight="800" 
                                    sx={{ color: getMedalColor(resultado.posicion), fontSize: '2rem' }}
                                  >
                                    {resultado.posicion}°
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ textAlign: 'right' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Fecha
                                  </Typography>
                                  <Typography variant="body2" fontWeight="600">
                                    {resultado.fecha ? new Date(resultado.fecha).toLocaleDateString() : 'N/A'}
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
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.04)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: '#1e293b',
                    fontWeight: '700',
                    mb: 2
                  }}>
                    <SportsEsports sx={{ mr: 2, color: '#667eea' }} />
                    Torneos Disponibles
                  </Typography>
                  
                  {!datosAtleta.torneosDisponibles || datosAtleta.torneosDisponibles.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <SportsEsports sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
                      <Typography variant="h6" color="#64748b" gutterBottom fontWeight="600">
                        No hay torneos disponibles
                      </Typography>
                      <Typography variant="body1" color="#94a3b8">
                        Vuelve pronto para ver los próximos torneos programados
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {datosAtleta.torneosDisponibles.map((torneo) => (
                        <Grid item xs={12} sm={6} md={4} key={torneo.id}>
                          <TorneoCard 
                            torneo={torneo} 
                            onInscribirse={handleInscribirse}
                          />
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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            severity={snackbar.severity} 
            sx={{ 
              borderRadius: 2,
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </EnhancedLayout>
  );
}