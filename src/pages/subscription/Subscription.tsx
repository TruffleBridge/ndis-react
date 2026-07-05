import React from 'react';
import { Box, Typography } from '@mui/material';

const Subscription: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Subscription
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Manage subscription plans and billing.
      </Typography>
    </Box>
  );
};

export default Subscription;
