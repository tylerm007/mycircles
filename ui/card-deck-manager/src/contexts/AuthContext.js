import React, { createContext, useContext, useState } from 'react';
import LoginPage from '../components/LoginPage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        try {
            // Simulate an API call for authentication
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setAuthenticated(true);
                setToken(data.auth_);
                setUser({
                    email: data.email,
                    name: data.name,
                });
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAuthenticated(false);
        setUser(null);
    };

    const value = {
        authenticated,
        user,
        login,
        logout,
        loading,
    };

    if (!authenticated) {
        return <LoginPage />;
    }

    return React.createElement(AuthContext.Provider, { value }, children);
};