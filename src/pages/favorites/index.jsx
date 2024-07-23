import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import './styles.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const userIdFromSession = sessionStorage.getItem('user_id');
    if (userIdFromSession) {
      setUserId(userIdFromSession);
    } else {
      window.location.href = '/login';
      setError('User not logged in or user_id not found in session storage');
    }
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return; 

      try {
        const response = await fetch(`http://localhost/recipe-app-backend/favorites/getFavorite.php`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.status === 'success') {
          setFavorites(data.favorites);
        } else {
          console.error('Error fetching favorites:', data.message);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div className="favorites-page">
      <Sidebar />
      <div className="content">
        <h1>My Favorite Recipes</h1>
        <div className="recipes-section">
          {favorites.length > 0 ? (
            favorites.map(favorite => (
              <div key={favorite.id} className="recipe-card">
                <img src={`http://localhost/recipe-app-backend/recipes/${favorite.image_url}`} alt="Recipe Image" />
                <div className="recipe-info">
                  <h3>{favorite.title}</h3>
                  <p>{favorite.ingredients}</p>
                  <Link to={`/recipe/${favorite.id}`} className="view-recipe">View Recipe</Link>
                </div>
              </div>
            ))
          ) : (
            <p>No favorite recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
