import { useEffect, useMemo } from 'react';
import AppointmentCalendar from '../components/AppointmentCalendar';
import ClientList from '../components/ClientList';
import HeroSection from '../components/HeroSection';
import ProductList from '../components/ProductList';
import ServiceList from '../components/ServiceList';
import useAppointments from '../hooks/useAppointments';
import useNearestUpcomingAppointment from '../hooks/useNearestUpcomingAppointment';
import useNextDayRevenueEstimate from '../hooks/useNextDayRevenueEstimate';
import useClients from '../hooks/useClients';
import useProducts from '../hooks/useProducts';
import useServices from '../hooks/useServices';
import { formatCurrencyRange, formatDate, formatTime } from '../utils/formatters';
import { useToast } from '../components/ToastProvider';
import { t } from '../utils/i18n';

export default function DashboardPage() {
  const { clients, isLoading: clientsLoading, error: clientsError } = useClients();
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError } =
    useAppointments();
  const {
    appointment: nearestUpcomingAppointment,
    isLoading: nearestUpcomingAppointmentLoading,
    error: nearestUpcomingAppointmentError
  } = useNearestUpcomingAppointment();
  const {
    estimate: nextDayRevenueEstimate,
    isLoading: nextDayRevenueEstimateLoading,
    error: nextDayRevenueEstimateError
  } = useNextDayRevenueEstimate();
  const { showToast } = useToast();

  const isLoading =
    clientsLoading ||
    productsLoading ||
    servicesLoading ||
    appointmentsLoading ||
    nearestUpcomingAppointmentLoading ||
    nextDayRevenueEstimateLoading;

  const error =
    clientsError ||
    productsError ||
    servicesError ||
    appointmentsError ||
    nearestUpcomingAppointmentError ||
    nextDayRevenueEstimateError;

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

  const activeClients = useMemo(
    () => clients.filter((client) => client.isActive),
    [clients]
  );

  const now = useMemo(() => new Date(), []);

  const upcomingAppointments = useMemo(
    () => appointments
      .filter((appointment) => new Date(appointment.startAt) >= now)
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)),
    [appointments, now]
  );

  const previewClients = useMemo(() => activeClients.slice(0, 3), [activeClients]);
  const previewServices = useMemo(() => services.slice(0, 3), [services]);
  const previewProducts = useMemo(() => products.slice(0, 3), [products]);
  const previewAppointments = useMemo(() => upcomingAppointments.slice(0, 4), [upcomingAppointments]);

  const upcomingAppointment = useMemo(() => {
    if (!nearestUpcomingAppointment) {
      return null;
    }

    const client = clientsById.get(nearestUpcomingAppointment.clientId);
    const service = servicesById.get(nearestUpcomingAppointment.serviceId);

    return {
      id: nearestUpcomingAppointment.id,
      clientName: client?.fullName ?? t('dashboard.unknownClient'),
      serviceName: service?.name ?? t('dashboard.unknownService'),
      date: formatDate(nearestUpcomingAppointment.startAt),
      time: formatTime(nearestUpcomingAppointment.startAt)
    };
  }, [nearestUpcomingAppointment, clientsById, servicesById]);

  const formattedNextDayRevenueEstimate = useMemo(() => {
    if (!nextDayRevenueEstimate) {
      return t('hero.loading');
    }

    const amount = formatCurrencyRange(
      nextDayRevenueEstimate.amountFrom,
      nextDayRevenueEstimate.amountTo
    );

    return t('hero.nextDayRevenueValue', {
      amount,
      appointmentsCount: nextDayRevenueEstimate.appointmentsCount
    });
  }, [nextDayRevenueEstimate]);

  return (
    <div className="page-content">
      <HeroSection
        summary={{
          clients: clients.length,
          services: services.length,
          products: products.length
        }}
        upcomingAppointment={upcomingAppointment}
        nextDayRevenueEstimate={formattedNextDayRevenueEstimate}
        isLoading={isLoading}
      />

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
