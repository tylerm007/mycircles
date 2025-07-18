import React, { createContext, useContext, useState } from 'react';
import LoginPage from '../components/LoginPage.jsx';

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

    const login = async (username, password) => {
        setLoading(true);
        try {
            // Simulate an API call for authentication
            const response = await fetch('http://localhost:5656/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setAuthenticated(true);
                localStorage.setItem('authToken', data.access_token);
                setUser({
                    username: data.username,
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
        localStorage.removeItem('authToken');
    };

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    const value = {
        authenticated,
        user,
        login,
        logout,
        loading,
        getToken, // Ensure getToken is included in the context value
    };

    if (!authenticated) {
        return React.createElement(AuthContext.Provider, { value }, React.createElement(LoginPage));
    }

    return React.createElement(AuthContext.Provider, { value }, children);
};