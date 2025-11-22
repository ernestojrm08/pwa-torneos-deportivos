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
  EmojiEvents,
  Schedule,
  TrendingUp
} from "@mui/icons-material";
import ResultadosTable from "../components/ResultadosTable";
import EnhancedLayout from "../components/EnhancedLayout";
import api from "../services/api";

export default function MisResultadosPage() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchResultados = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/resultados/mis-resultados");
      setResultados(response.data);
    } catch (err) {
      console.error("Error al cargar resultados:", err);
      const errorMessage = err.response?.data?.message || "No se pudieron cargar tus resultados";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultados();
  }, []);

  // Estadísticas de resultados
  const totalResultados = resultados.length;
  const victorias = resultados.filter(r => r.posicion === 1).length;
  const podios = resultados.filter(r => r.posicion <= 3).length;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const resultadosPaginados = resultados.slice(startIndex, endIndex);

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
            Mis Resultados
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Consulta tus tiempos, posiciones y logros en los torneos
          </Typography>
        </Paper>

        {/* Estadísticas */}
        {resultados.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h3" fontWeight="800" color="#667eea">
                        {totalResultados}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Resultados
                      </Typography>
                    </Box>
                    <EmojiEvents sx={{ fontSize: 40, color: '#667eea', opacity: 0.7 }} />
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
                        {victorias}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Victorias
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 40, color: '#4caf50', opacity: 0.7 }} />
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
                        {podios}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Podios
                      </Typography>
                    </Box>
                    <Schedule sx={{ fontSize: 40, color: '#ff9800', opacity: 0.7 }} />
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
          <Alert severity="error" sx={{ mt: 2 }}>
            <strong>Error:</strong> {error}
          </Alert>
        ) : resultados.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <EmojiEvents sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no tienes resultados
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Participa en torneos para ver tus resultados y logros aquí.
            </Typography>
          </Paper>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                Historial de Resultados
              </Typography>
              <Chip 
                label={`${resultados.length} resultados`}
                color="primary"
                variant="outlined"
              />
            </Box>
            <ResultadosTable
              data={resultadosPaginados}
              page={page}
              limit={limit}
              total={resultados.length}
              onPageChange={setPage}
            />
          </>
        )}
      </Box>
    </EnhancedLayout>
  );
}