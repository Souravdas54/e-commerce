import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Divider, IconButton, Typography, TextField, FormControl, InputLabel, Select,
    MenuItem, Radio, RadioGroup, FormControlLabel, Checkbox, Stepper, Step, StepLabel,
} from '@mui/material';
import { Add, Remove, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './paystyle.css';

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    rating: number;
    deliveryCharge: number;
    discount: number;
}

const BuyNowPage: React.FC = () => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState<number>(1);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>('upi');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiryDate, setExpiryDate] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');
    const [selectedBank, setSelectedBank] = useState<string>('');

    // Sample product data
    const product: Product = {
        id: 1,
        name: 'Premium Wireless Headphones',
        image: 'https://via.placeholder.com/300',
        price: 348,
        rating: 4.5,
        deliveryCharge: 0,
        discount: 50,
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const calculateTotal = () => {
        const subtotal = product.price * quantity;
        const total = subtotal - product.discount + 5; // 5 is platform fee
        return total;
    };

    const handleContinueToPayment = () => {
        setActiveStep(1);
    };

    const handlePaymentSubmit = () => {
        // Process payment logic here
        alert('Payment successful!');
        navigate('/order-confirmation');
    };

    const steps = ['Order Summary', 'Payment'];

    return (
        <Box className="buy-now-container">
            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 ? (
                <Box className="order-summary-container">
                    {/* Product Card */}
                    <Card className="product-card">
                        <Box className="product-card-content">
                            <CardMedia
                                component="img"
                                className="product-image"
                                image={product.image}
                                alt={product.name}
                            />
                            <CardContent className="product-details">
                                <Typography variant="h6" className="product-name">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" className="product-rating">
                                    Rating: {product.rating} ★
                                </Typography>
                                <Typography variant="h6" className="product-price">
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Box className="quantity-control">
                                    <Typography variant="body1">Quantity:</Typography>
                                    <IconButton
                                        onClick={handleDecrement}
                                        aria-label="reduce"
                                        className="quantity-button"
                                    >
                                        <Remove />
                                    </IconButton>
                                    <TextField
                                        value={quantity}
                                        variant="outlined"
                                        size="small"
                                        className="quantity-input"
                                        inputProps={{
                                            min: 1,
                                            style: { textAlign: 'center' },
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleIncrement}
                                        aria-label="increase"
                                        className="quantity-button"
                                    >
                                        <Add />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" className="delivery-info">
                                    Delivery: {product.deliveryCharge === 0 ? 'FREE' : `$${product.deliveryCharge.toFixed(2)}`}
                                </Typography>
                            </CardContent>
                        </Box>
                    </Card>

                    {/* Price Details Card */}
                    <Card className="price-details-card">
                        <CardContent>
                            <Typography variant="h6" className="price-details-title">
                                Price Details
                            </Typography>
                            <Divider className="divider" />

                            <Box className="price-row">
                                <Typography>Price ({quantity} item{quantity > 1 ? 's' : ''})</Typography>
                                <Typography>${(product.price * quantity).toFixed(2)}</Typography>
                            </Box>

                            <Box className="price-row">
                                <Typography>Discount</Typography>
                                <Typography className="discount">-${product.discount.toFixed(2)}</Typography>
                            </Box>

                            <Box className="price-row">
                                <Typography>Platform Fee</Typography>
                                <Typography>$5.00</Typography>
                            </Box>

                            <Box className="price-row">
                                <Typography>Delivery Charge</Typography>
                                <Typography>{product.deliveryCharge === 0 ? 'FREE' : `$${product.deliveryCharge.toFixed(2)}`}</Typography>
                            </Box>

                            <Divider className="divider" />

                            <Box className="price-row total-row">
                                <Typography variant="subtitle1">Total Amount</Typography>
                                <Typography variant="subtitle1">${calculateTotal().toFixed(2)}</Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="continue-button"
                                endIcon={<ArrowForward />}
                                onClick={handleContinueToPayment}
                            >
                                Continue
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <Box className="payment-container">
                    <Box className="payment-content">
                        <Card className="payment-methods-card">
                            <CardContent>
                                <Typography variant="h6" className="payment-title">
                                    Payment Options
                                </Typography>
                                <Divider className="divider" />

                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    {/* UPI Payment */}
                                    <FormControlLabel
                                        value="upi"
                                        control={<Radio />}
                                        label={
                                            <Box className="payment-option">
                                                <Typography variant="subtitle1">UPI</Typography>
                                                <Typography variant="body2">Pay by any UPI app</Typography>
                                                {paymentMethod === 'upi' && (
                                                    <Box className="upi-options">
                                                        <Button variant="outlined" className="upi-button">
                                                            Google Pay
                                                        </Button>
                                                        <Button variant="outlined" className="upi-button">
                                                            PhonePe
                                                        </Button>
                                                        <Typography variant="body2" className="add-upi">
                                                            Add new UPI ID
                                                        </Typography>
                                                        <Typography variant="body2" className="help-text">
                                                            How to find?
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        }
                                    />

                                    {/* Card Payment */}
                                    <FormControlLabel
                                        value="card"
                                        control={<Radio />}
                                        label={
                                            <Box className="payment-option">
                                                <Typography variant="subtitle1">Credit / Debit / ATM Card</Typography>
                                               
                                                {paymentMethod === 'card' && (
                                                    <Box className="card-details">
                                                        <Typography variant="body2" className="note-text">
                                                            Note: Please ensure your card can be used for online transactions.
                                                            <span className="learn-more">Learn More</span>
                                                        </Typography>
                                                        <TextField
                                                            label="Card Number"
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="XXXX XXXX XXXX XXXX"
                                                            className="card-input"
                                                            value={cardNumber}
                                                            onChange={(e) => setCardNumber(e.target.value)}
                                                        />
                                                        <Box className="card-fields">
                                                            <TextField
                                                                label="Valid Thru"
                                                                variant="outlined"
                                                                fullWidth
                                                                placeholder="MM / YY"
                                                                className="card-input"
                                                                value={expiryDate}
                                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                            />
                                                            <TextField
                                                                label="CVV"
                                                                variant="outlined"
                                                                fullWidth
                                                                placeholder="CVV"
                                                                className="card-input"
                                                                value={cvv}
                                                                onChange={(e) => setCvv(e.target.value)}
                                                            />
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        }
                                    />

                                    {/* Net Banking */}
                                    <FormControlLabel
                                        value="netbanking"
                                        control={<Radio />}
                                        label={
                                            <Box className="payment-option">
                                                <Typography variant="subtitle1">Net Banking</Typography>
                                                {paymentMethod === 'netbanking' && (
                                                    <FormControl fullWidth className="bank-select">
                                                        
                                                        <InputLabel>Select Bank</InputLabel>
                                                        <Select
                                                            value={selectedBank}
                                                            onChange={(e) => setSelectedBank(e.target.value as string)}
                                                        >
                                                            <MenuItem value="sbi">State Bank of India</MenuItem>
                                                            <MenuItem value="hdfc">HDFC Bank</MenuItem>
                                                            <MenuItem value="icici">ICICI Bank</MenuItem>
                                                            <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
                                                            <MenuItem value="axis">Axis Bank</MenuItem>
                                                            <MenuItem value="federal">Federal Bank</MenuItem>
                                                            <MenuItem value="iob">Indian Overseas Bank</MenuItem>
                                                            <MenuItem value="indian">Indian Bank</MenuItem>
                                                            <MenuItem value="other">All other banks</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                )}
                                            </Box>
                                        }
                                    />

                                    {/* Cash on Delivery */}
                                    <FormControlLabel
                                        value="cod"
                                        control={<Radio />}
                                        label={
                                            <Box className="payment-option">
                                                <Typography variant="subtitle1">Cash on Delivery</Typography>
                                                <Typography variant="body2">
                                                    Due to handling costs, a nominal fee of $9 will be charged
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </RadioGroup>

                                <Box className="additional-options">
                                    <Typography variant="body2" className="gift-card-text">
                                        Have a Gift Card? <span className="add-link">Add</span>
                                    </Typography>
                                    <FormControlLabel
                                        control={<Checkbox disabled />}
                                        label="EMI Unavailable"
                                        className="disabled-option"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox disabled />}
                                        label="Wallet Unavailable"
                                        className="disabled-option"
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card className="order-summary-card">
                            <CardContent>
                                <Typography variant="h6" className="summary-title">
                                    Order Summary
                                </Typography>
                                <Divider className="divider" />

                                <Box className="summary-row">
                                    <Typography>Price ({quantity} item{quantity > 1 ? 's' : ''})</Typography>
                                    <Typography>${(product.price * quantity).toFixed(2)}</Typography>
                                </Box>

                                <Box className="summary-row">
                                    <Typography>Discount</Typography>
                                    <Typography className="discount">-${product.discount.toFixed(2)}</Typography>
                                </Box>

                                <Box className="summary-row">
                                    <Typography>Platform Fee</Typography>
                                    <Typography>$5.00</Typography>
                                </Box>

                                <Box className="summary-row">
                                    <Typography>Delivery Charge</Typography>
                                    <Typography>{product.deliveryCharge === 0 ? 'FREE' : `$${product.deliveryCharge.toFixed(2)}`}</Typography>
                                </Box>

                                <Divider className="divider" />

                                <Box className="summary-row total-row">
                                    <Typography variant="subtitle1">Total Amount</Typography>
                                    <Typography variant="subtitle1">${calculateTotal().toFixed(2)}</Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    className="pay-button"
                                    onClick={handlePaymentSubmit}
                                >
                                    Pay ${calculateTotal().toFixed(2)}
                                </Button>

                                <Typography variant="body2" className="happy-customers">
                                    35 Crore happy customers and counting!
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default BuyNowPage;