import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    const MAX_DESCRIPTION_LENGTH = 150;

    const truncateDescription = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const truncatedDescription = truncateDescription(post.description, MAX_DESCRIPTION_LENGTH);

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
            {post.photo && (
                <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                    <img
                        src={post.photo}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback image in case the original fails to load
                            e.currentTarget.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Image+non+disponible';
                        }}
                    />
                </div>
            )}
            <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                <div className="text-sm text-gray-600 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">{post.category}</span>
                    <span className="text-gray-500">📍 {post.location}</span>
                </div>
                <p className="text-gray-700 text-base flex-grow mb-4">{truncatedDescription}</p>
                <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Par {post.author ? post.author.name : 'Inconnu'}</span>
                    <Link to={`/posts/${post._id}`} className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                        Lire la suite
                    </Link>
                </div>
            </div>
        </div>
    );
}