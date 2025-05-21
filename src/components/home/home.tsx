import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Button, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import './home.css';
import Nextpart from '../nextpart/nextpart';

interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

const remoteImages = [
  'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  'https://wallpapercave.com/wp/wp15036118.webp',
  'https://wallpapercave.com/wp/wp10220082.jpg',
];

const Home: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Responsive settings (keep your existing functions)
  const getTitleFontSize = () => {
    if (isXs) return '1.5rem';
    if (isSm) return '1.8rem';
    if (isMd) return '2.1rem';
    if (isLg) return '2.4rem';
    return '2.8rem';
  };

  const getSubtitleFontSize = () => {
    if (isXs) return '0.8rem';
    if (isSm) return '1rem';
    if (isMd) return '1.1rem';
    if (isLg) return '1.2rem';
    return '1.4rem';
  };

  const getBannerHeight = () => {
    if (isXs) return '300px';
    if (isSm) return '350px';
    if (isMd) return '400px';
    if (isLg) return '500px';
    return '600px';
  };

  const getContentWidth = () => {
    if (isXs) return '90%';
    if (isSm) return '85%';
    if (isMd) return '80%';
    if (isLg) return '75%';
    return '1200px';
  };

  const banners: Banner[] = [
    {
      id: 1,
      image: remoteImages[0],
      title: 'Welcome',
      subtitle: 'to Our Pet Supply Shop',
      buttonText: 'Shop Now',
    },
    {
      id: 2,
      image: remoteImages[1],
      title: 'Premium Pet Food',
      subtitle: 'Nutrition your pets will love',
      buttonText: 'View Products',
    },
    {
      id: 3,
      image: remoteImages[2],
      title: 'New Arrivals',
      subtitle: 'Fresh toys and accessories',
      buttonText: 'Explore',
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <Box sx={{
      width: '100%',
      position: 'relative',
      marginBottom: 4,
      maxWidth: '100vw',
      overflow: 'hidden',
    }}>
      {/* Custom Carousel */}
      <Box sx={{ position: 'relative', width: '100%', height: getBannerHeight() }}>
        {/* Navigation Arrows */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        >
          <KeyboardArrowLeft fontSize="large" />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        >
          <KeyboardArrowRight fontSize="large" />
        </IconButton>

        {/* Slides */}
        {banners.map((banner, index) => (
          <Box
            key={banner.id}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transition: 'opacity 0.5s ease',
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0,
            }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <Box sx={{
                width: getContentWidth(),
                maxWidth: '100%',
                padding: isXs ? '1rem' : '2rem',
              }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: getTitleFontSize(),
                    fontWeight: 'bold',
                    marginBottom: isXs ? '0.5rem' : '1rem',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    lineHeight: 1.2,
                  }}
                >
                  {banner.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: getSubtitleFontSize(),
                    marginBottom: isXs ? '1rem' : '2rem',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  {banner.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    padding: isXs ? '8px 24px' : '12px 32px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    },
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {banner.buttonText}
                </Button>
              </Box>
            </Box>
          </Box>
        ))}

        {/* Pagination Dots */}
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 2,
          gap: 1,
        }}>
          {banners.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Nextpart />
      </Box>
    </Box>
  );
};

export default Home;