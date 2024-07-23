import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import './styles.css';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
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
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost/recipe-app-backend/recipes/getAll.php');
        const data = await response.json();
        if (data.status === 'success') {
          setRecipes(data.data);
        } else {
          console.error('Error fetching recipes');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await fetch('http://localhost/recipe-app-backend/favorites/get.php', {
          credentials: 'include' 
        });
        const data = await response.json();
        if (data.status === 'success') {
          setFavorites(new Set(data.favorites.map(favorite => favorite.recipe_id)));
        } else {
          console.error('Error fetching favorites:', data.message);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchRecipes();
    fetchFavorites();
  }, []);

  const toggleFavorite = async (recipeId) => {
    const updatedFavorites = new Set(favorites);
    const isFavorite = updatedFavorites.has(recipeId);

    try {
      const response = await fetch(`http://localhost/recipe-app-backend/favorites/${isFavorite ? 'delete.php' : 'create.php'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipe_id: recipeId }),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (isFavorite) {
          updatedFavorites.delete(recipeId);
        } else {
          updatedFavorites.add(recipeId);
        }
        setFavorites(updatedFavorites);
        console.log(`Updated favorites: ${Array.from(updatedFavorites).join(', ')}`); // Log updated favorites
      } else {
        console.error('Error updating favorites:', data.message);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-links">
          <Link to="/Dashboard/addRecipe" className="nav-link">Dashboard</Link>
          <button onClick={handleLogout} className="nav-link button">Logout</button>
        </div>
      </nav>

      <div className="recipes-section">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <img src={`http://localhost/recipe-app-backend/recipes/${recipe.image_url}`} alt="Recipe Image" />
              <div className="recipe-info">
                <h3>{recipe.title}</h3>
                <div className="favorite-icon" onClick={() => toggleFavorite(recipe.id)}>
                  <FontAwesomeIcon
                    icon={favorites.has(recipe.id) ? filledStar:emptyStar }
                    className="favorite-icon-image"
                  />
                </div>
                <p>{recipe.ingredients}</p>
                <Link to={`/recipe/${recipe.id}`} className="view-recipe">View Recipe</Link>
              </div>
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
