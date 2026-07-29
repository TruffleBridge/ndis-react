import { useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import { MenuProvider } from '@/context/menuContext';
import { MenuRouteSync } from '@/context/MenuRouteSync';
import theme from '@/theme/theme';
import { GlobalSnackbar } from '@/components';
import usePermissionStore from '@/store/usePermissionStore';

function App() {
  const fetchRolePermissions = usePermissionStore((s) => s.fetchRolePermissions);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // unga token key enna nu confirm pannunga
    if (token) {
      fetchRolePermissions();
    }
  }, []);

  return (
    <MenuProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MenuRouteSync />
        <AppRoutes />
        <GlobalSnackbar />
      </ThemeProvider>
    </MenuProvider>
  );
}

export default App;