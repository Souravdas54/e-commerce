import React, { useState, useEffect } from 'react';
import {
    CircularProgress, Alert, Select, MenuItem, FormControl, Rating, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    CardMedia, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './smallanumalstyle.css';

interface SmallAnimalProduct {
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

interface CartItem extends SmallAnimalProduct {
    quantity: number;
}

interface SmallAnimalCategory {
    name: string;
    value: string;
}

interface NestedSmallAnimalProducts {
    food: Omit<SmallAnimalProduct, 'category'>[];
    habitat: Omit<SmallAnimalProduct, 'category'>[];
    accessories: Omit<SmallAnimalProduct, 'category'>[];
}

import rawData from '../../database/smallanimal/smallanimal.json';
const CART_STORAGE_KEY = 'small_animal_products_cart';
const CART_COUNT_KEY = 'small_animal_products_cart_count';

const SmallAnimalProductsPage: React.FC = () => {
    const [smallAnimalProducts, setSmallAnimalProducts] = useState<SmallAnimalProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<SmallAnimalProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('featured');
    const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<SmallAnimalProduct | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const categories: SmallAnimalCategory[] = [
        { name: 'All', value: 'all' },
        { name: 'Food', value: 'food' },
        { name: 'Habitat', value: 'habitat' },
        { name: 'Accessories', value: 'accessories' }
    ];

    const handleViewDetails = (product: SmallAnimalProduct, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                if (rawData && rawData.small_animal_products) {
                    let products: SmallAnimalProduct[] = [];

                    if ('food' in rawData.small_animal_products) {
                        const nestedData = rawData.small_animal_products as NestedSmallAnimalProducts;
                        products = [
                            ...nestedData.food.map(p => ({ ...p, category: 'food' })),
                            ...nestedData.habitat.map(p => ({ ...p, category: 'habitat' })),
                            ...nestedData.accessories.map(p => ({ ...p, category: 'accessories' }))
                        ];
                    } else {
                        products = rawData.small_animal_products as SmallAnimalProduct[];
                    }

                    setSmallAnimalProducts(products);
                    setFilteredProducts(products);
                    setLoading(false);
                    return;
                }

                const response = await fetch('/db.json');
                if (!response.ok) throw new Error('Failed to fetch small animal products');
                const data = await response.json();
                const fetchedProducts = Array.isArray(data.small_animal_products)
                    ? data.small_animal_products
                    : [];

                const cartData = localStorage.getItem(CART_STORAGE_KEY);
                if (cartData) {
                    setCartItems(JSON.parse(cartData));
                }
                const savedCount = localStorage.getItem(CART_COUNT_KEY);
                if (savedCount) {
                    console.log(savedCount);
                }

                setSmallAnimalProducts(fetchedProducts);
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
        let filtered = [...smallAnimalProducts];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
            const categoryObj = categories.find(c => c.value === selectedCategory);
            setCurrentCategoryName(categoryObj ? `Small Animal ${categoryObj.name}` : 'Small Animal Products');
        } else {
            setCurrentCategoryName('Small Animal Products');
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
    }, [selectedCategory, sortOption, smallAnimalProducts]);

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

    const handleAddToCart = (product: SmallAnimalProduct) => {
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
        <Box className="small-animal-page">
            <Typography variant="h3" component="h1" gutterBottom className="small-animal-title">
                {currentCategoryName}
            </Typography>

            <Box className="small-animal-controls">
                <Box className="small-animal-category-buttons">
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

            <Box className="small-animal-products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <Box key={product.id} className="small-animal-card">
                            <Box className="small-animal-card-img-wrapper">
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
                            <Box className="small-animal-card-body">
                                <Typography variant="h6" component="h3" gutterBottom className="small-animal-card-title">
                                    {product.name}
                                </Typography>
                                <Box className="small-animal-card-rating">
                                    <Rating value={product.rating} precision={0.5} readOnly />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        {product.rating.toFixed(1)}
                                    </Typography>
                                </Box>
                                <Typography className="small-animal-card-description">
                                    {product.description}
                                </Typography>
                                <Typography className="small-animal-card-category">
                                    {product.category.toUpperCase()}
                                </Typography>
                                <Typography className="small-animal-card-price">
                                    ${product.price.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box className="small-animal-card-footer">
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
                                    className="small-animal-add-btn"
                                    onClick={() => handleAddToCart(product)}
                                >
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
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SmallAnimalProductsPage;