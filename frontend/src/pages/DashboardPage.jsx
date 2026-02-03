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

      <section className="grid">
        <ClientList clients={clients} isLoading={isLoading} linkBase="/clients" />
        <ServiceList services={services} isLoading={isLoading} linkBase="/services" />
        <ProductList products={products} isLoading={isLoading} linkBase="/products" />
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
