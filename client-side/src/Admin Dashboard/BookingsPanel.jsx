import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Admin Dashboard/Sidebar'; // Import the Sidebar component
import {
    Table, TableBody, TableCell, TableHead, TableRow, Button, CircularProgress, Paper, Select, MenuItem, Typography, FormControl, TextField, Box, Grid, Alert, Stack
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { BASE_URL } from '../utils/config';

const BookingManagement = ({ userId }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editBookingId, setEditBookingId] = useState(null); // Track which booking is being edited
    const [editedBooking, setEditedBooking] = useState({}); // Store the edited values
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' }); // Alert state

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                
                const response = await axios.get(`${BASE_URL}/Booking/View`);
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/Booking/Update/${id}`, { status: newStatus });
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === id ? { ...booking, status: newStatus } : booking
                )
            );
            setAlert({ open: true, message: 'Status updated successfully!', severity: 'success' });
        } catch (err) {
            console.error('Error updating status:', err);
            setAlert({ open: true, message: 'Failed to update status', severity: 'error' });
        }
    };

    const handleEditClick = (booking) => {
        setEditBookingId(booking._id);
        setEditedBooking(booking); // Initialize editedBooking with current booking details
    };

    const handleEditChange = (field, value) => {
        setEditedBooking(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveClick = async (id) => {
        try {
            await axios.put(`${BASE_URL}/Booking/Update/${id}`, editedBooking);
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === id ? { ...booking, ...editedBooking } : booking
                )
            );
            setEditBookingId(null); // Exit edit mode
            setAlert({ open: true, message: 'Booking updated successfully!', severity: 'success' });
        } catch (err) {
            console.error('Error saving booking:', err);
            setAlert({ open: true, message: 'Failed to save booking', severity: 'error' });
        }
    };

    const handleCancelClick = () => {
        setEditBookingId(null); // Exit edit mode without saving
    };

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    if (loading) return <Box display="flex" justifyContent="center" p={2}><CircularProgress /></Box>;
    if (error) return <Box display="flex" justifyContent="center" p={2}>{error}</Box>;

    return (
        <Grid container style={{ height: '100vh' }}>
            <Grid item xs={12} sm={3} md={2} style={{ backgroundColor: '#f4f4f4', padding: '16px' }}>
                <Sidebar />
            </Grid>
            <Grid item xs={12} sm={9} md={10} style={{ padding: '16px' }}>
                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Booking Management
                    </Typography>
                    <Box overflow="auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>User Name</TableCell>
                                    <TableCell>Package Name</TableCell>
                                    <TableCell>Contact Number</TableCell>
                                    <TableCell>Booking Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking._id}>
                                        <TableCell>
                                            {editBookingId === booking._id ? (
                                                <TextField
                                                    value={editedBooking.fullName || ''}
                                                    onChange={(e) => handleEditChange('fullName', e.target.value)}
                                                />
                                            ) : (
                                                booking.fullName
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editBookingId === booking._id ? (
                                                <TextField
                                                    value={editedBooking.tourName || ''}
                                                    onChange={(e) => handleEditChange('tourName', e.target.value)}
                                                />
                                            ) : (
                                                booking.tourName
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editBookingId === booking._id ? (
                                                <TextField
                                                    value={editedBooking.phone || ''}
                                                    onChange={(e) => handleEditChange('contactNumber', e.target.value)}
                                                />
                                            ) : (
                                                booking.phone
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(booking.bookAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {editBookingId === booking._id ? (
                                                <TextField
                                                    value={editedBooking.totalAmount || ''}
                                                    onChange={(e) => handleEditChange('totalAmount', e.target.value)}
                                                />
                                            ) : (
                                                `$${booking.totalAmount}`
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editBookingId === booking._id ? (
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={editedBooking.status || ''}
                                                        onChange={(e) => handleEditChange('status', e.target.value)}
                                                    >
                                                        <MenuItem value="Pending">Pending</MenuItem>
                                                        <MenuItem value="Confirmed">Confirmed</MenuItem>
                                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                booking.status
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editBookingId === booking._id ? (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleSaveClick(booking._id)}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="default"
                                                        onClick={handleCancelClick}
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleEditClick(booking)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handleStatusChange(booking._id, 'Cancelled')}
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                    {/* Display Alert */}
                    {alert.open && (
                        <Stack sx={{ width: '100%' }} spacing={2} style={{ marginTop: '16px' }}>
                            <Alert
                                severity={alert.severity}
                                action={
                                    <Button color="inherit" onClick={handleCloseAlert} startIcon={<Close />}>
                                        Close
                                    </Button>
                                }
                                onClose={handleCloseAlert}
                            >
                                {alert.message}
                            </Alert>
                        </Stack>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default BookingManagement;
