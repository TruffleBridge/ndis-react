import React from 'react';
import { Box, Typography } from '@mui/material';

const Budget: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Budget
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Monitor budget allocations and spending.
      </Typography>
    </Box>
  );
};

export default Budget;
