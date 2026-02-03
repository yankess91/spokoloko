import { NavLink, Route, Routes } from 'react-router-dom';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ClientsPage from './pages/ClientsPage';
import DashboardPage from './pages/DashboardPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductsPage from './pages/ProductsPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import ServicesPage from './pages/ServicesPage';

const getNavLinkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export default function App() {
  return (
    <div className="page">
      <nav className="top-nav">
        <div className="brand">Braiderski Panel</div>
        <div className="nav-links">
          <NavLink className={getNavLinkClass} to="/">
            Start
          </NavLink>
          <NavLink className={getNavLinkClass} to="/clients">
            Użytkowniczki
          </NavLink>
          <NavLink className={getNavLinkClass} to="/appointments">
            Wizyty
          </NavLink>
          <NavLink className={getNavLinkClass} to="/products">
            Produkty
          </NavLink>
          <NavLink className={getNavLinkClass} to="/services">
            Usługi
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
      </Routes>
    </div>
  );
}
