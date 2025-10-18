import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Admin Dashboard/Sidebar';
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography, 
    CircularProgress, 
    TextField, 
    IconButton, 
    Paper, 
    Avatar, 
    Select, 
    MenuItem 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { BASE_URL } from '../utils/config';

const TransparentBackground = styled('main')(({ theme }) => ({
    flexGrow: 1,
    padding: '16px',
    background: 'rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
    backdropFilter: 'blur(10px)',
    minHeight: '100vh',
}));

const TableCellStyled = styled(TableCell)(({ theme }) => ({
    borderBottom: 'none',
    padding: '16px',
    color: theme.palette.text.primary,
}));

const TableRowStyled = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.selected,
    }
}));

const TableHeadStyled = styled(TableHead)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    '& th': {
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const AvatarLarge = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: 'auto',
}));

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [viewUser, setViewUser] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedRole, setEditedRole] = useState('User'); // Set default role to 'User'

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/Users`);
                setUsers(res.data.users);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/Users/Delete/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setEditedUsername(user.username);
        setEditedEmail(user.email);
        setEditedRole(user.role); // Set role in state
        setOpenEditDialog(true);
    };

    const handleView = (user) => {
        setViewUser(user);
        setOpenViewDialog(true);
    };

    const handleSave = async () => {
        try {
            await axios.put(`${BASE_URL}/Users/Update/${editUser.id}`, {
                username: editedUsername,
                email: editedEmail,
                role: editedRole, // Include role in update
            });
            setUsers(users.map(user => user.id === editUser.id ? { ...user, username: editedUsername, email: editedEmail, role: editedRole } : user));
            setOpenEditDialog(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error" align="center">{error}</Typography>;

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <TransparentBackground>
                <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                    User Management
                </Typography>
                <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHeadStyled>
                                <TableRow>
                                    <TableCellStyled>Username</TableCellStyled>
                                    <TableCellStyled>Email</TableCellStyled>
                                    <TableCellStyled>Role</TableCellStyled> {/* New Column for Role */}
                                    <TableCellStyled align="right">Actions</TableCellStyled>
                                </TableRow>
                            </TableHeadStyled>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRowStyled key={user.id}>
                                        <TableCellStyled>{user.username}</TableCellStyled>
                                        <TableCellStyled>{user.email}</TableCellStyled>
                                        <TableCellStyled>{user.role}</TableCellStyled> {/* Display User Role */}
                                        <TableCellStyled align="right">
                                            <ActionButton onClick={() => handleDelete(user.id)} color="error">
                                                <DeleteIcon />
                                            </ActionButton>
                                            <ActionButton onClick={() => handleEdit(user)} color="primary">
                                                <EditIcon />
                                            </ActionButton>
                                            <ActionButton onClick={() => handleView(user)} color="info">
                                                <VisibilityIcon />
                                            </ActionButton>
                                        </TableCellStyled>
                                    </TableRowStyled>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Edit User Dialog */}
                <Dialog fullWidth maxWidth="sm" open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Username"
                            type="text"
                            fullWidth
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            type="email"
                            fullWidth
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                        />
                        <Select
                            margin="dense"
                            label="Role"
                            fullWidth
                            value={editedRole}
                            onChange={(e) => setEditedRole(e.target.value)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditDialog(false)} color="default">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* View User Dialog */}
                {viewUser && (
                    <Dialog fullWidth maxWidth="sm" open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
                        <DialogTitle>User Profile</DialogTitle>
                        <DialogContent>
                            <AvatarLarge src={`${BASE_URL}${viewUser.photo}`} alt={viewUser.username} />
                            <Typography variant="h6" align="center" gutterBottom>
                                {viewUser.username}
                            </Typography>
                            <Typography variant="body1" align="center" gutterBottom>
                                Email: {viewUser.email}
                            </Typography>
                            {/* Add more fields as needed */}
                            <Typography variant="body2" color="textSecondary" align="center">
                                Additional information or metadata about the user can be added here.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenViewDialog(false)} color="default">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </TransparentBackground>
        </div>
    );
};

export default UserManagement;