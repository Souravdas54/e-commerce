import React, { useState } from 'react';
import {
    AppBar, Toolbar, Button, MenuItem, Box, Container, IconButton, Drawer, List, ListItem, Collapse,
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

const Appbar: React.FC<AppbarProps> = ({ cartItemCount = 0 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
    const navigate = useNavigate();

    const navItems: NavItem[] = [
        { title: 'Shop All', subItems: [], path: '/allshop' },
        { title: 'Dogs', subItems: ['Dog food', 'Dog toys', 'Dog collars', 'Dog beds'], path: '/dogs' },
        { title: 'Cats', subItems: ['Cat poles', 'Cat tools', 'Cat toys'], path: '/cattyos' },
        { title: 'Birds', subItems: ['Birds food', 'Birds house', 'Birds toys'], path: '/bird' },
        { title: 'Fish & Aquatics', subItems: ['Aquariums', 'Cleaning', 'Decoration'], path: '/fishpage' },
        { title: 'Small Animals', subItems: ['Animal Cages', 'Animal equipment', 'Animal toys'], path: '/small-animals' },
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
                                        Shop
                                    </Button>
                                <IconButton
                                    color="inherit"
                                    onClick={() => navigate('/cart')}
                                    sx={{ mr: 1 }}
                                >
                                    <Badge badgeContent={cartItemCount} color="primary">
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
                           { renderDesktopNav()}
                                < IconButton
                                    color="inherit"
                                    onClick={() => navigate('/cart')}
                                    sx={{ ml: 2 }}
                                >
                                    <Badge badgeContent={cartItemCount} color="primary">
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


// import React, { useState } from 'react';
// import {
//     AppBar, Toolbar, Button, MenuItem, Box, Container, IconButton, Drawer, List, ListItem, Collapse,
//     Divider, useMediaQuery, useTheme, Popover
// } from '@mui/material';
// import { Menu as MenuIcon, ExpandMore, ExpandLess, ChevronRight } from '@mui/icons-material';
// import './appbar.css';

// interface NavItem {
//     title: string;
//     subItems: string[];
// }

// const Appbar: React.FC = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
//     const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

//     const navItems: NavItem[] = [
//         { title: 'Shop All', subItems: [] },
//         { title: 'Dogs', subItems: ['dog food', 'dog toys', 'dog collars', 'dog beds'] },
//         { title: 'Cats', subItems: ['cat poles', 'cat tools', 'cat toys'] },
//         { title: 'Birds', subItems: ['birds food', 'birds house', 'birds toys'] },
//         { title: 'Fish & Aquatics', subItems: ['Aquariums', 'Cleaning', 'Decoration'] },
//         { title: 'Small Animals', subItems: ['Animal Cages', 'Animal equipment', 'Animal toys'] },
//         { title: 'Replies', subItems: ['Replies Aquariums', 'Replies Decoration', 'Replies Heating'] },
//     ];

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     const handleMobileItemClick = (title: string) => {
//         if (navItems.find(item => item.title === title)?.subItems.length) {
//             setExpandedItems(prev => ({
//                 ...prev,
//                 [title]: !prev[title]
//             }));
//         } else {
//             handleMenuItemClick(title);
//             setMobileOpen(false);
//         }
//     };

//     const handleMenuItemClick = (item: string) => {
//         console.log(`Navigating to ${item}`);
//         // Implement your navigation logic here
//     };

//     const handleDesktopItemClick = (event: React.MouseEvent<HTMLElement>, title: string) => {
//         if (navItems.find(item => item.title === title)?.subItems.length) {
//             setAnchorEl(prev => ({
//                 ...prev,
//                 [title]: prev[title] ? null : event.currentTarget
//             }));
//         } else {
//             handleMenuItemClick(title);
//         }
//     };

//     const handlePopoverClose = (title: string) => {
//         setAnchorEl(prev => ({
//             ...prev,
//             [title]: null
//         }));
//     };

//     const renderDesktopNav = () => (
//         <Box className="desktop-nav-items" sx={{ display: 'flex' }}>
//             {navItems.map((navItem) => (
//                 <div key={navItem.title}>
//                     <Button
//                         color="inherit"
//                         onClick={(e) => handleDesktopItemClick(e, navItem.title)}
//                         endIcon={navItem.subItems.length > 0 ? <ExpandMore /> : null}
//                         sx={{
//                             mx: 1,
//                             textTransform: 'none',
//                             fontSize: '1rem',
//                             '&:hover': {
//                                 backgroundColor: 'rgba(0, 0, 0, 0.04)'
//                             }
//                         }}
//                     >
//                         {navItem.title}
//                     </Button>
//                     {navItem.subItems.length > 0 && (
//                         <Popover
//                             open={Boolean(anchorEl[navItem.title])}
//                             anchorEl={anchorEl[navItem.title]}
//                             onClose={() => handlePopoverClose(navItem.title)}
//                             anchorOrigin={{
//                                 vertical: 'bottom',
//                                 horizontal: 'left',
//                             }}
//                             transformOrigin={{
//                                 vertical: 'top',
//                                 horizontal: 'left',
//                             }}
//                             sx={{ mt: 1, }}>
//                             <Box
//                                 sx={{
//                                     backgroundColor: 'white',
//                                     boxShadow: 1,
//                                     borderRadius: 1,
//                                     minWidth: 200,
//                                 }}>
//                                 {navItem.subItems.map((subItem) => (
//                                     <MenuItem
//                                         key={subItem}
//                                         onClick={() => {
//                                             handleMenuItemClick(subItem);
//                                             handlePopoverClose(navItem.title);
//                                         }}
//                                         sx={{
//                                             py: 1.5, px: 3,
//                                             '&:hover': {
//                                                 backgroundColor: 'rgba(0, 0, 0, 0.04)'
//                                             }
//                                         }}>
//                                         {subItem}
//                                     </MenuItem>
//                                 ))}
//                             </Box>
//                         </Popover>
//                     )}
//                 </div>
//             ))}
//         </Box>
//     );

//     const renderMobileNav = () => (
//         <Drawer
//             variant="temporary"
//             open={mobileOpen}
//             onClose={handleDrawerToggle}
//             ModalProps={{
//                 keepMounted: true,
//             }}
//             className="mobile-menu"
//             sx={{
//                 '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '80%' },
//             }}
//         >
//             <Box sx={{ textAlign: 'center' }}>
//                 <List>
//                     {navItems.map((navItem) => (
//                         <React.Fragment key={navItem.title}>
//                             <ListItem disablePadding>
//                                 <Button
//                                     fullWidth
//                                     sx={{
//                                         justifyContent: 'space-between',
//                                         px: 3,
//                                         py: 1.5,
//                                         textTransform: 'none',
//                                         color: 'text.primary',
//                                         textAlign: 'left'
//                                     }}
//                                     onClick={() => handleMobileItemClick(navItem.title)}
//                                     endIcon={
//                                         navItem.subItems.length ?
//                                             (expandedItems[navItem.title] ? <ExpandLess /> : <ExpandMore />) :
//                                             <ChevronRight />
//                                     }
//                                 >
//                                     {navItem.title}
//                                 </Button>
//                             </ListItem>
//                             {navItem.subItems.length > 0 && (
//                                 <Collapse in={expandedItems[navItem.title]} timeout="auto" unmountOnExit>
//                                     <List component="div" disablePadding>
//                                         {navItem.subItems.map((subItem) => (
//                                             <ListItem key={subItem} disablePadding>
//                                                 <Button
//                                                     fullWidth
//                                                     sx={{
//                                                         pl: 6,
//                                                         py: 1.5,
//                                                         textTransform: 'none',
//                                                         color: 'text.secondary',
//                                                         justifyContent: 'flex-start'
//                                                     }}
//                                                     onClick={() => {
//                                                         handleMenuItemClick(subItem);
//                                                         setMobileOpen(false);
//                                                     }}
//                                                 >
//                                                     {subItem}
//                                                 </Button>
//                                             </ListItem>
//                                         ))}
//                                     </List>
//                                 </Collapse>
//                             )}
//                             <Divider />
//                         </React.Fragment>
//                     ))}
//                 </List>
//             </Box>
//         </Drawer>
//     );

//     return (
//         <div className="navbar-container">
//             <AppBar position="static" color="default" elevation={0}>
//                 <Container maxWidth="xl">
//                     <Toolbar disableGutters sx={{ justifyContent: 'center', alignItems: 'center' }}>
//                         {isMobile && (
//                             <IconButton
//                                 color="inherit"
//                                 aria-label="open drawer"
//                                 edge="start"
//                                 onClick={handleDrawerToggle}
//                                 className="mobile-menu-button"
//                                 sx={{ mr: 2 }}
//                             >
//                                 <MenuIcon />
//                             </IconButton>
//                         )}

//                         {!isMobile && renderDesktopNav()}
//                     </Toolbar>
//                 </Container>
//             </AppBar>
//             {isMobile && renderMobileNav()}
//         </div>
//     );
// };

// export default Appbar;