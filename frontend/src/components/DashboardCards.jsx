import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

export default function DashboardCards({ data }) {
  const { usuarios = 0, torneos_activos = 0, inscripciones = 0 } = data || {};
  const items = [
    { title: 'Usuarios Registrados', value: usuarios },
    { title: 'Torneos Activos', value: torneos_activos },
    { title: 'Inscripciones Totales', value: inscripciones }
  ];

  return (
    <Grid container spacing={2}>
      {items.map((it) => (
        <Grid item xs={12} sm={4} key={it.title}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">{it.title}</Typography>
              <Typography variant="h4">{it.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
