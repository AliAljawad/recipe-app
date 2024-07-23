// Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; 

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();   
        window.location.href = '/login';
      };

    return (
        <div>
            <button className="toggle-button" onClick={toggleSidebar}>
                &#9776;
            </button>
            <div className={`sidebar ${isOpen ? 'active' : ''}`} id="sidebar">
                <div className="sidebar-menu">
                <h3 className="sidebar-item">
                        <i className="fa fa-list"></i>
                        <Link to="/homepage">Homepage</Link>
                    </h3>
                    <h3 className="sidebar-item">
                        <i className="fa fa-plus"></i>
                        <Link to="/Dashboard/addRecipe">Add Recipe</Link>
                    </h3>
                    <h3 className="sidebar-item">
                        <i className="fa fa-list"></i>
                        <Link to="/Dashboard/view-recipes">View Recipes</Link>
                    </h3>
                    <h3 className="sidebar-item">
                        <i className="fa fa-list"></i>
                        <Link to="/Dashboard/favorites">View Favorites</Link>
                    </h3>
                    <h3 className="sidebar-item">
                        <i className="fa fa-sign-out-alt"></i>
                        <Link onClick={handleLogout} >Logout</Link>
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
