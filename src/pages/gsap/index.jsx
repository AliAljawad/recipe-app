import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './styles.css'; // Make sure to create this file for styling

const AnimatedComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // GSAP timeline for sequential animations
    const tl = gsap.timeline({
      onComplete: () => {
        navigate('/register'); // Redirect to /register after animation completes
      }
    });

    // Fade in animation
    tl.fromTo(
      '.animated-text', 
      { opacity: 0, y: -50 }, 
      { opacity: 1, y: 0, duration: 2, stagger: 0.5 }
    )
    // Fade out animation
    .to(
      '.animated-text',
      { opacity: 0, duration: 1, delay: 1 } // Delay to ensure there's a pause before fade out
    );
  }, [navigate]);

  return (
    <div className="animated-container">
      <h1 className="animated-text">Welcome to My Recipe App!</h1>
      <p className="animated-text">Discover and share delicious recipes.</p>
    </div>
  );
};

export default AnimatedComponent;
