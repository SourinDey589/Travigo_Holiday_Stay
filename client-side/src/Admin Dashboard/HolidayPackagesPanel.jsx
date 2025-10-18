import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Grid,
    Container,
    Typography,
    TablePagination,
    Alert,
    Snackbar
} from '@mui/material';
import Sidebar from '../Admin Dashboard/Sidebar'; // Adjust the import path as needed
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const HolidayPackagePanel = () => {
    const [packages, setPackages] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentPackage, setCurrentPackage] = useState({
        _id: '',
        title: '',
        city: '',
        address: '',
        distance: '',
        photo: null, // Store photo as file object
        desc: '',
        price: '',
        maxGroupSize: '',
        featured: false,
        seasonalPrice: '',
        seasonStart: '',
        seasonEnd: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null); // File state to keep track of the uploaded file
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch packages with pagination
    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/Tour/ViewAll`, {
                params: {
                    page,
                    limit: rowsPerPage
                }
            });
            if (Array.isArray(res.data.tour)) {
                setPackages(res.data.tour);
            } else {
                console.error('Unexpected response structure:', res.data);
                setPackages([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch packages');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const handleSave = async () => {
        setLoading(true);
        try {
            let photoUrl = currentPackage.photo;

            // If there's a new file selected, handle the upload
            if (file) {
                // Convert file to base64 string and store in state (simulate upload)
                const reader = new FileReader();
                reader.onloadend = () => {
                    photoUrl = reader.result; // Use base64 string as photo URL
                    savePackage(photoUrl);
                };
                reader.readAsDataURL(file); // Read file as data URL
            } else {
                savePackage(photoUrl);
            }
        } catch (err) {
            console.error('Error details:', err.message);
            setSnackbarMessage('Failed to save package');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setSnackbarOpen(true); // Show the snackbar
        }
    };

    const savePackage = async (photoUrl) => {
        const packageData = { ...currentPackage, photo: photoUrl };

        if (currentPackage._id) {
            // Update existing package
            await axios.put(`${BASE_URL}/Tour/Update/${currentPackage._id}`, packageData);
            setSnackbarMessage('Package updated successfully');
        } else {
            // Create new package
            await axios.post(`${BASE_URL}/Tour/Add`, packageData);
            setSnackbarMessage('Package added successfully');
        }

        setSnackbarSeverity('success');
        setOpen(false);
        await fetchPackages(); // Refresh package list after saving
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}/Tour/Delete/${id}`);
            setSnackbarMessage('Package deleted successfully');
            setSnackbarSeverity('success');
            await fetchPackages(); // Refresh the current page after deleting a package
        } catch (err) {
            console.error('Error details:', err.response ? err.response.data : err.message);
            setSnackbarMessage('Failed to delete package');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setConfirmDialogOpen(false); // Close the confirmation dialog
            setSnackbarOpen(true); // Show the snackbar
        }
    };

    const formatDate = (date) => {
        if (date) {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentPackage(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleOpenAddDialog = () => {
        setCurrentPackage({
            _id: '',
            title: '',
            city: '',
            address: '',
            distance: '',
            photo: null,
            desc: '',
            price: '',
            maxGroupSize: '',
            featured: false,
            seasonalPrice: '',
            seasonStart: '',
            seasonEnd: ''
        });
        setFile(null); // Clear file input
        setOpen(true);
    };

    const handleOpenEditDialog = (pkg) => {
        setCurrentPackage(pkg);
        setFile(null); // Clear file input
        setOpen(true);
    };

    const handleOpenConfirmDialog = (pkg) => {
        setPackageToDelete(pkg);
        setConfirmDialogOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page to 0 when rowsPerPage changes
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <CircularProgress />;
    if (error) return <div>{error}</div>;

    return (
        <Container maxWidth>
            <Grid container spacing={2}>
                <Sidebar />
                <Grid item xs={12} md={9}>
                    <Typography variant="h4" gutterBottom>
                        Holiday Packages
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenAddDialog} style={{ marginBottom: 16 }}>
                        Add New Package
                    </Button>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Serial No.</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Distance</TableCell>
                                <TableCell>Photo</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Seasonal Price</TableCell>
                                <TableCell>Season Start</TableCell>
                                <TableCell>Season End</TableCell>
                                <TableCell>Max Group Size</TableCell>
                                <TableCell>Featured</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {packages.length > 0 ? (
                                packages.map((pkg, index) => (
                                    <TableRow key={pkg._id}>
                                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                        <TableCell>{pkg.title}</TableCell>
                                        <TableCell>{pkg.city}</TableCell>
                                        <TableCell>{pkg.address}</TableCell>
                                        <TableCell>{pkg.distance}</TableCell>
                                        <TableCell>
                                            {pkg.photo ? (
                                                <img src={pkg.photo} alt={pkg.title} width={50} />
                                            ) : (
                                                'No photo'
                                            )}
                                        </TableCell>
                                        <TableCell>{pkg.desc}</TableCell>
                                        <TableCell>{pkg.price}</TableCell>
                                        <TableCell>{pkg.seasonalPrice}</TableCell>
                                        <TableCell>{formatDate(pkg.seasonStart).split("T")[0]}</TableCell>
                                        <TableCell>{formatDate(pkg.seasonEnd).split("T")[0]}</TableCell>
                                        <TableCell>{pkg.maxGroupSize}</TableCell>
                                        <TableCell>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={pkg.featured}
                                                        disabled
                                                    />
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align='center' >
                                            <Button variant="contained" color="primary" onClick={() => handleOpenEditDialog(pkg)}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleOpenConfirmDialog(pkg)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={13} align="center">
                                        No packages found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={packages.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Delete Package</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this package?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(packageToDelete._id)} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Add/Edit Package Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{currentPackage._id ? 'Edit Package' : 'Add New Package'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={currentPackage.title}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={currentPackage.city}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={currentPackage.address}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Distance"
                        name="distance"
                        value={currentPackage.distance}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange} // Update file state
                        style={{ marginBottom: 16 }}
                    />
                    {file && <Typography variant="body2">{file.name}</Typography>}
                    <TextField
                        fullWidth
                        label="Description"
                        name="desc"
                        value={currentPackage.desc}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={currentPackage.price}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Seasonal Price"
                        name="seasonalPrice"
                        type="number"
                        value={currentPackage.seasonalPrice}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Season Start"
                        name="seasonStart"
                        type="date"
                        value={currentPackage.seasonStart}
                        onChange={handleChange}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Season End"
                        name="seasonEnd"
                        type="date"
                        value={currentPackage.seasonEnd}
                        onChange={handleChange}
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Max Group Size"
                        name="maxGroupSize"
                        type="number"
                        value={currentPackage.maxGroupSize}
                        onChange={handleChange}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="featured"
                                checked={currentPackage.featured}
                                onChange={handleChange}
                            />
                        }
                        label="Featured"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        {currentPackage._id ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default HolidayPackagePanel;
