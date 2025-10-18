import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Divider, styled } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BookingsIcon from '@mui/icons-material/EventAvailable';
import RevenueIcon from '@mui/icons-material/AttachMoney';
import TourIcon from '@mui/icons-material/FlightTakeoff';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Styled components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: '#C7253E',
  color: 'white',
  justifyContent: 'space-between',
}));

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Return the sidebar to expanded state when the route changes
    setCollapsed(false);
  }, [location]);

  const handleToggle = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 80 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 80 : 240,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          backgroundColor: '#C7253E',
          overflowX: 'hidden',
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleToggle} style={{ color: 'white' }}>
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
        {!collapsed && (
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        )}
      </DrawerHeader>
      <Divider sx={{ backgroundColor: 'white' }} />
      <List>
        <ListItem button component={Link} to="/admin/revenue">
          <ListItemIcon>
            <RevenueIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Dashboard" sx={{ color: 'white' }} />
          )}
        </ListItem>
        <ListItem button component={Link} to="/admin/users">
          <ListItemIcon>
            <PeopleIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="User Management" sx={{ color: 'white' }} />
          )}
        </ListItem>
        <ListItem button component={Link} to="/admin/bookings">
          <ListItemIcon>
            <BookingsIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Booking Management" sx={{ color: 'white' }} />
          )}
        </ListItem>
        <ListItem button component={Link} to="/admin/holiday-packages">
          <ListItemIcon>
            <TourIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="Holiday Package Management" sx={{ color: 'white' }} />
          )}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
