import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
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
import ClientDetailsPage from './pages/ClientDetailsPage';
import ClientsPage from './pages/ClientsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServicesPage from './pages/ServicesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { t } from './utils/i18n';

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
  const logoSrc = 'src/assets/spokoloko-logo.png';
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
      label: t('nav.products'),
      to: '/products',
      icon: <Inventory2RoundedIcon fontSize="small" />,
    },
    {
      label: t('nav.services'),
      to: '/services',
      icon: <DesignServicesRoundedIcon fontSize="small" />,
    },
  ];

  useEffect(() => {
    document.title = t('app.documentTitle');
  }, []);

  const handleDrawerToggle = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div className="page">
      {isAuthenticated && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 0,
            zIndex: 900,
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            backdropFilter: 'blur(16px)',
            width: '100%',
          }}
        >
          <Toolbar disableGutters sx={{ gap: 2, paddingY: 2, paddingX: 2 }}>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              component={NavLink}
              to="/"
              className="topbar-logo"
            >
              <Box
                component="img"
                src={logoSrc}
                alt={t('app.logoAlt')}
                className="topbar-logo-image"
              />
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

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

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={item.icon}
                  sx={navLinkStyles}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              className="topbar-actions"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Typography variant="body2" sx={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                {t('app.greeting', { name: user?.fullName ?? '' })}
              </Typography>
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
                  boxShadow: 'none',
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: '0 0 0 3px var(--color-focus)',
                  },
                  '&:hover': {
                    backgroundColor: 'var(--color-bg-accent)',
                    boxShadow: 'none',
                  },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle(false)}
        PaperProps={{
          sx: {
            width: 280,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
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
          <List disablePadding>
            {navItems.map((item) => (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={handleDrawerToggle(false)}
                sx={{
                  borderRadius: 2,
                  marginBottom: 0.5,
                  paddingY: 1.4,
                  paddingX: 30,
                  minHeight: 52,
                  '&.active': {
                    backgroundColor: 'var(--color-bg-accent)',
                    color: 'var(--color-text)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, paddingX: 0.5 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '1rem', fontWeight: 600 }}
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Box>
            <Typography variant="body2" sx={{ color: 'var(--color-muted)' }}>
              {t('app.loggedInAs')}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.fullName}
            </Typography>
          </Box>
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

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
        </Route>
      </Routes>

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
    </div>
  );
}
