import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // On initial load, check localStorage for a user session
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const storedEmail = localStorage.getItem('userEmail');
        if (storedRole && storedEmail) {
            setUser({ role: storedRole, email: storedEmail });
        }
    }, []);

    // Login function
    const login = (userData) => {
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        setUser(userData);

        // Redirect based on role after setting the user state
        if (userData.role === 'admin') {
            navigate('/admin', { replace: true });
        } else if (userData.role === 'mechanic') {
            navigate('/mechanic', { replace: true });
        }
    };

    // Logout function
    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login', { replace: true });
    };

    const value = {
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};
