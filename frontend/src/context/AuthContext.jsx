import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { setAuthToken, getAuthToken, removeAuthToken } from '../utils/auth'; // Utilitaires pour le token

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const token = getAuthToken();
            if (token) {
                setAuthToken(token); // Configurer le token pour les requêtes futures
                try {
                    const res = await api.get('/auth/me'); // Appel à l'API pour obtenir les infos utilisateur
                    setUser(res.data);
                } catch (err) {
                    console.error("Erreur de chargement de l'utilisateur:", err);
                    removeAuthToken(); // Token invalide, le supprimer
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            setUser(res.data);
            setAuthToken(res.data.token); // Stocker le token
            navigate('/'); // Rediriger vers l'accueil après connexion
            return res.data;
        } catch (err) {
            console.error("Erreur de connexion:", err.response?.data?.message || err.message);
            throw err.response?.data?.message || 'Échec de la connexion';
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            setUser(res.data);
            setAuthToken(res.data.token);
            navigate('/'); // Rediriger après inscription
            return res.data;
        } catch (err) {
            console.error("Erreur d'inscription:", err.response?.data?.message || err.message);
            throw err.response?.data?.message || "Échec de l'inscription";
        }
    };

    const logout = () => {
        removeAuthToken();
        setUser(null);
        navigate('/login'); // Rediriger vers la page de connexion
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};