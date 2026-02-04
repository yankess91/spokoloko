import { useEffect, useMemo } from 'react';
import AppointmentCalendar from '../components/AppointmentCalendar';
import ClientList from '../components/ClientList';
import HeroSection from '../components/HeroSection';
import ProductList from '../components/ProductList';
import ServiceList from '../components/ServiceList';
import useAppointments from '../hooks/useAppointments';
import useClients from '../hooks/useClients';
import useProducts from '../hooks/useProducts';
import useServices from '../hooks/useServices';
import { formatDate, formatTime } from '../utils/formatters';
import { useToast } from '../components/ToastProvider';

export default function DashboardPage() {
  const { clients, isLoading: clientsLoading, error: clientsError } = useClients();
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } =
    useAppointments();
  const { showToast } = useToast();

  const isLoading =
    clientsLoading || productsLoading || servicesLoading || appointmentsLoading;

  const error = clientsError || productsError || servicesError || appointmentsError;

  useEffect(() => {
    if (error) {
      showToast(error, { severity: 'error' });
    }
  }, [error, showToast]);

  const clientsById = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients]
  );

  const servicesById = useMemo(
    () => new Map(services.map((service) => [service.id, service])),
    [services]
  );

  const activeClientCount = useMemo(
    () => clients.filter((client) => client.isActive).length,
    [clients]
  );

  const upcomingAppointment = useMemo(() => {
    if (appointments.length === 0) {
      return null;
    }

    const now = new Date();
    const sorted = [...appointments].sort(
      (a, b) => new Date(a.startAt) - new Date(b.startAt)
    );
    const appointment =
      sorted.find((item) => new Date(item.startAt) >= now) ?? sorted[0];

    const client = clientsById.get(appointment.clientId);
    const service = servicesById.get(appointment.serviceId);

    return {
      id: appointment.id,
      clientName: client?.fullName ?? 'Nieznana klientka',
      serviceName: service?.name ?? 'Nieznana usługa',
      date: formatDate(appointment.startAt),
      time: formatTime(appointment.startAt)
    };
  }, [appointments, clientsById, servicesById]);

  return (
    <div className="page-content">
      <HeroSection
        summary={{
          clients: clients.length,
          services: services.length,
          products: products.length
        }}
        upcomingAppointment={upcomingAppointment}
        isLoading={isLoading}
      />

      <section className="section">
        <div className="section-header">
          <h2>Podsumowanie panelu</h2>
          <p className="muted">
            Najważniejsze wskaźniki dla szybkiego przeglądu pracy salonu.
          </p>
        </div>
        <div className="grid metrics-grid">
          <article className="card metric-card">
            <span className="metric-label">Aktywne klientki</span>
            <span className="metric-value">{activeClientCount}</span>
            <p className="muted">Zaktualizuj dane, aby planować kolejne wizyty.</p>
          </article>
          <article className="card metric-card">
            <span className="metric-label">Usługi w ofercie</span>
            <span className="metric-value">{services.length}</span>
            <p className="muted">Sprawdzaj popularność pakietów i stylizacji.</p>
          </article>
          <article className="card metric-card">
            <span className="metric-label">Produkty na stanie</span>
            <span className="metric-value">{products.length}</span>
            <p className="muted">Uzupełniaj magazyn przed intensywnym tygodniem.</p>
          </article>
          <article className="card metric-card">
            <span className="metric-label">Najbliższa wizyta</span>
            <span className="metric-value">
              {upcomingAppointment ? `${upcomingAppointment.date}` : 'Brak'}
            </span>
            <p className="muted">
              {upcomingAppointment
                ? `${upcomingAppointment.clientName} · ${upcomingAppointment.time}`
                : 'Wypełnij kalendarz, aby rozpocząć planowanie.'}
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Operacje codzienne</h2>
          <p className="muted">Zarządzaj klientkami, usługami i produktami w jednym miejscu.</p>
        </div>
        <div className="grid">
          <ClientList clients={clients} isLoading={isLoading} linkBase="/clients" />
          <ServiceList services={services} isLoading={isLoading} linkBase="/services" />
          <ProductList products={products} isLoading={isLoading} linkBase="/products" />
        </div>
      </section>

      <AppointmentCalendar
        appointments={appointments}
        clientsById={clientsById}
        servicesById={servicesById}
        isLoading={isLoading}
        linkBase="/appointments"
      />
    </div>
  );
}
