import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert, Select, MenuItem, FormControl, Rating, Button, Box, Typography, Card, CardMedia, CardContent, CardActions, Dialog, DialogTitle, IconButton, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  reviewCount?: number;
  specifications?: Record<string, string>;
  size: number;
  color: string;
  material: string;
}

interface CartItem extends DogProduct {
  quantity: number;
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

interface RawDogData {
  dog_products: DogProduct[] | NestedDogProducts;
}

function isNestedDogProducts(obj: any): obj is NestedDogProducts {
  return obj && (
    ('food' in obj && Array.isArray(obj.food)) ||
    ('toys' in obj && Array.isArray(obj.toys)) ||
    ('collars' in obj && Array.isArray(obj.collars)) ||
    ('beds' in obj && Array.isArray(obj.beds))
  );
}

import rawData from '../../database/dog/dogtoys.json';
const CART_STORAGE_KEY = 'dog_products_cart';
const CART_COUNT_KEY = 'dog_products_cart_count';

const DogProductsPage: React.FC = () => {
  const [dogProducts, setDogProducts] = useState<DogProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DogProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<DogProduct | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const categories: DogCategory[] = [
    { name: 'All', value: 'all' },
    { name: 'Food', value: 'food' },
    { name: 'Toys', value: 'toys' },
    { name: 'Collars', value: 'collars' },
    { name: 'Beds', value: 'beds' }
  ];


  const handleViewDetails = (product: DogProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = rawData as unknown as RawDogData;

        if (data?.dog_products) {
          let products: DogProduct[] = [];

          if (isNestedDogProducts(data.dog_products)) {
            products = [
              ...(data.dog_products.food?.map(p => ({ ...p, category: 'food' })) || []),
              ...(data.dog_products.toys?.map(p => ({ ...p, category: 'toys' })) || []),
              ...(data.dog_products.collars?.map(p => ({ ...p, category: 'collars' })) || []),
              ...(data.dog_products.beds?.map(p => ({ ...p, category: 'beds' })) || []),
            ];
          } else if (Array.isArray(data.dog_products)) {
            products = data.dog_products;
          }

          setDogProducts(products);
          setFilteredProducts(products);
          setLoading(false);
          return;
        }

        // Fallback to fetch if needed
        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Failed to fetch dog products');
        const fetchedData = await response.json() as RawDogData;
        const fetchedProducts = Array.isArray(fetchedData.dog_products) ? fetchedData.dog_products : [];

        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
        const savedCount = localStorage.getItem(CART_COUNT_KEY);
        if (savedCount) {
          // setCartCount(parseInt(savedCount));
          console.log(savedCount);

        }

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

  // ... (keep the rest of your existing useEffect and other functions the same)
  useEffect(() => {
    if (!Array.isArray(dogProducts)) {
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

  const handleAddToCart = (product: DogProduct) => {
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
    <Box className="dog-page">
      {/* ... (keep the existing header and controls code the same) ... */}
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
            <Card key={product.id} className="dog-card">
              <CardMedia
                component="img"
                image={product.image.startsWith('http') ? product.image : product.image.startsWith('/') ? product.image : `/${product.image}`}
                alt={product.name}
                className="dog-card-img-wrapper"
                style={{
                  maxWidth: '100%',
                  objectFit: 'cover'
                }}
                onError={handleImageError}
              />
              <CardContent className="dog-card-body">
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
                <Typography className="dog-card-price">
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions className="dog-card-footer" sx={{ justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => handleViewDetails(product, e)}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  disabled={!product.inStock}
                  size="small"
                  className='dog-add-btn'
                  onClick={() => handleAddToCart(product)}

                // onClick={(e) => {
                //   e.stopPropagation();
                //   handleAddToCart(product);
                // }}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
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

      {/* Product Details Dialog */}
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
                <Typography variant="body2" color="text">
                  Size : {selectedProduct.size}
                </Typography>
                <Typography variant="body2" color="text">
                  Material : {selectedProduct.material}
                </Typography>
                <Typography variant="body2" color="text">
                  Color : {selectedProduct.color}
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DogProductsPage;
