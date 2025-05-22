import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Select, MenuItem, FormControl, Rating, Button, Box, Typography } from '@mui/material';
import './dogstyle.css';

interface DogProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface DogCategory {
  name: string;
  value: string;
}

interface NestedDogProducts {
  food?: Omit<DogProduct, 'category'>[];
  toys?: Omit<DogProduct, 'category'>[];
  collars?: Omit<DogProduct, 'category'>[];
  beds?: Omit<DogProduct, 'category'>[];
}

import rawData from '../../database/dog/dogtoys.json';

const DogProductsPage: React.FC = () => {
  const [dogProducts, setDogProducts] = useState<DogProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DogProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');

  const categories: DogCategory[] = [
    { name: 'All', value: 'all' },
    { name: 'Food', value: 'food' },
    { name: 'Toys', value: 'toys' },
    { name: 'Collars', value: 'collars' },
    { name: 'Beds', value: 'beds' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (rawData && rawData.dog_products) {
          let products: DogProduct[] = [];

          if ('food' in rawData.dog_products) {
            const nestedData = rawData.dog_products as NestedDogProducts;
            console.log("nestedData", nestedData);

            products = [
              ...(nestedData.food || []).map(p => ({ ...p, category: 'food' })),
              ...(nestedData.toys || []).map(p => ({ ...p, category: 'toys' })),
              ...(nestedData.collars || []).map(p => ({ ...p, category: 'collars' })),
              ...(nestedData.beds || []).map(p => ({ ...p, category: 'beds' })),
            ];
          } else {
            products = Array.isArray(rawData.dog_products) ? rawData.dog_products as DogProduct[] : [];
          }

          setDogProducts(products);
          setFilteredProducts(products);
          setLoading(false);
          return;
        }

        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Failed to fetch dog products');
        const data = await response.json();
        const fetchedProducts = Array.isArray(data.dog_products) ? data.dog_products : [];
        setDogProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
        setDogProducts([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if(!Array.isArray(dogProducts)){
      setDogProducts([]);
      return;
    }
    let filtered = [...dogProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
      const categoryObj = categories.find(c => c.value === selectedCategory);
      setCurrentCategoryName(categoryObj ? `Dog ${categoryObj.name}` : 'Dog Products');
    } else {
      setCurrentCategoryName('Dog Products');
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
  }, [selectedCategory, sortOption, dogProducts]);

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
    <Box className="dog-page">
      <Typography variant="h3" component="h1" gutterBottom className="dog-title">
        {currentCategoryName}
      </Typography>

      <Box className="dog-controls">
        <Box className="dog-category-buttons">
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
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as string)}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="dog-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Box key={product.id} className="dog-card">
              <Box className="dog-card-img-wrapper">
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
              <Box className="dog-card-body">
                <Typography variant="h6" component="h3" gutterBottom className="dog-card-title">
                  {product.name}
                </Typography>
                <Box className="dog-card-rating">
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {product.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography className="dog-card-description">
                  {product.description}
                </Typography>
                <Typography className="dog-card-category">
                  {product.category.toUpperCase()}
                </Typography>
              </Box>
              <Box className="dog-card-footer">
                <Typography className="dog-card-price">
                  ${product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  disabled={!product.inStock}
                  size="small"
                  className="dog-add-btn">
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

export default DogProductsPage;