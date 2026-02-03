import { useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const navLinkStyles = {
  color: 'var(--color-muted)',
  fontWeight: 600,
  borderRadius: '10px',
  paddingX: 1.8,
  paddingY: 0.9,
  textTransform: 'none',
  backgroundColor: 'var(--color-surface-muted)',
  border: '1px solid transparent',
  minHeight: 40,
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
    color: '#1f1f1f',
    borderColor: 'transparent',
  },
};

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const navItems = useMemo(
    () => [
      { label: 'Start', to: '/', icon: <HomeRoundedIcon fontSize="small" /> },
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

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <div className="page">
      {isAuthenticated && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: '18px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            paddingX: { xs: 1, md: 2 },
            backdropFilter: 'blur(12px)',
            width: '100%',
            maxWidth: 'var(--max-width)',
            alignSelf: 'center',
          }}
        >
          <Toolbar disableGutters sx={{ gap: 2, paddingY: 1, paddingX: 2 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Avatar sx={{ bgcolor: 'var(--color-accent)', width: 36, height: 36 }}>B</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f1f1f' }}>
                  Braiderski Panel
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--color-muted)' }}>
                  Zarządzaj rezerwacjami w jednym miejscu
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  startIcon={item.icon}
                  sx={navLinkStyles}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                backgroundColor: 'var(--color-surface-muted)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
              }}
              size="small"
              aria-label="Otwórz menu nawigacji"
            >
              <MenuRoundedIcon />
            </IconButton>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  marginTop: 1,
                  borderRadius: 3,
                  minWidth: 200,
                  border: '1px solid var(--color-border)',
                },
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  onClick={handleMenuClose}
                  sx={{
                    gap: 1.5,
                    '&.active': {
                      backgroundColor: 'var(--color-bg-accent)',
                      color: '#1f1f1f',
                    },
                  }}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="body2" sx={{ color: 'var(--color-muted)', fontWeight: 600 }}>
                Witaj, {user?.fullName}
              </Typography>
              <Button
                onClick={logout}
                variant="outlined"
                startIcon={<LogoutRoundedIcon fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  backgroundColor: 'transparent',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted)',
                  minHeight: 40,
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
                Wyloguj
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      )}

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
    </div>
  );
}
