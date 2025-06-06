import api from '../api/api'; // Importez l'instance axios configurée

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        // Définir le token par défaut pour toutes les futures requêtes Axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        // Supprimer le token des headers par défaut
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
};