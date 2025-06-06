const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['Tourisme', 'Santé', 'Astuces', 'Loisirs'],
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        photo: {
            type: String, // Pour l'URL de l'image (Cloudinary)
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Référence au modèle User
            required: true,
        },
    },
    {
        timestamps: true, // Ajoute createdAt et updatedAt
    }
);

module.exports = mongoose.model('Post', PostSchema);