import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 250;

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Admin Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button component={Link} to="/users">
                            <ListItemText primary="User Management" />
                        </ListItem>
                        <ListItem button component={Link} to="/holiday-packages">
                            <ListItemText primary="Holiday Package Management" />
                        </ListItem>
                        <ListItem button component={Link} to="/bookings">
                            <ListItemText primary="Booking Management" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
