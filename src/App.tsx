import { CssBaseline, ThemeProvider } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import { MenuProvider } from '@/context/menuContext';
import { MenuRouteSync } from '@/context/MenuRouteSync';
import theme from '@/theme/theme';
import { GlobalSnackbar } from '@/components';

function App() {

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