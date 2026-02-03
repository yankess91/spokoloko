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
  color: '#5b5448',
  fontWeight: 600,
  borderRadius: 999,
  paddingX: 1.5,
  paddingY: 0.6,
  textTransform: 'none',
  backgroundColor: '#f0e7d6',
  gap: 1,
  '&.active': {
    backgroundColor: '#c9a227',
    color: '#111111',
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
          position="static"
          elevation={0}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 4,
            boxShadow: '0 10px 24px rgba(19, 12, 9, 0.06)',
            paddingX: { xs: 1, md: 2 },
          }}
        >
          <Toolbar disableGutters sx={{ gap: 2, paddingY: 1, paddingX: 2 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Avatar sx={{ bgcolor: '#c9a227', width: 36, height: 36 }}>B</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111111' }}>
                  Braiderski Panel
                </Typography>
                <Typography variant="caption" sx={{ color: '#6f675c' }}>
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
              sx={{ display: { xs: 'inline-flex', md: 'none' }, backgroundColor: '#f0e7d6' }}
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
                      backgroundColor: '#f4ecde',
                      color: '#111111',
                    },
                  }}
                >
                  {item.icon}
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="body2" sx={{ color: '#5b5448', fontWeight: 600 }}>
                Witaj, {user?.fullName}
              </Typography>
              <Button
                onClick={logout}
                variant="contained"
                startIcon={<LogoutRoundedIcon fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  borderRadius: 999,
                  backgroundColor: '#f0e7d6',
                  color: '#5b5448',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#e9dcc4',
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
