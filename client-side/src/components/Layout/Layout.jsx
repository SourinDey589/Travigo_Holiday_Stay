import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Routers from '../../router/Routers';
import Footer from '../Footer/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const Layout = () => {
  const location = useLocation();

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Theme state and toggle function
  const [mode, setMode] = useState('light');

  const handleThemeChange = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#f5f5f5',
      },
      text: {
        primary: '#000', // Black text for light mode
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
      },
      text: {
        primary: '#fff', // White text for dark mode
      },
    },
  });

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header onThemeToggle={handleThemeChange} currentMode={mode} />
      <Routers />
      {!isAdminRoute && <Footer />}
    </ThemeProvider>
  );
};

export default Layout;