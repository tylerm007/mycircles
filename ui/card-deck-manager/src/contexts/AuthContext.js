import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '../keycloak';

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
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
                });

                setAuthenticated(authenticated);

                if (authenticated) {
                    setUser({
                        username: keycloak.tokenParsed?.preferred_username,
                        email: keycloak.tokenParsed?.email,
                        name: keycloak.tokenParsed?.name,
                    });
                }
            } catch (error) {
                console.error('Failed to initialize Keycloak:', error);
            } finally {
                setLoading(false);
            }
        };

        initKeycloak();
    }, []);

    const login = () => {
        keycloak.login();
    };

    const logout = () => {
        keycloak.logout();
    };

    const getToken = () => {
        return keycloak.token;
    };

    const refreshToken = () => {
        return keycloak.updateToken(30);
    };

    const value = {
        authenticated,
        user,
        login,
        logout,
        getToken,
        refreshToken,
        loading,
    };

    return React.createElement(AuthContext.Provider, { value }, children);
};