import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CalendarPage from './pages/CalendarPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ClientsPage from './pages/ClientsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductsPage from './pages/ProductsPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServicesPage from './pages/ServicesPage';
import OrdersPage from './pages/OrdersPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { t } from './utils/i18n';
import logoSrc from './assets/spokoloko-logo.png';

const navLinkStyles = {
  color: 'var(--color-text)',
  fontWeight: 600,
  borderRadius: '10px',
  textTransform: 'none',
  backgroundColor: 'transparent',
  border: '1px solid transparent',
  gap: 1,
  '&:hover': {
    backgroundColor: 'var(--color-bg-accent)',
    borderColor: 'var(--color-border)',
  },
  '&:focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 3px var(--color-focus)',
  },
  '&.active': {
    backgroundColor: 'var(--color-accent)',
    color: 'var(--accent-contrast)',
    borderColor: 'transparent',
  },
};

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const expandedSidebarWidth = 284;
  const collapsedSidebarWidth = 92;
  const sidebarWidth = sidebarExpanded ? expandedSidebarWidth : collapsedSidebarWidth;
  const navItems = [
    {
      label: t('nav.clients'),
      to: '/clients',
      icon: <PeopleAltRoundedIcon fontSize="small" />,
    },
    {
      label: t('nav.appointments'),
      to: '/appointments',
      icon: <EventAvailableRoundedIcon fontSize="small" />,
    },
    {
      label: t('nav.calendar'),
      to: '/calendar',
      icon: <CalendarMonthRoundedIcon fontSize="small" />,
    },
    {
      label: t('nav.products'),
      to: '/products',
      icon: <Inventory2RoundedIcon fontSize="small" />,
    },
    {
      label: t('nav.services'),
      to: '/services',
      icon: <DesignServicesRoundedIcon fontSize="small" />,
    },
    {
      label: t('nav.orders'),
      to: '/orders',
      icon: <ShoppingBagRoundedIcon fontSize="small" />,
    },
  ];

  useEffect(() => {
    document.title = t('app.documentTitle');
  }, []);

  const handleDrawerToggle = (open) => () => {
    setDrawerOpen(open);
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded((current) => !current);
  };

  const renderNavigationItems = (isCollapsed = false, onNavigate) =>
    navItems.map((item) => (
      <ListItemButton
        key={item.to}
        component={NavLink}
        to={item.to}
        onClick={onNavigate}
        sx={{
          borderRadius: 2,
          marginBottom: 0.5,
          minHeight: 50,
          paddingY: 1.2,
          paddingX: isCollapsed ? 1.2 : 1.8,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          transition: 'all 220ms ease',
          '&.active': {
            backgroundColor: 'var(--color-bg-accent)',
            color: 'var(--color-text)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: isCollapsed ? 0 : 34,
            marginRight: isCollapsed ? 0 : 1,
            justifyContent: 'center',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{ fontSize: '0.96rem', fontWeight: 600 }}
          sx={{
            opacity: isCollapsed ? 0 : 1,
            maxWidth: isCollapsed ? 0 : 160,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'opacity 150ms ease, max-width 220ms ease',
          }}
        />
      </ListItemButton>
    ));

  const appRoutes = (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  );

  return (
    <div className="page">
      {isAuthenticated ? (
        <Box className="app-layout">
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', md: 'block' },
              width: sidebarWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: sidebarWidth,
                overflowX: 'hidden',
                transition: 'width 240ms cubic-bezier(0.4, 0, 0.2, 1)',
                borderRight: '1px solid var(--color-border)',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(14px)',
                padding: 2,
              },
            }}
          >
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box component={NavLink} to="/" className="topbar-logo">
                  <Box
                    component="img"
                    src={logoSrc}
                    alt={t('app.logoAlt')}
                    className="topbar-logo-image"
                    sx={{ height: sidebarExpanded ? 54 : 42 }}
                  />
                </Box>
                <IconButton
                  onClick={handleSidebarToggle}
                  aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                  sx={{ border: '1px solid var(--color-border)' }}
                >
                  {sidebarExpanded ? (
                    <ChevronLeftRoundedIcon fontSize="small" />
                  ) : (
                    <ChevronRightRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Stack>

              <List disablePadding>{renderNavigationItems(!sidebarExpanded)}</List>

              <Box sx={{ marginTop: 'auto' }}>
                <Divider sx={{ marginBottom: 2 }} />
                <Stack spacing={1.5} alignItems={sidebarExpanded ? 'flex-start' : 'center'}>
                  {sidebarExpanded && (
                    <Typography variant="body2" sx={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                      {t('app.greeting', { name: user?.fullName ?? '' })}
                    </Typography>
                  )}
                  <Button
                    onClick={logout}
                    startIcon={<LogoutRoundedIcon fontSize="small" />}
                    sx={navLinkStyles}
                  >
                    {sidebarExpanded ? t('app.logout') : ''}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Drawer>

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle(false)}
            PaperProps={{
              sx: {
                width: 280,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
              },
            }}
          >
            <Stack spacing={2} sx={{ padding: 3 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {t('app.navigationTitle')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-muted)' }}>
                  {t('app.navigationSubtitle')}
                </Typography>
              </Box>
              <List disablePadding>{renderNavigationItems(false, handleDrawerToggle(false))}</List>
              <Divider />
              <Typography variant="body2" sx={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                {t('app.greeting', { name: user?.fullName ?? '' })}
              </Typography>
              <IconButton
                onClick={() => {
                  handleDrawerToggle(false)();
                  logout();
                }}
                aria-label={t('app.logout')}
                sx={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  color: 'var(--color-muted)',
                  minHeight: 40,
                  minWidth: 40,
                  '&:hover': {
                    backgroundColor: 'var(--color-bg-accent)',
                  },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Drawer>

          <Box className="app-main">
            <AppBar
              position="sticky"
              elevation={0}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.86)',
                boxShadow: 'var(--shadow-sm)',
                borderBottom: '1px solid var(--color-border)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <Toolbar disableGutters sx={{ gap: 2, paddingY: 2, paddingX: 2.5 }}>
                <IconButton
                  onClick={handleDrawerToggle(true)}
                  sx={{
                    display: { xs: 'inline-flex', md: 'none' },
                    backgroundColor: 'var(--color-surface-muted)',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    padding: 1,
                  }}
                  size="medium"
                  aria-label={t('app.openNavigationMenu')}
                >
                  <MenuRoundedIcon fontSize="large" />
                </IconButton>
                <Typography variant="body2" sx={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                  {t('app.greeting', { name: user?.fullName ?? '' })}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  onClick={logout}
                  aria-label={t('app.logout')}
                  sx={{
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-muted)',
                    minHeight: 40,
                    minWidth: 40,
                    '&:hover': {
                      backgroundColor: 'var(--color-bg-accent)',
                    },
                  }}
                >
                  <LogoutRoundedIcon fontSize="small" />
                </IconButton>
              </Toolbar>
            </AppBar>

            <Box className="app-content">{appRoutes}</Box>

            <footer className="site-footer">
              <div className="footer-content">
                <div>
                  <h3>{t('footer.contactTitle')}</h3>
                  <p className="muted">{t('footer.address')}</p>
                  <p className="muted">{t('footer.contactLine')}</p>
                </div>
                <div className="footer-social">
                  <span className="muted">{t('footer.followUs')}</span>
                  <div className="footer-links">
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t('footer.instagramLabel')}
                    >
                      <InstagramIcon fontSize="small" /> {t('footer.instagram')}
                    </a>
                    <a
                      href="https://www.facebook.com/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t('footer.facebookLabel')}
                    >
                      <FacebookRoundedIcon fontSize="small" /> {t('footer.facebook')}
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </Box>
        </Box>
      ) : (
        <>
          {appRoutes}
          <footer className="site-footer">
            <div className="footer-content">
              <div>
                <h3>{t('footer.contactTitle')}</h3>
                <p className="muted">{t('footer.address')}</p>
                <p className="muted">{t('footer.contactLine')}</p>
              </div>
              <div className="footer-social">
                <span className="muted">{t('footer.followUs')}</span>
                <div className="footer-links">
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t('footer.instagramLabel')}
                  >
                    <InstagramIcon fontSize="small" /> {t('footer.instagram')}
                  </a>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={t('footer.facebookLabel')}
                  >
                    <FacebookRoundedIcon fontSize="small" /> {t('footer.facebook')}
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
