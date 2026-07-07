import React from 'react';
import { Box, Typography } from '@mui/material';

const Bookings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Bookings
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Track and manage all service bookings.
      </Typography>
    </Box>
  );
};

export default Bookings;
