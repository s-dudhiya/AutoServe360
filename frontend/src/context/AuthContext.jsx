import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Add a loading state to track the initial authentication check
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // On initial load, check localStorage for a user session
    useEffect(() => {
        try {
            const storedRole = localStorage.getItem('userRole');
            const storedEmail = localStorage.getItem('userEmail');
            
            if (storedRole && storedEmail) {
                setUser({ role: storedRole, email: storedEmail });
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        } finally {
            // Set loading to false after the check is complete
            setLoading(false);
        }
    }, []);

    // Login function
    const login = (userData) => {
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        setUser(userData);

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

    // Include loading in the context value
    const value = {
        user,
        loading,
        login,
        logout,
    };

    // Don't render children until the initial auth check is done
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};
