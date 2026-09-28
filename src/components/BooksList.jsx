import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import { Refresh as RefreshIcon, Error as ErrorIcon } from '@mui/icons-material';

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/books');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          action={
            <Button color="error" size="small" onClick={fetchBooks}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Books
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchBooks}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Refresh
        </Button>
      </Box>

      {books.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="textSecondary">
            No books found. Make sure the server is running.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {book.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#764ba2', fontWeight: 'bold', mb: 1 }}
                  >
                    {book.author}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    ISBN: {book.isbn}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Year: {book.publishedYear}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default BooksList;
