import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import { ThemeProvider, createTheme, CssBaseline, IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Sidebar from '../Admin Dashboard/Sidebar'; // Adjust the import path as needed
import UserManagement from '../Admin Dashboard/UsersPanel'; // Adjust the import path as needed
import BookingManagement from '../Admin Dashboard/BookingsPanel'; // Adjust the import path as needed
import HolidayPackageManagement from '../Admin Dashboard/HolidayPackagesPanel'; // Adjust the import path as needed
import Dashboard from '../Admin Dashboard/Dashboard'; // Adjust the import path as needed

const Admin = () => {
  const [mode, setMode] = useState('light');
  const navigate = useNavigate(); // Hook for navigation

  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Define themes
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const theme = mode === 'light' ? lightTheme : darkTheme;

  // This useEffect will automatically redirect to the dashboard if the user accesses "/admin"
  useEffect(() => {
    // When the admin path is visited, redirect to the dashboard by default
    navigate('/admin/dashboard');
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Dashboard Content */}
        <div className="flex-grow p-8 ml-20 transition-all duration-300" style={{ backgroundColor: theme.palette.background.default }}>
          {/* Theme Toggle Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </div>

          {/* Routes for different admin panels */}
          <Routes>
            {/* This ensures that the Dashboard is shown by default */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/bookings" element={<BookingManagement />} />
            <Route path="/admin/holiday-packages" element={<HolidayPackageManagement />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Admin;