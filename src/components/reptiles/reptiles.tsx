import React, { useState, useEffect } from 'react';
import {
    CircularProgress, Alert, Select, MenuItem, FormControl, Rating, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    CardMedia, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './reptilesstyle.css';

interface ReptileProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    description: string;
    category: string;
    rating: number;
    inStock: boolean;
    reviewCount?: number;
    specifications?: {
        Material?: string;
        Dimensions?: string;
        Weight?: string;
        Color?: string;
        [key: string]: string | undefined;
    };
}

interface CartItem extends ReptileProduct {
    quantity: number;
}

interface ReptileCategory {
    name: string;
    value: string;
}

interface NestedReptileProducts {
    habitats?: Omit<ReptileProduct, 'category'>[];
    heating?: Omit<ReptileProduct, 'category'>[];
    accessories?: Omit<ReptileProduct, 'category'>[];
}

function isNestedReptileProducts(obj: any): obj is NestedReptileProducts {
    return obj &&
        ('habitats' in obj || 'heating' in obj || 'accessories' in obj) &&
        (!obj.habitats || Array.isArray(obj.habitats)) &&
        (!obj.heating || Array.isArray(obj.heating)) &&
        (!obj.accessories || Array.isArray(obj.accessories));
}

import rawData from '../../database/reptlies/reptlies.json';
const CART_STORAGE_KEY = 'reptile_products_cart';
const CART_COUNT_KEY = 'reptile_products_cart_count';
const CART_BYNOW_KEY = 'reptile_products_bynow';

const ReptileProductsPage: React.FC = () => {
    const [reptileProducts, setReptileProducts] = useState<ReptileProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ReptileProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('featured');
    const [currentCategoryName, setCurrentCategoryName] = useState<string>('Products');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ReptileProduct | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const categories: ReptileCategory[] = [
        { name: 'All', value: 'all' },
        { name: 'Habitats', value: 'habitats' },
        { name: 'Heating', value: 'heating' },
        { name: 'Accessories', value: 'accessories' }
    ];

    const handleCardClick = (product: ReptileProduct) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                if (rawData && rawData.reptile_products) {
                    let products: ReptileProduct[] = [];

                    if (isNestedReptileProducts(rawData.reptile_products)) {
                        products = [
                            ...(rawData.reptile_products.habitats?.map(p => ({ ...p, category: 'habitats' })) || []),
                            ...(rawData.reptile_products.heating?.map(p => ({ ...p, category: 'heating' })) || []),
                            ...(rawData.reptile_products.accessories?.map(p => ({ ...p, category: 'accessories' })) || [])
                        ];
                    } else {
                        products = Array.isArray(rawData.reptile_products) ?
                            rawData.reptile_products as ReptileProduct[] :
                            [];
                    }

                    setReptileProducts(products);
                    setFilteredProducts(products);
                    setLoading(false);
                    return;
                }

                const response = await fetch('/db.json');
                if (!response.ok) throw new Error('Failed to fetch reptile products');
                const data = await response.json();
                const fetchedProducts = Array.isArray(data.reptile_products)
                    ? data.reptile_products
                    : [];

                const cartData = localStorage.getItem(CART_STORAGE_KEY);
                if (cartData) {
                    setCartItems(JSON.parse(cartData));
                }
                const savedCount = localStorage.getItem(CART_COUNT_KEY);
                if (savedCount) {
                    console.log(savedCount);
                }
                const bydata = localStorage.getItem(CART_BYNOW_KEY);
                if (bydata) {
                    console.log(bydata);
                }

                setReptileProducts(fetchedProducts);
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
        let filtered = [...reptileProducts];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category === selectedCategory);
            const categoryObj = categories.find(c => c.value === selectedCategory);
            setCurrentCategoryName(categoryObj ? `Reptile ${categoryObj.name}` : 'Reptile Products');
        } else {
            setCurrentCategoryName('Reptile Products');
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
    }, [selectedCategory, sortOption, reptileProducts]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = "/assets/no-image.png";
    };

    const handleByNowProduct = (product: ReptileProduct) => {
        try {
            const byNowProduct = [{ ...product, quantity: 1 }];

            localStorage.setItem(CART_BYNOW_KEY, JSON.stringify(byNowProduct));

            setCartItems(byNowProduct);

            console.log('Product ready for immediate purchase:', product.name);
        } catch (error) {
            console.error('Error saving product for immediate purchase:', error);
        }
    };

    const handleAddToCart = (product: ReptileProduct) => {
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
        <Box className="reptile-page">
            <Typography variant="h3" component="h1" gutterBottom className="reptile-title">
                {currentCategoryName}
            </Typography>

            <Box className="reptile-controls">
                <Box className="reptile-category-buttons">
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

            <Box className="reptile-products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <Box
                            key={product.id}
                            className="reptile-card"
                            onClick={() => handleCardClick(product)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <Box className="reptile-card-img-wrapper">
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
                            <Box className="reptile-card-body">
                                <Typography variant="h6" component="h3" gutterBottom className="reptile-card-title">
                                    {product.name}
                                </Typography>
                                <Box className="reptile-card-rating">
                                    <Rating value={product.rating} precision={0.5} readOnly />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        {product.rating.toFixed(1)}
                                    </Typography>
                                </Box>
                                <Typography className="reptile-card-description">
                                    {product.description}
                                </Typography>
                                <Typography className="reptile-card-category">
                                    {product.category.toUpperCase()}
                                </Typography>
                                <Typography className="reptile-card-price">
                                    ${product.price.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box className="reptile-card-footer">
                                <Button
                                    variant="contained"
                                    size="small"
                                    className="reptile-add-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleByNowProduct(product);
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
                                <Button
                                    variant="contained"
                                    disabled={!product.inStock}
                                    size="small"
                                    className="reptile-add-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
                                    sx={{
                                        backgroundColor: '#ff6f00',
                                        '&:hover': {
                                            backgroundColor: '#e65100'
                                        }
                                    }}
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
                                            value && <Typography key={key} variant="body2">
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
                    {/* <Button
                        variant="outlined"
                        onClick={() => setOpenDialog(false)}
                    >
                        Close
                    </Button> */}
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
                        color="primary"
                        disabled={!selectedProduct?.inStock}
                        onClick={() => {
                            if (selectedProduct) {
                                handleByNowProduct(selectedProduct);
                                setOpenDialog(false);
                                // Optionally navigate to checkout here
                                // navigate('/checkout');
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

export default ReptileProductsPage;