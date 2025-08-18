import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedRole = localStorage.getItem('userRole');
            const storedEmail = localStorage.getItem('userEmail');
            // --- FIX: Read the username from localStorage ---
            const storedUsername = localStorage.getItem('username'); 
            
            if (storedRole && storedEmail && storedUsername) {
                // --- FIX: Add username to the user object on refresh ---
                setUser({ role: storedRole, email: storedEmail, username: storedUsername });
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        // --- FIX: Save the username to localStorage on login ---
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('username', userData.username); // <-- ADD THIS LINE
        
        setUser(userData);

        if (userData.role === 'admin') {
            navigate('/admin', { replace: true });
        } else if (userData.role === 'mechanic') {
            navigate('/mechanic', { replace: true });
        }
    };

    const logout = () => {
        localStorage.clear();
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