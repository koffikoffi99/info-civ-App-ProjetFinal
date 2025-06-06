import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-solid"></div>
            <p className="mt-4 text-blue-600 text-lg">Chargement...</p>
        </div>
    );
}