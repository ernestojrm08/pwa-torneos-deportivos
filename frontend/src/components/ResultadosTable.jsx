import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination,
  Chip,
  Box 
} from '@mui/material';

export default function ResultadosTable({ data, page, limit, total, onPageChange }) {
  const formatTiempo = (tiempo) => {
    if (!tiempo) return '-';
    // Convierte el formato TIME de MySQL a algo más legible
    const [horas, minutos, segundos] = tiempo.split(':');
    return `${horas !== '00' ? horas + 'h ' : ''}${minutos}m ${segundos}s`;
  };

  const getPosicionColor = (posicion) => {
    switch(posicion) {
      case 1: return 'success';
      case 2: return 'warning'; 
      case 3: return 'secondary';
      default: return 'default';
    }
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'finalizado': return 'success';
      case 'en curso': return 'warning';
      case 'abierto': return 'info';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ mt: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Torneo</TableCell>
              <TableCell>Deporte</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Posición</TableCell>
              <TableCell>Tiempo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((resultado) => (
              <TableRow 
                key={resultado.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover' 
                  } 
                }}
              >
                <TableCell>
                  <Box>
                    <strong>{resultado.torneo_nombre}</strong>
                  </Box>
                </TableCell>
                <TableCell>{resultado.deporte_nombre}</TableCell>
                <TableCell>
                  {new Date(resultado.torneo_fecha).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell>{resultado.torneo_ubicacion}</TableCell>
                <TableCell>
                  <Chip 
                    label={`${resultado.posicion}°`}
                    color={getPosicionColor(resultado.posicion)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {formatTiempo(resultado.tiempo)}
                  </Box>
                </TableCell>
                <TableCell>
                  {resultado.categoria_nombre || '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={resultado.torneo_estado}
                    color={getEstadoColor(resultado.torneo_estado)}
                    size="small"
                    variant="outlined"
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
        labelRowsPerPage="Resultados por página:"
      />
    </Paper>
  );
}