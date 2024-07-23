import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';

const RecipePage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userIdFromSession = sessionStorage.getItem('user_id');
    setUserId(userIdFromSession);

    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost/recipe-app-backend/recipes/get.php?id=${id}`);
        const data = await response.json();
        if (data.status === 'success') {
          setRecipe(data.data);
        } else {
          console.error('Failed to fetch recipe:', data.message);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost/recipe-app-backend/comments/get.php?recipe_id=${id}`);
        const data = await response.json();
        if (data.status === 'success') {
          setComments(data.comments);
        } else {
          console.error('Failed to fetch comments:', data.message);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchRecipe();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error('User ID is required');
      return;
    }

    try {
      const response = await fetch('http://localhost/recipe-app-backend/comments/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          recipe_id: id,
          user_id: userId,
          comment: newComment
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setComments([...comments, { comment: newComment, username: 'You' }]);
        setNewComment('');
      } else {
        console.error('Failed to add comment:', data.error);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const downloadRecipe = () => {
    if (!recipe) return;
    const recipeContent = `Title: ${recipe.title}\nIngredients: ${recipe.ingredients}\nSteps:\n${recipe.steps}`;
    const blob = new Blob([recipeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${recipe.title}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const stepsArray = recipe.steps.split('\n').filter(step => step.trim() !== '');

  return (
    <div className="single-recipe-page">
      <h1>{recipe.title}</h1>
      <img src={`http://localhost/recipe-app-backend/recipes/${recipe.image_url}`} alt="Recipe Image" />
      <div className="recipe-details">
        <h2>Ingredients</h2>
        <p>{recipe.ingredients}</p>
        <h2>Steps</h2>
        <ol>
          {stepsArray.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <button onClick={downloadRecipe} className="download-recipe-button">Download Recipe</button>
      </div>
      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Submit Comment</button>
        </form>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <strong>{comment.fullname}:</strong> {comment.comment}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipePage;
