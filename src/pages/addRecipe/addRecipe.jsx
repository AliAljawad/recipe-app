import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import './styles.css';

const AddRecipe = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userIdFromSession = sessionStorage.getItem('user_id');
        if (userIdFromSession) {
            setUserId(userIdFromSession);
        } else {
            window.location.href = '/login';
            setError('User not logged in or user_id not found in session storage');
        }
    }, []);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError('User ID is required');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('title', title);
        formData.append('ingredients', ingredients);
        formData.append('steps', steps); // Send steps as a plain text string
        formData.append('image', image);

        try {
            const response = await axios.post(
                'http://localhost/recipe-app-backend/recipes/create.php',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (response.data.status === 'success') {
                setSuccess(response.data.message);
                setError('');
                setTitle('');
                setIngredients('');
                setSteps('');
                setImage(null);
            } else {
                setError(response.data.error || 'Submission failed. Please try again.');
                setSuccess('');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="content">
                <h1 className="page-title">Add Recipe</h1>
                <form onSubmit={handleSubmit} className="recipe-form">
                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ingredients">Ingredients:</label>
                        <textarea
                            id="ingredients"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="steps">Steps (one step per line):</label>
                        <textarea
                            id="steps"
                            value={steps}
                            onChange={(e) => setSteps(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Upload Image:</label>
                        <input
                            type="file"
                            id="image"
                            onChange={handleFileChange}
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </div>
    );
};

export default AddRecipe;
    