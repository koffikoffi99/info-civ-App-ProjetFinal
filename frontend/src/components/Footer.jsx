import React from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white p-6 mt-8 shadow-inner">
            <div className="container mx-auto text-center">
                <p className="text-lg font-semibold mb-2">InfoCIV</p>
                <p className="text-sm text-gray-400">
                    Votre plateforme d'informations sur la Côte d'Ivoire.
                </p>

                <p className="mt-6 text-xs text-gray-500">
                    &copy; {currentYear} InfoCIV. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}