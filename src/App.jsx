import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Container, Typography, CircularProgress } from '@mui/material';
import BooksList from './components/BooksList';
import Header from './components/Header';

function App() {
  const [serverHealth, setServerHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check server health
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:8080/health');
        if (response.ok) {
          setServerHealth('Server is healthy');
        }
      } catch (error) {
        setServerHealth('Server is not available');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Server Status
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Checking...</Typography>
              </Box>
            ) : (
              <Typography color={serverHealth?.includes('healthy') ? 'success.main' : 'error.main'}>
                {serverHealth}
              </Typography>
            )}
          </CardContent>
        </Card>
        <BooksList />
      </Container>
    </Box>
  );
}

export default App;
