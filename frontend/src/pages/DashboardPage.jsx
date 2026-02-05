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
import { t } from '../utils/i18n';

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

  const previewClients = useMemo(() => clients.slice(0, 3), [clients]);
  const previewServices = useMemo(() => services.slice(0, 3), [services]);
  const previewProducts = useMemo(() => products.slice(0, 3), [products]);
  const previewAppointments = useMemo(() => appointments.slice(0, 4), [appointments]);

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
      clientName: client?.fullName ?? t('dashboard.unknownClient'),
      serviceName: service?.name ?? t('dashboard.unknownService'),
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
          <h2>{t('dashboard.summaryTitle')}</h2>
          <p className="muted">{t('dashboard.summarySubtitle')}</p>
        </div>
        <div className="grid metrics-grid">
          <article className="card metric-card">
            <span className="metric-label">{t('dashboard.activeClients')}</span>
            <span className="metric-value">{activeClientCount}</span>
            <p className="muted">{t('dashboard.activeClientsHint')}</p>
          </article>
          <article className="card metric-card">
            <span className="metric-label">{t('dashboard.servicesCount')}</span>
            <span className="metric-value">{services.length}</span>
            <p className="muted">{t('dashboard.servicesHint')}</p>
          </article>
          <article className="card metric-card">
            <span className="metric-label">{t('dashboard.productsCount')}</span>
            <span className="metric-value">{products.length}</span>
            <p className="muted">{t('dashboard.productsHint')}</p>
          </article>
          <article className="card metric-card">
            <span className="metric-label">{t('dashboard.nextAppointment')}</span>
            <span className="metric-value">
              {upcomingAppointment ? `${upcomingAppointment.date}` : t('dashboard.none')}
            </span>
            <p className="muted">
              {upcomingAppointment
                ? t('dashboard.nextAppointmentDetails', {
                    name: upcomingAppointment.clientName,
                    time: upcomingAppointment.time,
                  })
                : t('dashboard.nextAppointmentHint')}
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>{t('dashboard.operationsTitle')}</h2>
          <p className="muted">{t('dashboard.operationsSubtitle')}</p>
        </div>
        <div className="grid">
          <ClientList clients={previewClients} isLoading={isLoading} linkBase="/clients" />
          <article className="card">
            <header className="card-header">
              <h3>{t('dashboard.servicesPreview')}</h3>
            </header>
            <ServiceList services={previewServices} isLoading={isLoading} linkBase="/services" />
          </article>
          <article className="card">
            <header className="card-header">
              <h3>{t('dashboard.productsPreview')}</h3>
            </header>
            <ProductList products={previewProducts} isLoading={isLoading} linkBase="/products" />
          </article>
        </div>
      </section>

      <AppointmentCalendar
        appointments={previewAppointments}
        clientsById={clientsById}
        servicesById={servicesById}
        isLoading={isLoading}
        linkBase="/appointments"
      />
    </div>
  );
}
