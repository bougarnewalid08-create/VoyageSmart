import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '../api/axios';

const FavoriteButton = ({ itemType, itemId, initialIsFavorite, onToggle, className }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent clicking the card

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save to favorites.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/favorites/toggle', {
        item_type: itemType,
        item_id: itemId
      });

      if (response.status === 200 || response.status === 201) {
        const newValue = response.data.status === 'added';
        setIsFavorite(newValue);
        if (onToggle) onToggle(newValue);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${className || 'absolute top-4 right-4 z-10'} w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        isFavorite ? 'bg-red-50 hover:bg-red-100 text-red-500 shadow-sm' : 'bg-white/80 backdrop-blur-md hover:bg-white text-gray-400 hover:text-red-500 shadow-sm'
      }`}
    >
      <Heart
        size={20}
        fill={isFavorite ? 'currentColor' : 'none'}
        className={`transition-all ${isFavorite ? 'scale-110' : 'scale-100'}`}
      />
    </button>
  );
};

export default FavoriteButton;
