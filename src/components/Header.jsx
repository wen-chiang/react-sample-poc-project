import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Library Management System
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            React Sample POC
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
