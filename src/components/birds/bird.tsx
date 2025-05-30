import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Select, MenuItem, FormControl, Rating, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  CardMedia, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './birdsttyle.css';

interface BirdProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  inStock: boolean;
  reviewCount?: number;
  specifications?: Record<string, string>;
}

interface CartItem extends BirdProduct {
  quantity: number;
}

interface BirdCategory {
  name: string;
  value: string;
}

interface NestedBirdProducts {
  food: Omit<BirdProduct, 'category'>[];
  house: Omit<BirdProduct, 'category'>[];
  toys: Omit<BirdProduct, 'category'>[];
}

import rawData from '../../database/bird/bird.json';
const CART_STORAGE_KEY = 'bird_products_cart';
const CART_COUNT_KEY = 'bird_products_cart_count';
const BUY_NOW_KEY = 'bird_products_buy_now';

const BirdProductsPage: React.FC = () => {
  const [birdProducts, setBirdProducts] = useState<BirdProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<BirdProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<BirdProduct | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const categories: BirdCategory[] = [
    { name: 'All', value: 'all' },
    { name: 'Food', value: 'food' },
    { name: 'House', value: 'house' },
    { name: 'Toys', value: 'toys' }
  ];

  const handleCardClick = (product: BirdProduct) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleBuyNow = (product: BirdProduct) => {
    try {
      // Create a single-item cart for immediate checkout
      const buyNowItem = [{ ...product, quantity: 1 }];

      // Save to localStorage
      localStorage.setItem(BUY_NOW_KEY, JSON.stringify(buyNowItem));

      // Update state
      setCartItems(buyNowItem);

      // Navigate to checkout page
      // navigate('/checkout');
    } catch (error) {
      console.error('Error processing Buy Now:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (rawData && rawData.bird_products) {
          let products: BirdProduct[] = [];

          if ('food' in rawData.bird_products) {
            const nestedData = rawData.bird_products as NestedBirdProducts;
            products = [
              ...nestedData.food.map(p => ({ ...p, category: 'food' })),
              ...nestedData.house.map(p => ({ ...p, category: 'house' })),
              ...nestedData.toys.map(p => ({ ...p, category: 'toys' }))
            ];
          } else {
            products = rawData.bird_products as BirdProduct[];
          }

          setBirdProducts(products);
          setFilteredProducts(products);
          setLoading(false);
          return;
        }

        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Failed to fetch bird products');
        const data = await response.json();
        const fetchedProducts = Array.isArray(data.bird_products)
          ? data.bird_products
          : [];

        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
        const savedCount = localStorage.getItem(CART_COUNT_KEY);
        if (savedCount) {
          console.log(savedCount);
        }

        setBirdProducts(fetchedProducts);
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
    let filtered = [...birdProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
      const categoryObj = categories.find(c => c.value === selectedCategory);
      setCurrentCategoryName(categoryObj ? `Bird ${categoryObj.name}` : 'Bird Products');
    } else {
      setCurrentCategoryName('Bird Products');
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
  }, [selectedCategory, sortOption, birdProducts]);

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

  const handleAddToCart = (product: BirdProduct) => {
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
    <Box className="bird-page">
      <Typography variant="h3" component="h1" gutterBottom className="bird-title">
        {currentCategoryName}
      </Typography>

      <Box className="bird-controls">
        <Box className="bird-category-buttons">
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

      <Box className="bird-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Box 
              key={product.id} 
              className="bird-card"
              onClick={() => handleCardClick(product)}
              sx={{ cursor: 'pointer' }}
            >
              <Box className="bird-card-img-wrapper">
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
              <Box className="bird-card-body">
                <Typography variant="h6" component="h3" gutterBottom className="bird-card-title">
                  {product.name}
                </Typography>
                <Box className="bird-card-rating">
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {product.rating.toFixed(1)}
                  </Typography>
                </Box>
                <Typography className="bird-card-description">
                  {product.description}
                </Typography>
                <Typography className="bird-card-category">
                  {product.category.toUpperCase()}
                </Typography>
                <Typography className="bird-card-price">
                  ${product.price.toFixed(2)}
                </Typography>
              </Box>
              <Box className="bird-card-footer">
                <Button
                  variant="contained"
                  disabled={!product.inStock}
                  size="small"
                  className="bird-add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  className="bird-buy-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(product);
                  }}
                  sx={{
                    backgroundColor: '#ff6f00',
                    '&:hover': {
                      backgroundColor: '#e65100'
                    }
                  }}
                >
                  Buy Now
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
            variant="outlined"
            onClick={() => setOpenDialog(false)}
          >
            Close
          </Button>
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
          <Button
            variant="contained"
            disabled={!selectedProduct?.inStock}
            onClick={() => {
              if (selectedProduct) {
                handleBuyNow(selectedProduct);
                setOpenDialog(false);
              }
            }}
            sx={{
              backgroundColor: '#ff6f00',
              '&:hover': {
                backgroundColor: '#e65100'
              }
            }}
          >
            Buy Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BirdProductsPage;