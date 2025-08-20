import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // ✅ Better: store/retrieve a single object instead of 3 separate keys
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        // ✅ Store complete user object
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        if (userData.role === 'admin') {
            navigate('/admin', { replace: true });
        } else if (userData.role === 'mechanic') {
            navigate('/mechanic', { replace: true });
        }
    };

    const logout = () => {
        localStorage.removeItem('user'); // only clear what we set
        setUser(null);
        navigate('/login', { replace: true });
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
