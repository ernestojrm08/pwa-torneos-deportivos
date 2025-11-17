import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getUsuario } from '../utils/auth';

export default function Layout({ children }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const usuario = getUsuario();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const isAdmin = usuario?.rol === 'admin';

  const menuItems = isAdmin 
    ? [
        { text: 'Inicio', path: '/dashboard' },
        { text: 'Torneos', path: '/dashboard/torneos' },
      ]
    : [
        { text: 'Mi Perfil', path: '/perfil' },
        { text: 'Torneos Disponibles', path: '/perfil/torneos' },
        { text: 'Mis Inscripciones', path: '/perfil/inscripciones' },
        { text: 'Mis Resultados', path: '/perfil/resultados' },
      ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {isAdmin ? 'Dashboard Administrativo' : 'Mi Perfil - Atleta'}
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>{usuario?.nombre}</Typography>
          <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 240 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => { 
                navigate(item.path); 
                setOpen(false); 
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}