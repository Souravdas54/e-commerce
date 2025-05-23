import React, { useState, useEffect } from 'react';
import {
  CircularProgress, Alert, Select, MenuItem, FormControl, Rating, Button, Box, Typography, Dialog, DialogTitle,
  IconButton, DialogContent, CardMedia, DialogActions, Card, CardActionArea, CardActions, CardContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  specifications?: Record<string, string>;
  reviewCount?: number;
}

interface CartItem extends FishProduct {
  quantity: number;
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
const CART_STORAGE_KEY = 'fish_products_cart';
const CART_COUNT_KEY = 'fish_products_cart_count';

const FishProductsPage: React.FC = () => {
  const [fishProducts, setFishProducts] = useState<FishProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<FishProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<FishProduct | null>(null);

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

        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
        const savedCount = localStorage.getItem(CART_COUNT_KEY);
        if (savedCount) {
          console.log(savedCount);
        }

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

  const handleAddToCart = (product: FishProduct) => {
    try {
      const updatedCart = [...cartItems];
      const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      const newCount = updatedCart.reduce((total, item) => total + item.quantity, 0);

      localStorage.setItem(CART_COUNT_KEY, newCount.toString());
      setCartItems(updatedCart);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewDetails = (product: FishProduct) => {
    setSelectedProduct(product);
    setOpenDialog(true);
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
            <Card key={product.id} className="fish-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea onClick={() => handleViewDetails(product)}>
                <CardMedia
                  component="img"
                  image={product.image.startsWith('http') ? product.image : product.image.startsWith('/') ? product.image : `/${product.image}`}
                  alt={product.name}
                  sx={{
                    height: 200,
                    objectFit: 'contain',
                    p: 1
                  }}
                  onError={handleImageError}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3" className="fish-card-title">
                    {product.name}
                  </Typography>
                  <Box className="fish-card-rating">
                    <Rating value={product.rating} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {product.rating.toFixed(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" className="fish-card-description">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="fish-card-category">
                    {product.category.toUpperCase()}
                  </Typography>
                  <Typography variant="h6" className="fish-card-price">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ mt: 'auto', justifyContent: 'space-between', p: 2 }}>
                <Box>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleViewDetails(product)}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!product.inStock}
                    size="small"
                    className="fish-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </Box>
              </CardActions>
            </Card>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct?.name}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <CardMedia
                  component="img"
                  image={selectedProduct.image.startsWith('http') ? selectedProduct.image : selectedProduct.image.startsWith('/') ? selectedProduct.image : `/${selectedProduct.image}`}
                  alt={selectedProduct.name}
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain'
                  }}
                  onError={handleImageError}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={selectedProduct.rating} precision={0.5} readOnly />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount || 0} reviews)
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  ${selectedProduct.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color={selectedProduct.inStock ? 'success.main' : 'error'} gutterBottom>
                  {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedProduct.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {selectedProduct.category.toUpperCase()}
                </Typography>
                {selectedProduct.specifications && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Specifications
                    </Typography>
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <Typography key={key} variant="body2">
                        <strong>{key}:</strong> {value}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedProduct?.inStock}
            onClick={() => {
              if (selectedProduct) {
                handleAddToCart(selectedProduct);
                setOpenDialog(false);
              }
            }}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FishProductsPage;