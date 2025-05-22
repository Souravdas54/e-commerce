import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Tabs, Tab, Box,
    CircularProgress, Snackbar, Alert,Pagination, useMediaQuery, useTheme} from '@mui/material';
import { styled } from '@mui/material/styles';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

interface Reply {
    id: number;
    productId: number;
    userId: number;
    content: string;
    rating: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 345,
    margin: theme.spacing(2),
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: theme.shadows[6]
    }
}));

const ShopAll: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [page, setPage] = useState<number>(1);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const itemsPerPage = isMobile ? 4 : 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const categories = ['dog', 'cat', 'fish', 'bird', 'smallanimal'];
                const fetchPromises = categories.map(category =>
                    fetch(`/database/${category}/${category}.json`)
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to fetch ${category} data`);
                            return response.json();
                        })
                        .then(data => data.map((product: any) => ({
                            ...product,
                            category
                        })))
                );

                const [productsData, repliesData] = await Promise.all([
                    Promise.all(fetchPromises).then(results => results.flat()),
                    fetch('/database/replies/replies.json')
                        .then(response => {
                            if (!response.ok) throw new Error('Failed to fetch replies data');
                            return response.json();
                        })
                ]);

                setProducts(productsData);
                setFilteredProducts(productsData);
                setReplies(repliesData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                showSnackbar(errorMessage, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.category === activeTab));
        }
        setPage(1);
    }, [activeTab, products]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleAddToCart = (product: Product) => {
        showSnackbar(`${product.name} added to cart!`, 'success');
    };

    const getAverageRating = (productId: number): number => {
        const productReplies = replies.filter(reply => reply.productId === productId);
        if (productReplies.length === 0) return 0;
        const totalRating = productReplies.reduce((sum, reply) => sum + reply.rating, 0);
        return Math.round((totalRating / productReplies.length) * 10) / 10;
    };

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <Alert severity="error" variant="filled">
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: isMobile ? 2 : 4,
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            <Typography variant="h4" gutterBottom sx={{
                mb: 4,
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                Shop All Products
            </Typography>

            <Box sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 4,
                width: '100%',
                overflowX: 'auto'
            }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="product categories"
                >
                    <Tab label="All" value="all" />
                    <Tab label="Dogs" value="dog" />
                    <Tab label="Cats" value="cat" />
                    <Tab label="Fish" value="fish" />
                    <Tab label="Birds" value="bird" />
                    <Tab label="Small Animals" value="smallanimal" />
                </Tabs>
            </Box>

            {filteredProducts.length === 0 ? (
                <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
                    No products found in this category.
                </Typography>
            ) : (
                <>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '16px',
                        width: '100%'
                    }}>
                        {paginatedProducts.map((product) => (
                            <StyledCard key={product.id}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image || '/placeholder-product.jpg'}
                                    alt={product.name}
                                    sx={{ objectFit: 'contain', p: 1 }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {product.description.length > 100
                                            ? `${product.description.substring(0, 100)}...`
                                            : product.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Rating: {getAverageRating(product.id)}/5 ({replies.filter(r => r.productId === product.id).length} reviews)
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                        ${product.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <Button size="small" color="primary">
                                        Details
                                    </Button>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        variant="contained"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardActions>
                            </StyledCard>
                        ))}
                    </Box>

                    <Box display="flex" justifyContent="center" mt={4} mb={4}>
                        <Pagination
                            count={Math.ceil(filteredProducts.length / itemsPerPage)}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size={isMobile ? "small" : "large"}
                        />
                    </Box>
                </>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ShopAll;