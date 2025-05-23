import React, { useState, useEffect } from 'react';
import {CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Rating, Button, Box, Typography,
  CardContent, CardMedia, Card, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  reviewCount?: number;
  specifications?: Record<string, string>;
}

interface CartItem extends CatProduct {
  quantity: number;
}

interface CatCategory {
  name: string;
  value: string;
}

interface NestedCatProducts {
  poles?: Omit<CatProduct, 'category'>[];
  tools?: Omit<CatProduct, 'category'>[];
  toys?: Omit<CatProduct, 'category'>[];
  litters?: Omit<CatProduct, 'category'>[];
}

function isNestedCatProducts(obj: any): obj is NestedCatProducts {
  return obj &&
    'poles' in obj &&
    'tools' in obj &&
    'toys' in obj &&
    Array.isArray(obj.poles) &&
    Array.isArray(obj.tools) &&
    Array.isArray(obj.toys);
}

import rawData from '../../database/cat/cat.json';
const CART_STORAGE_KEY = 'cat_products_cart';
const CART_COUNT_KEY = 'cat_products_cart_count';

const CatProductsPage: React.FC = () => {
  const [catProducts, setCatProducts] = useState<CatProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CatProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');
  const [selectedProduct, setSelectedProduct] = useState<CatProduct | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const categories: CatCategory[] = [
    { name: 'All', value: 'all' },
    { name: 'Poles', value: 'poles' },
    { name: 'Tools', value: 'tools' },
    { name: 'Toys', value: 'toys' },
    { name: 'Food', value: 'food' },
    { name: 'Litter & Accessories', value: 'litters' },
    { name: 'Beds', value: 'beds' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        if (rawData && rawData.cat_products) {
          let products: CatProduct[] = [];

          if (isNestedCatProducts(rawData.cat_products)) {
            products = [
              ...rawData.cat_products.poles.map(p => ({ ...p, category: 'poles' })),
              ...rawData.cat_products.tools.map(p => ({ ...p, category: 'tools' })),
              ...rawData.cat_products.toys.map(p => ({ ...p, category: 'toys' })),
              ...(rawData.cat_products.litters ?
                rawData.cat_products.litters.map(p => ({ ...p, category: 'litters' })) : []),
            ];
          } else {
            products = Array.isArray(rawData.cat_products) ?
              rawData.cat_products as CatProduct[] : [];
          }

          setCatProducts(products);
          setFilteredProducts(products);
          setLoading(false);
        }

        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
        const savedCount = localStorage.getItem(CART_COUNT_KEY);
        if (savedCount) {
          // setCartCount(parseInt(savedCount));
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
    let filtered = [...catProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
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
    target.src = "/assets/no-image.png";
  };

  const handleAddToCart = (product: CatProduct) => {
    try {
      const updatedCart = [...cartItems];
      const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      const newCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
      // setCartCount(newCount);
      localStorage.setItem(CART_COUNT_KEY, newCount.toString());

      setCartItems(updatedCart);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
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
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h3" component="h1" gutterBottom className="cat-title">
          {currentCategoryName}
        </Typography>
      </Box>

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

        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={sortOption}
            label="Sort By"
            onChange={(e) => setSortOption(e.target.value as string)}
            inputProps={{
              name: 'sort',
              id: 'sort-select',
            }}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Rest of your component remains the same */}
      <Box className="cat-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Card key={product.id} className="cat-card">
              <CardMedia
                component="img"
                image={product.image.startsWith('http') ? product.image : product.image.startsWith('/') ? product.image : `/${product.image}`}
                alt={product.name}
                className="cat-card-img-wrapper"
                style={{
                  maxWidth: '100%',
                  objectFit: 'cover'
                }}
                onError={handleImageError}
              />
              <CardContent className="cat-card-body">
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
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </Typography>
                <Typography className="cat-card-category">
                  {product.category.toUpperCase()}
                </Typography>
                <Typography className="cat-card-price">
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions className="cat-card-footer">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpenDialog(true);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!product.inStock}
                    size="small"
                    className="cat-add-btn"
                    onClick={() => handleAddToCart(product)}
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
          {/* <Button onClick={() => setOpenDialog(false)}>Close</Button> */}
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedProduct?.inStock}
            onClick={() => {
              if (selectedProduct) {
                handleAddToCart(selectedProduct);
                // setOpenDialog(false);
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

export default CatProductsPage;