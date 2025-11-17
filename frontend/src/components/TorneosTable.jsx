    import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';

export default function TorneosTable({ data, page, limit, total, onPageChange }) {
  return (
    <Paper sx={{ mt: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Deporte</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.nombre}</TableCell>
                <TableCell>{t.fecha}</TableCell>
                <TableCell>{t.ubicacion}</TableCell>
                <TableCell>{t.deporte || '-'}</TableCell>
                <TableCell>{t.estado}</TableCell>
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
      />
    </Paper>
  );
}
