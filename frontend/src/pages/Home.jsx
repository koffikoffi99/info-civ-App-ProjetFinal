import React, { useState, useEffect } from 'react';
import api from '../api/api';
import PostCard from '../components/PostCard.jsx';
import FilterSearch from '../components/FilterSearch.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentSearchTerm, setCurrentSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = '/posts';
                const params = new URLSearchParams();
                if (categoryFilter) {
                    params.append('category', categoryFilter);
                }
                if (currentSearchTerm) {
                    params.append('search', currentSearchTerm);
                }
                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await api.get(url);
                setPosts(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des posts:', err);
                setError('Impossible de charger les posts. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [categoryFilter, currentSearchTerm]); // Dépendances du useEffect

    const handleFilterChange = (category) => {
        setCategoryFilter(category);
    };

    const handleSearchSubmit = (searchTerm) => {
        setCurrentSearchTerm(searchTerm);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-8 text-lg">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Découvrez InfoCIV</h1>
            <FilterSearch onFilterChange={handleFilterChange} onSearchSubmit={handleSearchSubmit} />

            {posts.length === 0 ? (
                <p className="text-center text-gray-600 text-lg mt-10">Aucun post trouvé pour cette recherche/filtre.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}