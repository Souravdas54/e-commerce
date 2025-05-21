import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Rating, Button, Box, Typography } from '@mui/material';
import './catstyle.css';

interface CatProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface CatCategory {
  name: string;
  value: string;
}

interface NestedCatProducts {
  poles: Omit<CatProduct, 'category'>[];
  tools: Omit<CatProduct, 'category'>[];
  toys: Omit<CatProduct, 'category'>[];
  litter: Omit<CatProduct, 'category'>[];
}

import rawData from '../../database/cat/cat.json';

const CatProductsPage: React.FC = () => {
  const [catProducts, setCatProducts] = useState<CatProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CatProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');

  const categories: CatCategory[] = [
    { name: 'All', value: 'all' },
    { name: 'Poles', value: 'poles' },
    { name: 'Tools', value: 'tools' },
    { name: 'Toys', value: 'toys' },
    { name: 'Food', value: 'food' },
    { name: 'Litter & Accessories', value: 'litter' },
    { name: 'Beds', value: 'beds' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (rawData && rawData.cat_products) {
          let products: CatProduct[] = [];

          if ('poles' in rawData.cat_products) {
            const nestedData = rawData.cat_products as NestedCatProducts;
            products = [
              ...nestedData.poles.map(p => ({ ...p, category: 'poles' })),
              ...nestedData.tools.map(p => ({ ...p, category: 'tools' })),
              ...nestedData.toys.map(p => ({ ...p, category: 'toys' })),
              ...(nestedData.litter ? nestedData.litter.map(p => ({ ...p, category: 'litter' })) : []),
            ];
          } else {
            products = rawData.cat_products as CatProduct[];
          }

          setCatProducts(products);
          setFilteredProducts(products);
          setLoading(false);
          return;
        }

        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Failed to fetch cat products');
        const data = await response.json();
        const fetchedProducts = Array.isArray(data.cat_products)
          ? data.cat_products
          : [];
        setCatProducts(fetchedProducts);
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
    let filtered = [...catProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
      // Update the current category name for display
      const categoryObj = categories.find(c => c.value === selectedCategory);
      setCurrentCategoryName(categoryObj ? `Cat ${categoryObj.name}` : 'Cat Products');
    } else {
      setCurrentCategoryName('Cat Products');
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
  }, [selectedCategory, sortOption, catProducts]);

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
    <Box className="cat-page">
      <Typography variant="h3" component="h1" gutterBottom className="cat-title">
        {currentCategoryName}
      </Typography>

      {/* Rest of the component remains exactly the same */}
      <Box className="cat-controls">
        <Box className="cat-category-buttons">
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

        {/* <FormControl sx={{ minWidth: 180 }} size="small">
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
        </FormControl> */}
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            maxWidth: { xs: '100%',sm: '100%', md: 120 },
            marginBottom: { xs: 1, sm: 0 }
          }}
          size="small"
        >
          <Select
            labelId="sort-label"
            value={sortOption}
            label="Sort By"
            onChange={(e) => setSortOption(e.target.value as string)}
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
              '& .MuiSelect-select': {
                padding: { xs: '8px 32px 8px 12px', sm: '8px 32px 8px 16px' }
              }
            }}
          >
            <MenuItem
              value="featured"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' } }}
            >
              Featured
            </MenuItem>
            <MenuItem
              value="price-low"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' } }}
            >
              Price: Low to High
            </MenuItem>
            <MenuItem
              value="price-high"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' } }}
            >
              Price: High to Low
            </MenuItem>
            <MenuItem
              value="rating"
              sx={{ fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' } }}
            >
              Highest Rated
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className="cat-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Box key={product.id} className="cat-card">
              <Box className="cat-card-img-wrapper">
                <img
                  src={product.image.startsWith('http') ? product.image : product.image.startsWith('/') ? product.image : `/${product.image}`}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    // maxHeight: '100%',
                    objectFit: 'cover'
                  }}
                  onError={handleImageError}
                />
              </Box>
              <Box className="cat-card-body">
                <Typography variant="h6" component="h3" gutterBottom className="cat-card-title">
                  {product.name}
                </Typography>
                <Box className="cat-card-rating">
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {product.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography className="cat-card-description">
                  {product.description}
                </Typography>
                <Typography className="cat-card-category">
                  {product.category.toUpperCase()}
                </Typography>
              </Box>
              <Box className="cat-card-footer">
                <Typography className="cat-card-price">
                  ${product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  disabled={!product.inStock}
                  size="small"
                  className="cat-add-btn">
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

export default CatProductsPage;