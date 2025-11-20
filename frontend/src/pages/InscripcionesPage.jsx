import React from 'react';
import { Container } from '@mui/material';
import GestionInscripciones from '../components/GestionInscripciones';
import EnhancedLayout from '../components/EnhancedLayout';

const InscripcionesPage = () => {
  return (
    <EnhancedLayout>
      <Container>
        <GestionInscripciones />
      </Container>
    </EnhancedLayout>
  );
};

export default InscripcionesPage;