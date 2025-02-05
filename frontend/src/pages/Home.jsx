import React, { useEffect, useState } from 'react';
import LogoutButton from '../Components/LogoutButton';
import { HeroHighlight } from '../Components/ui/Hero-highlight';
import { HeroHighlightDemo } from '../Components/HeroSection';
import { Button } from '@nextui-org/react';
import { WobbleCardDemo } from '../Components/WobbleCardSection';
import { AuroraBackground } from '../Components/ui/Aurora-lights';
import { AuroraBackgroundDemo } from '../Components/WithAurora';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { InfiniteMovingCardsDemo } from '../Components/Testimonials';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      setLoading(false);  // Once check is done, stop loading
    }
  }, [isAuthenticated, navigate]);

  // Render loading spinner or null while loading
  if (loading) {
    return <div>Loading...</div>;  // Replace with a spinner or any loading component
  }

  // Render the page for unauthenticated users
  return (
    <>
      <AuroraBackgroundDemo />
      <WobbleCardDemo />
      <InfiniteMovingCardsDemo/>
      <Footer />
    </>
  );
};

export default Home;
