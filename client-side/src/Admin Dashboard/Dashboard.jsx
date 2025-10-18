import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Typography,
  Drawer,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Sidebar from './Sidebar.jsx';
import { BASE_URL } from '../utils/config';

const DashboardContainer = ({ children }) => (
  <div style={{ padding: '16px', background: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
    {children}
  </div>
);

const StyledCard = ({ color, small, children }) => (
  <Card style={{ minWidth: 275, margin: '16px', textAlign: 'center', backgroundColor: color || '#fff', color: '#000', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transition: '0.3s', maxWidth: small ? 320 : 'auto' }}>
    {children}
  </Card>
);

const ReviewContainer = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
    {children}
  </div>
);

const ReviewText = ({ children }) => (
  <div style={{ marginLeft: '16px', textAlign: 'left' }}>
    {children}
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    reviews: [], // New state for reviews
  });

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, bookingsResponse, revenueResponse, reviewsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/count`),
          axios.get(`${BASE_URL}/GetTotalbooking`),
          axios.get(`${BASE_URL}/revenue`),
          axios.get(`${BASE_URL}/analysereview`), // Fetch review data
        ]);

        setData({
          totalUsers: userResponse.data.count,
          totalBookings: bookingsResponse.data.totalBookings,
          totalRevenue: revenueResponse.data.totalRevenue,
          reviews: reviewsResponse.data.reviews, // Store reviews data
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <DashboardContainer>
        <CircularProgress color="primary" />
      </DashboardContainer>
    );
  if (error)
    return (
      <DashboardContainer>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </DashboardContainer>
    );

  const drawerWidth = isCollapsed ? 80 : 240;

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      {/* Sidebar (Drawer) - Not Permanent */}
      <Drawer
        variant="temporary" // Changed from 'permanent' to 'temporary'
        open={isDrawerOpen} // Controls the visibility of the drawer
        onClose={() => setDrawerOpen(false)} // Close the drawer when clicked outside
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            padding: 0, // Remove extra padding
          },
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#3f51b5', color: '#fff', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)} style={{ color: 'white' }}>
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Sidebar />
      </Drawer>

      {/* Main content */}
      <main
        style={{
          flexGrow: 1,
          padding: '16px',
          transition: 'margin 0.3s',
          marginLeft: isDrawerOpen ? drawerWidth + 'px' : '0', // Adjust margin based on sidebar state
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center main content
        }}
      >
        {/* Hamburger Menu Icon to open Drawer */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setDrawerOpen(true)} // Open drawer on click
          sx={{ marginBottom: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <DashboardContainer>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="textPrimary">
            Admin Dashboard Overview
          </Typography>

          {/* Metrics Section */}
          <Grid container spacing={4} justifyContent="center">
            {/* Total Users Card */}
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard color="#7C93C3">
                <CardHeader title="Total Users" />
                <CardContent>
                  <Typography variant="h4" component="p" color="textPrimary">
                    {data.totalUsers.toLocaleString()}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Total Bookings Card */}
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard color="#80AF81">
                <CardHeader title="Total Bookings" />
                <CardContent>
                  <Typography variant="h4" component="p" color="textPrimary">
                    {data.totalBookings.toLocaleString()}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Total Revenue Card */}
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard color="#F05A7E">
                <CardHeader title="Total Revenue" />
                <CardContent>
                  <Typography variant="h4" component="p" color="textPrimary">
                    ${data.totalRevenue.toLocaleString()}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>

          {/* Reviews Section - Infinite Circular Scrolling */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" color="textPrimary">
              Customer Reviews
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', animation: 'scroll-left 20s linear infinite' }}>
                {data.reviews.length > 0 ? (
                  [...data.reviews, ...data.reviews].map((review, index) => (
                    <StyledCard key={index} color="#E0E0E0" small>
                      <CardContent>
                        <ReviewContainer>
                          <Avatar src={review.userImg} alt={review.username} />
                          <ReviewText>
                            <Typography variant="h6" component="p" color="textPrimary">
                              {review.title}
                            </Typography>
                            <Typography variant="body1" component="p" color="textSecondary">
                              {review.username}
                            </Typography>
                            <Typography variant="body2" component="p" color="textSecondary">
                              {review.reviewText}
                            </Typography>
                            <Typography variant="body2" component="p" color="textPrimary">
                              Rating: {review.rating}/5
                            </Typography>
                          </ReviewText>
                        </ReviewContainer>
                      </CardContent>
                    </StyledCard>
                  ))
                ) : (
                  <Typography>No reviews found.</Typography>
                )}
              </div>
            </div>
          </div>
        </DashboardContainer>
      </main>
    </div>
  );
};

export default Dashboard;