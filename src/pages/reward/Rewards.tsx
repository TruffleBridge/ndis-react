import React from 'react';
import { Box, Typography } from '@mui/material';

const Rewards: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Rewards
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Manage Rewards Points.
      </Typography>
    </Box>
  );
};

export default Rewards;
