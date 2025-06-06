import React, { useState } from 'react';

export default function FilterSearch({ onFilterChange, onSearchSubmit }) {
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        onFilterChange(e.target.value); // Le filtre par catégorie peut toujours être instantané si désiré
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value); // Met à jour l'état du champ de saisie
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page si c'est un formulaire
        onSearchSubmit(searchTerm); // Déclenche la recherche avec le terme actuel
    };

    return (
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="flex-1">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                    Filtrer par catégorie:
                </label>
                <select
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Toutes les catégories</option>
                    <option value="Tourisme">Tourisme</option>
                    <option value="Santé">Santé</option>
                    <option value="Astuces">Astuces</option>
                    <option value="Loisirs">Loisirs</option>
                </select>
            </div>
            <div className="flex-1 flex flex-col justify-end">
                <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">
                    Rechercher:
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        placeholder="Rechercher par titre, description, lieu..."
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:shadow-outline flex-shrink-0"
                    >
                        Rechercher
                    </button>
                </div>
            </div>
        </form>
    );
}