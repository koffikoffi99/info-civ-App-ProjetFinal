import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 text-gray-800 p-4">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
            <p className="text-2xl mb-8 text-center">Page non trouvée</p>
            <p className="text-lg text-center mb-10 max-w-md">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
                Retour à l'accueil
            </Link>
        </div>
    );
}