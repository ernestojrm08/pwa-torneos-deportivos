import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip
} from "@mui/material";
import {
  SportsEsports,
  EventAvailable,
  Group
} from "@mui/icons-material";
import TorneosTable from "../components/TorneosTable";
import EnhancedLayout from "../components/EnhancedLayout";
import api from "../services/api";

export default function TorneosDisponiblesPage() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchTorneos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/torneos/atleta/torneos-disponibles");
      setTorneos(data);
    } catch (err) {
      console.error("Error al cargar torneos:", err);
      setError("No se pudieron cargar los torneos disponibles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  // Estadísticas de torneos
  const totalTorneos = torneos.length;
  const torneosProximos = torneos.filter(t => new Date(t.fecha) > new Date()).length;
  const cuposTotales = torneos.reduce((sum, t) => sum + (t.cupos_disponibles || 0), 0);

  return (
    <EnhancedLayout>
      <Box sx={{ p: 3, width: "100%", maxWidth: "1300px", mx: "auto" }}>
        {/* Header Mejorado */}
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3, 
          textAlign: "center", 
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Torneos Disponibles
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Descubre y participa en los torneos activos. ¡Inscríbete y demuestra tu talento!
          </Typography>
        </Paper>

        {/* Estadísticas */}
        {torneos.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" fontWeight="800" color="#667eea">
                        {totalTorneos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Torneos Activos
                      </Typography>
                    </Box>
                    <SportsEsports sx={{ fontSize: 40, color: '#667eea', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" fontWeight="800" color="#4caf50">
                        {torneosProximos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Próximos Eventos
                      </Typography>
                    </Box>
                    <EventAvailable sx={{ fontSize: 40, color: '#4caf50', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" fontWeight="800" color="#ff9800">
                        {cuposTotales}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cupos Disponibles
                      </Typography>
                    </Box>
                    <Group sx={{ fontSize: 40, color: '#ff9800', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : torneos.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <SportsEsports sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay torneos disponibles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Pronto se publicarán nuevos torneos. ¡Mantente atento!
            </Typography>
          </Paper>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Lista de Torneos
              </Typography>
              <Chip 
                label={`${torneos.length} torneos disponibles`}
                color="primary"
                variant="outlined"
              />
            </Box>
            <TorneosTable
              data={torneos}
              page={page}
              limit={limit}
              total={torneos.length}
              onPageChange={setPage}
            />
          </>
        )}
      </Box>
    </EnhancedLayout>
  );
}