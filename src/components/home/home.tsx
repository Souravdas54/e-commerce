import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './home.css';
import Nextpart from '../nextpart/nextpart';

interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

// Updated with pet-themed images (placeholder URLs - replace with your actual images)
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

  // Responsive settings
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

  return (
    <Box sx={{
      width: '100%',
      position: 'relative',
      marginBottom: 4,
      maxWidth: '100vw',
      overflow: 'hidden',
    }}>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="banner-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Box sx={{ position: 'relative', width: '100%', height: getBannerHeight(), overflow: 'hidden', }}>
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
                  <button className="banner-button">
                    {banner.buttonText}
                  </button>
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <Box>
        <Nextpart />
      </Box>
    </Box>
  );
};

export default Home;