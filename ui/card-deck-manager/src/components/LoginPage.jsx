import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';

const LoginPage = () => {
    const { login, loading } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(username, password);
            setOpen(false);
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={loading} type="submit">
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginPage;
