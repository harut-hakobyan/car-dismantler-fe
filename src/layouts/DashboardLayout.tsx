import {
    AppBar,
    Avatar,
    Box,
    Divider,
    Drawer,
    Collapse,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import GroupIcon from '@mui/icons-material/Group';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import LanguageSelect from '../components/LanguageSelect';
import { useTranslation } from '../hooks/useTranslation';
import type { TranslationKey } from '../i18n/translations';

const drawerWidth = 264;

const navItems = [
    { labelKey: 'nav.dashboard', path: '/', icon: <DashboardIcon /> },
    { labelKey: 'nav.users', path: '/users', icon: <GroupIcon /> },
    { labelKey: 'nav.roles', path: '/roles', icon: <SecurityIcon /> },
    { labelKey: 'nav.cars', path: '/cars', icon: <DirectionsCarIcon /> },
    { labelKey: 'nav.orders', path: '/orders', icon: <ShoppingCartIcon /> },
    { labelKey: 'nav.customers', path: '/customers', icon: <PeopleIcon /> },
    { labelKey: 'nav.settings', path: '/settings', icon: <SettingsIcon /> },
 ] satisfies Array<{ labelKey: TranslationKey; path: string; icon: ReactNode }>;

export default function DashboardLayout() {
    const { logout, user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [partsExpanded, setPartsExpanded] = useState(location.pathname.startsWith('/parts'));

    useEffect(() => {
        if (location.pathname.startsWith('/parts')) {
            setPartsExpanded(true);
        }
    }, [location.pathname]);

    async function handleLogout() {
        await logout();
        navigate('/login', { replace: true });
    }

    function openUserMenu(event: MouseEvent<HTMLElement>) {
        setMenuAnchor(event.currentTarget);
    }

    function closeUserMenu() {
        setMenuAnchor(null);
    }

    const drawer = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {t('app.name')}
                </Typography>
            </Toolbar>

            <Divider />

            <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
                {navItems.map((item) => {
                    const selected =
                        item.path === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(item.path);

                    return (
                        <ListItemButton
                            key={item.path}
                            selected={selected}
                            onClick={() => {
                                navigate(item.path);
                                setMobileOpen(false);
                            }}
                            sx={{ borderRadius: 1.5, mb: 0.5 }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(item.labelKey)} />
                        </ListItemButton>
                    );
                })}

                <ListItemButton
                    onClick={() => setPartsExpanded((value) => !value)}
                    selected={location.pathname.startsWith('/parts')}
                    sx={{ borderRadius: 1.5, mb: 0.5 }}
                >
                    <ListItemIcon>
                        <Inventory2Icon />
                    </ListItemIcon>
                    <ListItemText primary={t('nav.partsGroup')} />
                    <ExpandMoreIcon
                        sx={{
                            transform: partsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                        }}
                    />
                </ListItemButton>

                <Collapse in={partsExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                        <ListItemButton
                            selected={location.pathname === '/parts'}
                            onClick={() => {
                                navigate('/parts');
                                setMobileOpen(false);
                            }}
                            sx={{ borderRadius: 1.5, mb: 0.5 }}
                        >
                            <ListItemText primary={t('nav.partsInventory')} />
                        </ListItemButton>
                        <ListItemButton
                            selected={location.pathname.startsWith('/parts/templates')}
                            onClick={() => {
                                navigate('/parts/templates');
                                setMobileOpen(false);
                            }}
                            sx={{ borderRadius: 1.5, mb: 0.5 }}
                        >
                            <ListItemText primary={t('nav.partTemplates')} />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>

            <Divider />

            <List sx={{ px: 1, py: 2 }}>
                <ListItemButton
                    onClick={() => {
                        navigate('/profile');
                        setMobileOpen(false);
                    }}
                    sx={{ borderRadius: 1.5, mb: 0.5 }}
                >
                    <ListItemIcon>
                        <Avatar sx={{ width: 28, height: 28 }}>
                            {user?.name?.charAt(0) ?? 'A'}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText
                        primary={user?.name ?? 'Administrator'}
                        secondary={user?.email ?? 'admin@example.com'}
                    />
                </ListItemButton>

                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1.5 }}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={t('nav.logout')} />
                </ListItemButton>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        onClick={() => setMobileOpen(true)}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography sx={{ flexGrow: 1, fontWeight: 700 }}>
                        {t('app.adminPanel')}
                    </Typography>

                    <LanguageSelect />

                    <IconButton onClick={openUserMenu}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.name?.charAt(0) ?? 'A'}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={menuAnchor}
                        open={!!menuAnchor}
                        onClose={closeUserMenu}
                    >
                        <MenuItem
                            onClick={() => {
                                closeUserMenu();
                                navigate('/profile');
                            }}
                        >
                            {t('nav.profile')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                closeUserMenu();
                                navigate('/settings');
                            }}
                        >
                            {t('nav.settings')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                closeUserMenu();
                                handleLogout();
                            }}
                        >
                            {t('nav.logout')}
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    p: { xs: 2, md: 3 },
                    mt: 8,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
