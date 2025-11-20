import React from 'react';
import { Container } from '@mui/material';
import PerfilAtleta from '../components/PerfilAtleta';
import EnhancedLayout from '../components/EnhancedLayout';

const DashboardAtletaPage = () => {
  return (
    <EnhancedLayout>
      <Container>
        <PerfilAtleta />
      </Container>
    </EnhancedLayout>
  );
};

export default DashboardAtletaPage;