const Post = require('../models/Post');
// const { v2: cloudinary } = require('cloudinary');
const DatauriParser = require('datauri/parser');
const path = require('path');
const cloudinary = require('../config/cloudinary');


// Configurer Cloudinary avec les variables d'environnement
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convertir un Buffer en Data URI pour Cloudinary
const parser = new DatauriParser();
const formatBufferToDataUri = (fileBuffer, mimeType) => parser.format(path.extname(`file.${mimeType.split('/')[1]}`).toString(), fileBuffer);

// @desc    Obtenir tous les posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (search) {
            // Recherche insensible à la casse sur titre, description, et lieu
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        // Récupérer les posts et populer l'auteur avec son nom et email
        const posts = await Post.find(query).populate('author', 'name email').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des posts', error: error.message });
    }
};

// @desc    Obtenir un post spécifique
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email');
        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Erreur lors de la récupération du post par ID:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du post', error: error.message });
    }
};

// @desc    Créer un nouveau post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        // req.user est disponible grâce au middleware 'protect'
        const { title, category, location, description } = req.body;

        if (!title || !category || !location || !description) {
            return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
        }

        let photoUrl = null;
        if (req.file) { // req.file est ajouté par Multer si un fichier est uploadé
            const fileBuffer = req.file.buffer;
            const mimeType = req.file.mimetype;

            const dataUri = formatBufferToDataUri(fileBuffer, mimeType);
            const uploadResult = await cloudinary.uploader.upload(dataUri.content, {
                folder: 'infociv_posts', // Dossier dans Cloudinary
                resource_type: 'image' // S'assurer que c'est traité comme une image
            });
            photoUrl = uploadResult.secure_url; // URL sécurisée de l'image sur Cloudinary
        }

        const post = await Post.create({
            title,
            category,
            location,
            photo: photoUrl, // Enregistrer l'URL de l'image dans la base de données
            description,
            author: req.user.id, // L'ID de l'utilisateur authentifié
        });

        res.status(201).json(post);
    } catch (error) {
        console.error('Erreur lors de la création du post:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création du post', error: error.message });
    }
};

// @desc    Mettre à jour un post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
    try {
        const { title, category, location, description } = req.body;
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }

        // Vérifier si l'utilisateur connecté est l'auteur du post
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Non autorisé à modifier ce post' });
        }

        let photoUrl = post.photo; // Garder l'ancienne photo par défaut

        if (req.file) { // Si une nouvelle image est téléchargée
            const fileBuffer = req.file.buffer;
            const mimeType = req.file.mimetype;
            const dataUri = formatBufferToDataUri(fileBuffer, mimeType);
            const uploadResult = await cloudinary.uploader.upload(dataUri.content, {
                folder: 'infociv_posts',
                resource_type: 'image'
            });
            photoUrl = uploadResult.secure_url;
            // Optionnel: supprimer l'ancienne image de Cloudinary si elle existe
            if (post.photo) {
                const publicId = post.photo.split('/').pop().split('.')[0];
                // await cloudinary.uploader.destroy(`infociv_posts/${publicId}`); // Décommenter si vous voulez supprimer l'ancienne image
            }
        } else if (req.body.photo === '') { // Si le frontend a explicitement demandé de supprimer l'image
            photoUrl = null;
            if (post.photo) {
                const publicId = post.photo.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`infociv_posts/${publicId}`);
            }
        }


        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, category, location, photo: photoUrl, description },
            { new: true, runValidators: true } // Retourne le document mis à jour et exécute les validateurs de schéma
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du post:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du post', error: error.message });
    }
};

// @desc    Supprimer un post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post non trouvé' });
        }

        // Vérifier si l'utilisateur connecté est l'auteur du post
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Non autorisé à supprimer ce post' });
        }

        // Supprimer l'image de Cloudinary si le post en avait une
        if (post.photo) {
            const publicId = post.photo.split('/').pop().split('.')[0]; // Extraire le public_id de l'URL
            await cloudinary.uploader.destroy(`infociv_posts/${publicId}`); // Supprimer de Cloudinary
        }

        await post.deleteOne(); // Utiliser deleteOne() pour Mongoose 6+

        res.status(200).json({ message: 'Post supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du post:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du post', error: error.message });
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};