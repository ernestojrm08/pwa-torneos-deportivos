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
  Category  // ✅ AGREGAR ESTA IMPORTACIÓN
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
    { text: 'Gestión de Categorías', path: '/dashboard/categorias', icon: <Category /> }, // ✅ CORREGIDO
    { text: 'Gestión de Torneos', path: '/dashboard/torneos', icon: <SportsEsports /> },
    { text: 'Usuarios', path: '/dashboard/usuarios', icon: <Group /> }
  ];

  const atletaMenuItems = [
    { text: 'Mi Perfil', path: '/perfil', icon: <Person /> },
    { text: 'Torneos Disponibles', path: '/perfil/torneos', icon: <SportsEsports /> },
    { text: 'Mis Inscripciones', path: '/perfil/inscripciones', icon: <HowToReg /> },
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
    <Box sx={{ display: 'flex' }}>
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

      {/* Drawer para navegación */}
      <Box
        component="nav"
        sx={{ width: 85 }}
      >
        {/* Drawer móvil (temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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

        {/* Drawer desktop (permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: 'white',
              boxShadow: '2px 0 12px rgba(0,0,0,0.05)'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          marginTop: { xs: '64px', md: 0 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          minHeight: { xs: 'calc(100vh - 64px)', md: '100vh' },
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}