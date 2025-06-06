import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [existingPhoto, setExistingPhoto] = useState(''); // Pour afficher l'image existante
    const [imageFile, setImageFile] = useState(null); // Pour la nouvelle image à uploader
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/posts/${id}`);
                const postData = response.data;

                // Vérifier si l'utilisateur est l'auteur
                if (!user || postData.author._id !== user._id) {
                    setError("Vous n'êtes pas autorisé à modifier ce post.");
                    setLoading(false);
                    return;
                }

                setTitle(postData.title);
                setCategory(postData.category);
                setLocation(postData.location);
                setDescription(postData.description);
                setExistingPhoto(postData.photo || ''); // Initialiser avec l'URL existante
            } catch (err) {
                console.error('Erreur lors de la récupération du post pour édition:', err.response?.data?.message || err.message);
                setError(err.response?.data?.message || 'Impossible de charger le post pour édition.');
            } finally {
                setLoading(false);
            }
        };

        if (user) { // Charger le post seulement si l'utilisateur est authentifié
            fetchPost();
        } else {
            // Si non connecté, rediriger
            setLoading(false);
            navigate('/login');
        }

    }, [id, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!user) {
            setError("Vous devez être connecté pour modifier un post.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('category', category);
            formData.append('location', location);
            formData.append('description', description);

            if (imageFile) {
                formData.append('image', imageFile); // Nouvelle image à uploader
            } else if (existingPhoto === '') {
                // Si l'utilisateur a supprimé l'image existante sans en uploader une nouvelle
                formData.append('photo', ''); // Envoyer une chaîne vide pour indiquer la suppression
            }

            await api.put(`/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate(`/posts/${id}`); // Rediriger vers la page du post après modification
        } catch (err) {
            console.error('Erreur lors de la mise à jour du post:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du post.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setExistingPhoto(''); // Effacer la prévisualisation de l'ancienne image si une nouvelle est sélectionnée
        } else {
            setImageFile(null);
        }
    };

    const handleRemoveExistingPhoto = () => {
        setExistingPhoto(''); // Vide l'URL de la photo existante
        setImageFile(null); // S'assurer qu'aucun nouveau fichier n'est sélectionné
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // Si l'utilisateur n'est pas l'auteur et que l'erreur est spécifique à cela, afficher un message d'accès refusé
    if (error === "Vous n'êtes pas autorisé à modifier ce post.") {
        return <p className="text-red-500 text-center mt-8 text-lg">Accès refusé: Vous n'êtes pas l'auteur de ce post.</p>;
    }
    // Pour les autres erreurs, afficher le message d'erreur générique
    if (error) {
        return <p className="text-red-500 text-center mt-8 text-lg">{error}</p>;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Modifier le Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Titre:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Catégorie:</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required>
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="Tourisme">Tourisme</option>
                        <option value="Santé">Santé</option>
                        <option value="Astuces">Astuces</option>
                        <option value="Loisirs">Loisirs</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Localisation:</label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required />
                </div>
                {/* Champ d'upload d'image */}
                <div>
                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image du post:</label>
                    {existingPhoto && !imageFile ? (
                        <div className="mb-2 p-2 border border-gray-200 rounded-md bg-gray-50">
                            <p className="text-sm text-gray-600 mb-1">Image actuelle:</p>
                            <img src={existingPhoto} alt="Current Post" className="max-w-xs h-auto rounded-md mb-2 shadow-sm" />
                            <button
                                type="button"
                                onClick={handleRemoveExistingPhoto}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-2 rounded-lg transition duration-300"
                            >
                                Supprimer l'image actuelle
                            </button>
                        </div>
                    ) : (
                        imageFile && (
                            <p className="text-sm text-gray-500 mt-2 mb-2">Nouveau fichier sélectionné: {imageFile.name}</p>
                        )
                    )}
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                        required></textarea>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:shadow-outline"
                    disabled={loading}>
                    {loading ? 'Mise à jour en cours...' : 'Mettre à jour le Post'}
                </button>
            </form>
        </div>
    );
}