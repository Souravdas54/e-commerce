import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, MenuItem, Box, Container, IconButton, Drawer, List, ListItem, Collapse,
    Divider, useMediaQuery, useTheme, Popover
} from '@mui/material';
import { Menu as MenuIcon, ExpandMore, ExpandLess, ChevronRight, Pets, ShoppingBag } from '@mui/icons-material';
import './appbar.css';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

interface NavItem {
    title: string;
    subItems: string[];
    path?: string;
}

interface AppbarProps {
    cartItemCount?: number;
}

const Appbar: React.FC<AppbarProps> = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    const navItems: NavItem[] = [
        { title: 'Shop All', subItems: [], path: '/allshop' },
        { title: 'Dogs', subItems: ['Dog food', 'Dog toys', 'Dog collars', 'Dog beds'], path: '/dtoys' },
        { title: 'Cats', subItems: ['Cat poles', 'Cat tools', 'Cat toys'], path: '/cattyos' },
        { title: 'Birds', subItems: ['Birds food', 'Birds house', 'Birds toys'], path: '/bird' },
        { title: 'Fish & Aquatics', subItems: ['Aquariums', 'Cleaning', 'Decoration'], path: '/fishpage' },
        { title: 'Small Animals', subItems: ['Animal Cages', 'Animal equipment', 'Animal toys'], path: '/smallanimalpage' },
        { title: 'Reptiles', subItems: ['Reptiles Aquariums', 'Reptiles Decoration', 'Reptiles Heating'], path: '/reptiles' },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMobileItemClick = (title: string) => {
        const item = navItems.find(item => item.title === title);
        if (item?.subItems.length) {
            setExpandedItems(prev => ({
                ...prev,
                [title]: !prev[title]
            }));
        } else {
            handleMenuItemClick(item?.path || '/');
            setMobileOpen(false);
        }
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
    };

    const handleDesktopItemClick = (event: React.MouseEvent<HTMLElement>, title: string) => {
        const item = navItems.find(item => item.title === title);
        if (item?.subItems.length) {
            setAnchorEl(prev => ({
                ...prev,
                [title]: prev[title] ? null : event.currentTarget
            }));
        } else {
            handleMenuItemClick(item?.path || '/');
        }
    };

    const handlePopoverClose = (title: string) => {
        setAnchorEl(prev => ({
            ...prev,
            [title]: null
        }));
    };

    const renderDesktopNav = () => (
        <Box className="desktop-nav-items" sx={{ display: 'flex' }}>
            {navItems.map((navItem) => (
                <div key={navItem.title}>
                    <Button
                        color="inherit"
                        onClick={(e) => handleDesktopItemClick(e, navItem.title)}
                        endIcon={navItem.subItems.length > 0 ? <ExpandMore /> : null}
                        sx={{
                            mx: 1,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        {navItem.title}
                    </Button>
                    {navItem.subItems.length > 0 && (
                        <Popover
                            open={Boolean(anchorEl[navItem.title])}
                            anchorEl={anchorEl[navItem.title]}
                            onClose={() => handlePopoverClose(navItem.title)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            sx={{ mt: 1, }}>
                            <Box
                                sx={{
                                    backgroundColor: 'white',
                                    boxShadow: 1,
                                    borderRadius: 1,
                                    minWidth: 200,
                                }}>
                                {navItem.subItems.map((subItem) => (
                                    <MenuItem
                                        key={subItem}
                                        onClick={() => {
                                            handleMenuItemClick(`${navItem.path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`);
                                            handlePopoverClose(navItem.title);
                                        }}
                                        sx={{
                                            py: 1.5,
                                            px: 3,
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}>
                                        {subItem}
                                    </MenuItem>
                                ))}
                            </Box>
                        </Popover>
                    )}
                </div>
            ))}
        </Box>
    );

    const renderMobileNav = () => (
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true,
            }}
            className="mobile-menu"
            sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80%' },
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <List>
                    {navItems.map((navItem) => (
                        <React.Fragment key={navItem.title}>
                            <ListItem disablePadding>
                                <Button
                                    fullWidth
                                    sx={{
                                        justifyContent: 'space-between',
                                        px: 3,
                                        py: 1.5,
                                        textTransform: 'none',
                                        color: 'text.primary',
                                        textAlign: 'left'
                                    }}
                                    onClick={() => handleMobileItemClick(navItem.title)}
                                    endIcon={
                                        navItem.subItems.length ?
                                            (expandedItems[navItem.title] ? <ExpandLess /> : <ExpandMore />) :
                                            <ChevronRight />
                                    }
                                >
                                    {navItem.title}
                                </Button>
                            </ListItem>
                            {navItem.subItems.length > 0 && (
                                <Collapse in={expandedItems[navItem.title]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {navItem.subItems.map((subItem) => (
                                            <ListItem key={subItem} disablePadding>
                                                <Button
                                                    fullWidth
                                                    sx={{
                                                        pl: 6,
                                                        py: 1.5,
                                                        textTransform: 'none',
                                                        color: 'text.secondary',
                                                        justifyContent: 'flex-start'
                                                    }}
                                                    onClick={() => {
                                                        handleMenuItemClick(`${navItem.path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`);
                                                        setMobileOpen(false);
                                                    }}
                                                >
                                                    {subItem}
                                                </Button>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Drawer>
    );

    useEffect(() => {
        const calculateTotal = () => {
            const cat = parseInt(localStorage.getItem('cat_products_cart_count') || '0');
            const dog = parseInt(localStorage.getItem('dog_products_cart_count') || '0');
            const fish = parseInt(localStorage.getItem('fish_products_cart_count') || '0');
            const bird = parseInt(localStorage.getItem('bird_products_cart_count') || '0');
            const smallanimal = parseInt(localStorage.getItem('small_animal_products_cart_count') || '0');
            const reptiles = parseInt(localStorage.getItem('reptile_products_cart_count') || '0');

            setTotalCount(cat + dog + fish + bird + smallanimal + reptiles);
        };

        // Recalculate whenever localStorage changes
        window.addEventListener('storage', calculateTotal);
        calculateTotal(); // Initial calculation

        return () => window.removeEventListener('storage', calculateTotal);
    }, []);

    return (
        <div className="navbar-container">
            <AppBar position="static" color="default" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{
                        justifyContent: isMobile ? 'space-between' : 'center',
                        alignItems: 'center'
                    }}>
                        {isMobile ? (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => navigate('/')}
                                        sx={{ mr: 1 }}
                                    >
                                        <Pets />
                                    </IconButton>
                                    <Button
                                        startIcon={<ShoppingBag />}
                                        onClick={() => navigate('/allshop')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Shop All
                                    </Button>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => navigate('/cart')}
                                        sx={{ mr: 1 }}
                                    >
                                        <Badge badgeContent={totalCount} color="primary">
                                            <ShoppingCartIcon />
                                        </Badge>
                                    </IconButton>
                                </Box>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="end"
                                    onClick={handleDrawerToggle}
                                    className="mobile-menu-button"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                {renderDesktopNav()}
                                < IconButton
                                    color="inherit"
                                    onClick={() => navigate('/cart')}
                                    sx={{ ml: 2 }}
                                >
                                    <Badge badgeContent={totalCount} color="primary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            {isMobile && renderMobileNav()}
        </div >
    );
};

export default Appbar;
