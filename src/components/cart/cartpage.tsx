import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Divider, IconButton, Paper, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './cartstyle.css';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
}

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const [cart, setCart] = React.useState<CartItem[]>([]);

    React.useEffect(() => {
        const sampleCart: CartItem[] = [
            {
                id: 1,
                name: "Blue Buffalo Life Protection Chicken",
                price: 54.99,
                quantity: 2,
                image: "/images/dog_food/blue_buffalo.jpg",
                size: "30 lb"
            }
        ];
        setCart(sampleCart);
    }, []);

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = subtotal > 500 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    return (
        <Box className="cart-page">
            <Typography variant="h4" gutterBottom className="cart-title">
                Your Shopping Cart
            </Typography>

            {cart.length === 0 ? (
                <Box className="empty-cart">
                    <ShoppingCartIcon className="empty-cart-icon" />
                    <Typography variant="h5" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/dogs')}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            ) : (
                <Box className="cart-container">
                    <Box className="cart-items-container">
                        <Paper elevation={0} className="cart-items-paper">
                            {cart.map((item) => (
                                <Box key={item.id} className="cart-item">
                                    <Box className="cart-item-image-container">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="cart-item-image"
                                        />
                                    </Box>
                                    <Box className="cart-item-details">
                                        <Typography variant="h6" className="cart-item-name">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.size}
                                        </Typography>
                                        <Box className="quantity-controls">
                                            <IconButton
                                                size="small"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="quantity-button"
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <TextField
                                                value={item.quantity}
                                                size="small"
                                                className="quantity-input"
                                                inputProps={{ style: { textAlign: 'center' } }}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="quantity-button"
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                            <Typography className="item-price">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => removeItem(item.id)}
                                                color="error"
                                                className="delete-button"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Divider className="cart-item-divider" />
                                </Box>
                            ))}
                        </Paper>
                    </Box>

                    <Box className="order-summary-container">
                        <Paper elevation={0} className="order-summary-paper">
                            <Typography variant="h6" gutterBottom className="summary-title">
                                Order Summary
                            </Typography>
                            <Box className="summary-row">
                                <Typography>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</Typography>
                                <Typography>${subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box className="summary-row">
                                <Typography>Delivery:</Typography>
                                <Typography>
                                    {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                                </Typography>
                            </Box>
                            <Divider className="summary-divider" />
                            <Box className="summary-total">
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6">${total.toFixed(2)}</Typography>
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                className="checkout-button"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                className="continue-shopping-button"
                                onClick={() => navigate('/dogs')}
                            >
                                Continue Shopping
                            </Button>
                        </Paper>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default CartPage;