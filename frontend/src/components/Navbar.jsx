import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth(); // Récupère l'état de l'utilisateur depuis le contexte d'authentification

    return (
        <nav className="bg-blue-800 p-4 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold rounded-md px-2 py-1 hover:bg-blue-700 transition duration-300">InfoCIV</Link>
                <div className="flex items-center space-x-6">
                    <Link to="/" className="hover:text-blue-200 transition duration-300">Accueil</Link>

                    {/* Conditionnel: Afficher "Créer un Post" UNIQUEMENT si l'utilisateur est connecté */}
                    {user ? (
                        <Link to="/create-post" className="hover:text-blue-200 transition duration-300">Créer un Post</Link>
                    ) : null}

                    {/* Conditionnel: Afficher le nom de l'utilisateur et "Déconnexion" si connecté */}
                    {user ? (
                        <>
                            <span className="text-white font-medium">Bienvenue, {user.name}</span>
                            <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition duration-300">Déconnexion</button>
                        </>
                    ) : (
                        // Afficher "Connexion" et "Inscription" si non connecté
                        <>
                            <Link to="/login" className="hover:text-blue-200 transition duration-300">Connexion</Link>
                            <Link to="/register" className="hover:text-blue-200 transition duration-300">Inscription</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}