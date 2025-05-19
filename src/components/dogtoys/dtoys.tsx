import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Rating, Button, Box, Typography } from '@mui/material';
import './dtoys.css';

interface DogToy {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface DogToyCategory {
  name: string;
  value: string;
}

// Import JSON data directly
import rawData from '../../database/db.json';

const DogToysPage: React.FC = () => {
  const [dogToys, setDogToys] = useState<DogToy[]>([]);
  const [filteredToys, setFilteredToys] = useState<DogToy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');

  const categories: DogToyCategory[] = [
    { name: 'All', value: 'all' },
    { name: 'Chew Toys', value: 'chew' },
    { name: 'Plush Toys', value: 'plush' },
    { name: 'Fetch Toys', value: 'fetch' },
    { name: 'Tug Toys', value: 'tug' },
    { name: 'Puzzle Toys', value: 'puzzle' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        // Use the directly imported data
        if (rawData && rawData.dog_toys) {
          setDogToys(rawData.dog_toys);
          setFilteredToys(rawData.dog_toys);
          setLoading(false);
          return;
        }

        // Fallback to fetch if needed
        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Failed to fetch dog toys');
        const data = await response.json();
        setDogToys(data.dog_toys || []);
        setFilteredToys(data.dog_toys || []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...dogToys];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(toy => toy.category === selectedCategory);
    }

    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredToys(filtered);
  }, [selectedCategory, sortOption, dogToys]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">
          {error}
          <Box mt={2}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{
        fontWeight: 'bold',
        textAlign: 'center',
        mb: 4,
        color: 'primary.main'
      }}>
        Dog Toys
      </Typography>

      {/* Filter and sort controls */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 4,
        gap: 2
      }}>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1
        }}>
          {categories.map(category => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory(category.value)}
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: 2
              }}
            >
              {category.name}
            </Button>
          ))}
        </Box>

        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortOption}
            label="Sort By"
            onChange={(e) => setSortOption(e.target.value as string)}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products grid using Box with flexbox */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: { xs: 'center', sm: 'flex-start' }
      }}>
        {filteredToys.length > 0 ? (
          filteredToys.map(toy => (
            <Box key={toy.id} sx={{
              width: { xs: '100%', sm: 288, md: 240, lg: 280 },
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}>
              <Box sx={{
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.paper',
                p: 2
              }}>
                <img
                  src={toy.image.startsWith('http') ? toy.image : toy.image.startsWith('/') ? toy.image : `/${toy.image}`}
                  alt={toy.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onError={handleImageError}
                />
              </Box>
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {toy.name}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating value={toy.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {toy.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {toy.description}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary" mb={1}>
                  {toy.category.toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'action.hover'
              }}>
                <Typography variant="h6" color="primary">
                  ${toy.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  disabled={!toy.inStock}
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  {toy.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box textAlign="center" py={6} width="100%">
            <Typography variant="h5" color="text.secondary">
              No toys found in this category.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => setSelectedCategory('all')}
            >
              Show All Products
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DogToysPage;