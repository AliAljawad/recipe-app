import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import './styles.css';

const UserRecipes = () => {
  const [recipes, setRecipes] = useState([]);
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
    const fetchUserRecipes = async () => {
      if (!userId) return; 
      
      try {
        const response = await fetch(`http://localhost/recipe-app-backend/recipes/getbyUser.php?user_id=${userId}`);
        const data = await response.json();
        if (data.status === 'success') {
          setRecipes(data.data);
        } else {
          console.error('Error fetching user recipes:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user recipes:', error);
      }
    };

    fetchUserRecipes();
  }, [userId]);

  return (
    <div>
    <Sidebar />
    <div className="user-recipes-page">
      <div className="content">
        <h1>My Recipes</h1>
        <div className="recipes-section">
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <img src={`http://localhost/recipe-app-backend/recipes/${recipe.image_url}`} alt="Recipe Image" />
                <div className="recipe-info">
                  <h3>{recipe.title}</h3>
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
    </div>
    </div>
  );
};

export default UserRecipes;
