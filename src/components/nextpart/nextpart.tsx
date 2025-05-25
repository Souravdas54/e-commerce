import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './nextpart.css';

// Sample image URLs - replace with your actual image imports
const dealItems = [
  {
    name: 'Dogs',
    image: 'https://images.unsplash.com/photo-1618251425736-1502841bb3bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGdvbGRlbiUyMHJldHJpZXZlcnxlbnwwfHwwfHx8MA%3D%3D',
    link: '/dtoys'
  },
  {
    name: 'Fish',
    image: 'https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmlzaHxlbnwwfHwwfHx8MA%3D%3D',
    link: '/fishpage'
  },
  {
    name: 'Cat',
    image: 'https://images.unsplash.com/photo-1677126573075-8a15fcd0f51a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/cattyos'
  },
  {
    name: 'Birds',
    image: 'https://images.unsplash.com/photo-1560813562-fd09315f5ce8?q=80&w=1432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/bird'
  },
  {
    name: 'Small Animals',
    image: 'https://wallpapercave.com/wp/wp11441496.jpg',
    link: '/smallanimalpage'
  },
  {
    name: 'Reptiles',
    image: 'https://images.unsplash.com/photo-1617540021016-72023b487e99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8UmVwdGlsZXN8ZW58MHx8MHx8fDA%3D',
    link: '/reptiles'
  }
];

const Nextpage: React.FC = () => {
  const navigate = useNavigate();

  const handleShopNow = (link: string) => {
    navigate(link,{ replace: true });
    console.log(link);
    
  };

  return (
    <Box className="deal-of-the-week-container">
      <Typography variant="h2" className="deal-title">
        Deal of the Week
      </Typography>
      
      <Box className="deal-grid">
        {dealItems.map((item, index) => (
          <Box key={`${item.name}-${index}`} className="deal-item">
            <Box className="deal-image-container">
              <img
                src={item.image}
                alt={item.name}
                className="deal-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/500x300?text=Image+Not+Available';
                }}
              />
              <Box className="image-overlay">
                <Typography variant="h5" className="image-text">
                  {item.name}
                </Typography>
              </Box>
            </Box>
            <Box className="deal-text-container">
              <Button 
                variant="contained" 
                color="primary" 
                className="shop-now-button"
                onClick={(e) => {
                   e.preventDefault(); 
                  handleShopNow(item.link)
                }}
              >
                Shop Now
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Nextpage;