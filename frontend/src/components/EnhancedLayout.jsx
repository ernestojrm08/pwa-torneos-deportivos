import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Chip,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  Typography,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  Dashboard,
  SportsEsports,
  Person,
  HowToReg,
  EmojiEvents,
  Logout,
  Group,
  Menu as MenuIcon,
  Category
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAuth, getUsuario } from '../utils/auth';

export default function EnhancedLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const usuario = getUsuario();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAdmin = usuario?.rol === 'admin';

  const adminMenuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Gestión de Deportes', path: '/dashboard/deportes', icon: <SportsEsports /> },
    { text: 'Gestión de Categorías', path: '/dashboard/categorias', icon: <Category /> },
    { text: 'Gestión de Torneos', path: '/dashboard/torneos', icon: <SportsEsports /> },
    { text: 'Usuarios', path: '/dashboard/usuarios', icon: <Group /> }
  ];

  const atletaMenuItems = [
    { text: 'Mi Dashboard', path: '/atleta/dashboard', icon: <Dashboard /> },
    { text: 'Gestionar Inscripciones', path: '/atleta/inscripciones', icon: <HowToReg /> },
    { text: 'Torneos Disponibles', path: '/perfil/torneos', icon: <SportsEsports /> },
    { text: 'Mis Resultados', path: '/perfil/resultados', icon: <EmojiEvents /> }
  ];

  const menuItems = isAdmin ? adminMenuItems : atletaMenuItems;

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const drawerWidth = 250;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del Drawer */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography variant="h6" fontWeight="800" color="#1e293b">
          Panel
        </Typography>
        <Chip
          label={isAdmin ? 'Administrador' : 'Atleta'}
          color="primary"
          size="small"
          sx={{ 
            mt: 1, 
            fontWeight: '600',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
      </Box>

      <Divider />

      {/* Lista de Navegación */}
      <List sx={{ p: 1, flex: 1 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right">
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                mx: 0.5,
                backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'white' : '#475569',
                background: isActive(item.path) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive(item.path)
                    ? 'primary.dark'
                    : 'rgba(102, 126, 234, 0.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemIcon
                sx={{ color: isActive(item.path) ? 'white' : '#667eea', minWidth: 40 }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? '600' : '500',
                  fontSize: '0.9rem'
                }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Divider />

      {/* Footer del Drawer */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" fontWeight="600" color="#1e293b">
            {usuario?.nombre}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {usuario?.email}
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ 
            textTransform: 'none',
            borderRadius: 2,
            borderColor: '#667eea',
            color: '#667eea',
            fontWeight: '600',
            '&:hover': {
              borderColor: '#764ba2',
              backgroundColor: 'rgba(102, 126, 234, 0.04)'
            }
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar solo para móviles */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: '100%',
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            color: 'black',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            borderBottom: '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: '#667eea' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ color: '#1e293b', fontWeight: 'bold' }}>
              Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer para desktop - POSITION FIXED */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: 'white',
              boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
              position: 'fixed', // ✅ FIXED para que no ocupe espacio
              top: 0,
              left: 0,
              height: '100vh',
              zIndex: theme.zIndex.drawer
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer para móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: 'white',
            boxShadow: '2px 0 12px rgba(0,0,0,0.05)'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Contenido Principal - SIN MARGEN IZQUIERDO */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          // ✅ SIN MARGEN IZQUIERDO - el sidebar es fixed
          mt: { xs: '64px', md: 0 },
          backgroundColor: '#f8fafc',
          position: 'relative'
        }}
      >
        {/* Contenedor que se adapta al sidebar fijo */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { 
              xs: '100%', 
              md: `calc(100% - ${drawerWidth}px)` // ✅ Resta el ancho del sidebar
            },
            ml: { md: `${drawerWidth}px` }, // ✅ Empuja el contenido cuando hay sidebar
            p: { xs: 2, sm: 3, md: 3 },
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {/* Contenedor centrado del contenido */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '1200px',
              // ✅ Centrado automático
              mx: 'auto'
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}