import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  LinearProgress,
  Avatar,
  Button,
  Container,
  alpha
} from '@mui/material';
import {
  People,
  SportsEsports,
  HowToReg,
  CalendarToday,
  LocationOn,
  Add,
  EmojiEvents
} from '@mui/icons-material';
import EnhancedLayout from '../components/EnhancedLayout';
import CreateTorneoForm from '../components/CreateTorneoForm.jsx';
import api from '../services/api';

// Componente de Tarjetas de Estadísticas
function StatsCard({ title, value, icon, color, trend }) {
  return (
    <Card 
      sx={{ 
        height: '140px',
        background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
        color: 'white',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        boxShadow: `0 4px 20px ${alpha(color, 0.3)}`,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 30px ${alpha(color, 0.4)}`
        }
      }}
    >
      {/* Efecto de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      
      <CardContent sx={{ p: 3, height: '100%', position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" fontWeight="800" sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontSize: '0.9rem', fontWeight: '600' }}>
              {title}
            </Typography>
            {trend && (
              <Chip 
                label={trend} 
                size="small" 
                sx={{ 
                  mt: 1, 
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.7rem',
                  height: 20
                }} 
              />
            )}
          </Box>
          <Avatar 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              width: 50, 
              height: 50,
              backdropFilter: 'blur(10px)'
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente de Tabla
function TorneosTable({ data, page, limit, total, onPageChange, loading }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'abierto': 
        return 'success';
      case 'en curso': 
        return 'warning';
      case 'finalizado': 
        return 'default';
      default: 
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Paper 
        sx={{ 
          mt: 3, 
          p: 6, 
          textAlign: 'center',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <SportsEsports sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="600">
          No hay torneos registrados
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
          Comienza creando el primer torneo usando el botón "Crear Torneo"
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        overflow: 'hidden', 
        width: '100%',
        borderRadius: 3,
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: 'primary.main',
              '& th': {
                borderBottom: '2px solid rgba(255,255,255,0.2)',
                py: 2
              }
            }}>
              <TableCell sx={{ color: 'white', fontWeight: '800', fontSize: '0.95rem' }}>
                Torneo
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: '800', fontSize: '0.95rem' }}>
                Fecha
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: '800', fontSize: '0.95rem' }}>
                Ubicación
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: '800', fontSize: '0.95rem' }}>
                Deporte
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: '800', fontSize: '0.95rem' }}>
                Estado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((torneo, index) => (
              <TableRow 
                key={torneo.id}
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                    {torneo.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ fontSize: 18, mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight="500">
                      {new Date(torneo.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 18, mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="body2" fontWeight="500">
                      {torneo.ubicacion}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={torneo.deporte || 'No especificado'} 
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ 
                      fontWeight: '600',
                      borderWidth: '2px'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={torneo.estado} 
                    color={getStatusColor(torneo.estado)}
                    size="small"
                    sx={{ 
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => {
          const newLimit = parseInt(e.target.value, 10);
          onPageChange(1, newLimit);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{ 
          borderTop: '1px solid rgba(0,0,0,0.08)',
          '& .MuiTablePagination-toolbar': {
            padding: 2
          }
        }}
      />
    </Paper>
  );
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = React.useState({});
  const [torneos, setTorneos] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const fetchTorneos = async (p = 1, l = limit) => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/torneos', { 
        params: { page: p, limit: l } 
      });
      setTorneos(data.data);
      setPage(data.page);
      setLimit(data.limit);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching torneos:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboardData();
    fetchTorneos(page, limit);
  }, []);

  const handlePageChange = (newPage, newLimit = limit) => {
    setPage(newPage);
    fetchTorneos(newPage, newLimit);
  };

  const handleTorneoCreated = () => {
    fetchDashboardData();
    fetchTorneos(1, limit);
  };

  // Datos para las tarjetas principales
  const mainStatsData = [
    {
      title: 'Usuarios Registrados',
      value: dashboardData.usuarios || 0,
      icon: <People />,
      color: '#667eea'
    },
    {
      title: 'Torneos Activos',
      value: dashboardData.torneos_activos || 0,
      icon: <SportsEsports />,
      color: '#764ba2'
    },
    {
      title: 'Inscripciones Totales',
      value: dashboardData.inscripciones || 0,
      icon: <HowToReg />,
      color: '#f093fb'
    }
  ];

  return (
    <EnhancedLayout>
      <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 1.5, md: 2, lg: 3 } }}>
        {/* Header Simplificado */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            <Box>
              <Typography 
                variant="h3" 
                fontWeight="800" 
                gutterBottom
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Dashboard Administrativo
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  fontWeight: '500',
                  opacity: 0.8
                }}
              >
                Resumen general y gestión del sistema deportivo
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: '700',
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Crear Torneo
            </Button>
          </Box>
        </Box>

        {/* Sección de Estadísticas Principales */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {mainStatsData.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <StatsCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Sección de Torneos Recientes - Toda la pantalla */}
        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 4,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 2,
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                <SportsEsports sx={{ fontSize: 24, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="700" sx={{ lineHeight: 1.2 }}>
                  Torneos Recientes
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
                  Gestión completa de competencias deportivas
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: '600' }}>
                Total: <Box component="span" sx={{ color: 'primary.main', fontWeight: '800' }}>{total}</Box> torneos
              </Typography>
            </Box>
          </Box>
          
          <TorneosTable
            data={torneos}
            page={page}
            limit={limit}
            total={total}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </Paper>

        {/* Dialog para crear torneo */}
        <CreateTorneoForm
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onTorneoCreated={handleTorneoCreated}
        />
      </Container>
    </EnhancedLayout>
  );
}