import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import { handlelogout } from '../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';
// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Header() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isoptions, setIsOptions] = React.useState(false);


    const { isLogin } = useSelector((state:RootState) => state.authKey)

    React.useEffect(() => {
        if (isLogin) {
            //   dispatch(profiledatafetch());

        }
    }, [isLogin, dispatch])

    const handelLogoutuser = () => {

        dispatch(handlelogout());
        localStorage.clear();
        // localStorage.removeItem('token');
        // localStorage.removeItem('first_name');

        setIsOptions(false);
        navigate('/login')
        window.location.reload();
    }

    // FIRST NAME & LAST NAME SHOW STATE //
    const [getFullName, setGetFullName] = React.useState('');

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const fullName = localStorage.getItem('name');

        setIsOptions(!!token);
        if (token) {
            setGetFullName(fullName || '');

        } else {
            setGetFullName("");


        }
        // DISPATCH isLogin
    }, [isLogin])
// APPBAR //
  const pages = isLogin ? [
    { name: "Home", path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Service', path: '/service' },
    { name: 'Create', path: '/create' },
    { name: "List", path: '/list' },
  ] : [
    { name: "Home", path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Register', path: "/register" },
    { name: 'Create', path: '/create' },
    { name: "List", path: '/list' },
    { name: 'Service', path: '/service' },


  ];
    // POPUP BAR PAGES // 
    const settings = isoptions ? [{ name: 'Profile', path: '/profile' },
    { name: 'Logout', action: handelLogoutuser }] : [{ name: 'Profile', path: '/profile' },
    { name: 'Login', path: '/login' }];

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.path} onClick={handleCloseNavMenu} >
                                    <Link to={page.path} key={page.path} style={{ textDecoration: 'none' }}>
                                        <Typography InputProps={{ disableUnderline: true }}
                                            sx={{ textAlign: 'center', color: 'black', letterSpacing: '0.0625rem' }}>{page.name}</Typography>
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link to={page.path} key={page.path} underline="none" style={{ textDecoration: 'none', }}>
                                <Button onClick={() => handlePageNavigation(page)}
                                    key={page.path}
                                    // onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2, color: 'black', display: 'block',
                                        letterSpacing: '0.0625rem',
                                        gap: 1, justifyContent: 'center', alignItems: 'center'
                                    }}
                                >
                                    {page.name}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="S" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {
                                isLogin && (
                                    <MenuItem >
                                        <Typography >{getFullName}</Typography>
                                    </MenuItem>
                                )
                            }
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={() => {
                                    if (setting.action) {
                                        setting.action();
                                    } else {
                                        handleCloseUserMenu();
                                    }
                                }
                                }>
                                    {setting.path ? (
                                        <Link to={setting.path} style={{ textDecoration: 'none' }}>
                                            <Typography textDecoration='none' sx={{ textAlign: 'center', color: 'black' }}>{setting.name}</Typography>
                                        </Link>
                                    ) : (
                                        <Typography sx={{ textAlign: 'center', color: 'black' }}>{setting.name}</Typography>
                                    )}

                                </MenuItem>

                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;