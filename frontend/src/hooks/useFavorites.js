import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../api/axios';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const isFavorite = (type, id) => {
    return favorites.some(fav => fav.item_type === type && Number(fav.item_id) === Number(id));
  };

  return { favorites, loading, isFavorite, refreshFavorites: fetchFavorites };
};
