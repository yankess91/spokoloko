import { useMemo, useState } from 'react';
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
  const navItems = useMemo(
    () => [
      {
        label: 'Użytkowniczki',
        to: '/clients',
        icon: <PeopleAltRoundedIcon fontSize="small" />,
      },
      {
        label: 'Wizyty',
        to: '/appointments',
        icon: <EventAvailableRoundedIcon fontSize="small" />,
      },
      {
        label: 'Produkty',
        to: '/products',
        icon: <Inventory2RoundedIcon fontSize="small" />,
      },
      {
        label: 'Usługi',
        to: '/services',
        icon: <DesignServicesRoundedIcon fontSize="small" />,
      },
    ],
    [],
  );

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
                alt="Spoko Loko logo"
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
              aria-label="Otwórz menu nawigacji"
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
                Witaj, {user?.fullName}
              </Typography>
              <IconButton
                onClick={logout}
                aria-label="Wyloguj"
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
              Nawigacja
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-muted)' }}>
              Szybki dostęp do kluczowych sekcji.
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
              Zalogowano jako
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
            aria-label="Wyloguj"
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
            <h3>Kontakt</h3>
            <p className="muted">Braiderski Studio · ul. Słoneczna 12, 00-001 Warszawa</p>
            <p className="muted">Telefon: +48 555 123 456 · Email: kontakt@braiderski.pl</p>
          </div>
          <div className="footer-social">
            <span className="muted">Obserwuj nas</span>
            <div className="footer-links">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon fontSize="small" /> Instagram
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FacebookRoundedIcon fontSize="small" /> Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
