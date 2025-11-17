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
  useTheme,
  Button
} from '@mui/material';
import {
  People,
  SportsEsports,
  HowToReg,
  TrendingUp,
  CalendarToday,
  LocationOn,
  Add
} from '@mui/icons-material';
import Layout from '../components/Layout';
import CreateTorneoForm from '../components/CreateTorneoForm.jsx'; // ← Cambiado a .jsx
import api from '../services/api';

// Componente de Tarjetas Mejorado
function DashboardCard({ title, value, icon, color, trend }) {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="inherit" variant="h3" fontWeight="bold">
              {value}
            </Typography>
            <Typography color="inherit" variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              {title}
            </Typography>
            {trend && (
              <Chip 
                label={trend} 
                size="small" 
                sx={{ 
                  mt: 1, 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }} 
              />
            )}
          </Box>
          <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 60, height: 60 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente de Tabla Mejorado
function TorneosTable({ data, page, limit, total, onPageChange, loading }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'abierto': return 'success';
      case 'en curso': return 'warning';
      case 'finalizado': return 'default';
      default: return 'default';
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
      <Paper sx={{ mt: 3, p: 4, textAlign: 'center' }}>
        <SportsEsports sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay torneos registrados
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comienza creando el primer torneo usando el botón "Crear Torneo"
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mt: 3, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Torneo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ubicación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Deporte</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((torneo) => (
              <TableRow 
                key={torneo.id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {torneo.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    {new Date(torneo.fecha).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    {torneo.ubicacion}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={torneo.deporte || 'No especificado'} 
                    variant="outlined" 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={torneo.estado} 
                    color={getStatusColor(torneo.estado)}
                    size="small"
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
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTorneos(newPage, limit);
  };

  const handleTorneoCreated = () => {
    // Refrescar los datos después de crear un torneo
    fetchDashboardData();
    fetchTorneos(1, limit); // Volver a la primera página
  };

  const cardsData = [
    {
      title: 'Usuarios Registrados',
      value: dashboardData.usuarios || 0,
      icon: <People />,
      color: '#4CAF50',
      trend: '+12%'
    },
    {
      title: 'Torneos Activos',
      value: dashboardData.torneos_activos || 0,
      icon: <SportsEsports />,
      color: '#2196F3',
      trend: '+5%'
    },
    {
      title: 'Inscripciones Totales',
      value: dashboardData.inscripciones || 0,
      icon: <HowToReg />,
      color: '#FF9800',
      trend: '+8%'
    }
  ];

  return (
    <Layout>
      {/* Header con botón de crear torneo */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard Administrativo
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Resumen general y gestión de torneos
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1
          }}
        >
          Crear Torneo
        </Button>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DashboardCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Torneos Section */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Torneos Recientes
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Total: {total} torneos
          </Typography>
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
    </Layout>
  );
}