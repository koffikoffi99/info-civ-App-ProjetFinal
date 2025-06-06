import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext';

export default function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération du post:', err);
                setError('Impossible de charger le post. Il n\'existe peut-être pas ou a été supprimé.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
            try {
                setLoading(true);
                await api.delete(`/posts/${id}`);
                navigate('/'); // Rediriger vers la page d'accueil
            } catch (err) {
                console.error('Erreur lors de la suppression du post:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Erreur lors de la suppression du post.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-8 text-lg">{error}</p>;
    }

    if (!post) {
        return <p className="text-center text-gray-600 text-lg mt-10">Post non trouvé.</p>;
    }

    // Vérifier si l'utilisateur est l'auteur du post
    const isAuthor = user && post.author && user._id === post.author._id;

    return (
        <div className="container mx-auto p-4 max-w-3xl bg-white shadow-lg rounded-lg">
            {post.photo && (
                <div className="relative w-full h-96 overflow-hidden mb-6 rounded-md">
                    <img
                        src={post.photo}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/800x600/CCCCCC/000000?text=Image+non+disponible';
                        }}
                    />
                </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="text-lg text-gray-600 mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-base font-semibold">{post.category}</span>
                <span className="text-gray-500">📍 {post.location}</span>
                <span className="text-gray-500">Par {post.author ? post.author.name : 'Inconnu'}</span>
                <span className="text-gray-500">Créé le {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-800 text-xl leading-relaxed mb-6 whitespace-pre-wrap">{post.description}</p>

            {isAuthor && (
                <div className="flex gap-4 mt-6">
                    <Link
                        to={`/posts/${post._id}/edit`}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:shadow-outline transition duration-300"
                    >
                        Modifier
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:shadow-outline transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Suppression...' : 'Supprimer'}
                    </button>
                </div>
            )}
        </div>
    );
}