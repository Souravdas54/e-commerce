import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Select, MenuItem, FormControl, Rating, Button, Box, Typography } from '@mui/material';
import './fishstyle.css';

interface FishProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface FishCategory {
  name: string;
  value: string;
}

interface NestedFishProducts {
  aquariums: Omit<FishProduct, 'category'>[];
  cleaning: Omit<FishProduct, 'category'>[];
  decoration: Omit<FishProduct, 'category'>[];
  food: Omit<FishProduct, 'category'>[];
  filters: Omit<FishProduct, 'category'>[];
}

import rawData from '../../database/fish/fish.json';

const FishProductsPage: React.FC = () => {
  const [fishProducts, setFishProducts] = useState<FishProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FishProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');

  const categories: FishCategory[] = [
    { name: 'All', value: 'all' },
    { name: 'Aquariums', value: 'aquariums' },
    { name: 'Cleaning', value: 'cleaning' },
    { name: 'Decoration', value: 'decoration' },
    { name: 'Food', value: 'food' },
    { name: 'Filters', value: 'filters' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (rawData && rawData.fish_products) {
          let products: FishProduct[] = [];

          if ('aquariums' in rawData.fish_products) {
            const nestedData = rawData.fish_products as NestedFishProducts;
            products = [
              ...nestedData.aquariums.map(p => ({ ...p, category: 'aquariums' })),
              ...nestedData.cleaning.map(p => ({ ...p, category: 'cleaning' })),
              ...nestedData.decoration.map(p => ({ ...p, category: 'decoration' })),
              ...(nestedData.food ? nestedData.food.map(p => ({ ...p, category: 'food' })) : []),
              ...(nestedData.filters ? nestedData.filters.map(p => ({ ...p, category: 'filters' })) : []),
            ];
          } else {
            products = rawData.fish_products as FishProduct[];
          }

          setFishProducts(products);
          setFilteredProducts(products);
          setLoading(false);
          return;
        }

        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Failed to fetch fish products');
        const data = await response.json();
        const fetchedProducts = Array.isArray(data.fish_products)
          ? data.fish_products
          : [];
        setFishProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...fishProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
      // Update the current category name for display
      const categoryObj = categories.find(c => c.value === selectedCategory);
      setCurrentCategoryName(categoryObj ? `Fish ${categoryObj.name}` : 'Fish Products');
    } else {
      setCurrentCategoryName('Fish Products');
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

    setFilteredProducts(filtered);
  }, [selectedCategory, sortOption, fishProducts]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/assets/no-image.png";
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
    <Box className="fish-page">
      <Typography variant="h3" component="h1" gutterBottom className="fish-title">
        {currentCategoryName}
      </Typography>

      <Box className="fish-controls">
        <Box className="fish-category-buttons">
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

      <Box className="fish-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Box key={product.id} className="fish-card">
              <Box className="fish-card-img-wrapper">
                <img
                  src={product.image.startsWith('http') ? product.image : product.image.startsWith('/') ? product.image : `/${product.image}`}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  onError={handleImageError}
                />
              </Box>
              <Box className="fish-card-body">
                <Typography variant="h6" component="h3" gutterBottom className="fish-card-title">
                  {product.name}
                </Typography>
                <Box className="fish-card-rating">
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {product.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography className="fish-card-description">
                  {product.description}
                </Typography>
                <Typography className="fish-card-category">
                  {product.category.toUpperCase()}
                </Typography>
              </Box>
              <Box className="fish-card-footer">
                <Typography className="fish-card-price">
                  ${product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  disabled={!product.inStock}
                  size="small"
                  className="fish-add-btn">
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box textAlign="center" py={6} width="100%">
            <Typography variant="h5" color="text.secondary">
              No products found in this category.
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

export default FishProductsPage;