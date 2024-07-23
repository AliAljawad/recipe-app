import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/register/register';
import Login from './pages/Login/login';
import { routes } from './utils/routes';
import HomePage from './pages/homepage';
import RecipePage from './pages/recipe';
import AddRecipe from './pages/addRecipe/addRecipe';
import UserRecipes from './pages/userReciepes';
import Favorites from './pages/favorites';
import Animate from './pages/gsap';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.register} element={<Register/>} />
        <Route path="/"element={<Animate/>} />
        <Route path={routes.login} element={<Login/>}/>
        <Route path="/recipe/:id" element={<RecipePage/>} />
        <Route path={routes.homePage} element={<HomePage/>} />
        <Route path={routes.addRecipe} element={<AddRecipe/>}/>
        <Route path={routes.userRecipes} element={<UserRecipes/>}/>
        <Route path={routes.favorites} element={<Favorites/>}/>
        <Route path={routes.gsap} element={<Animate/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
