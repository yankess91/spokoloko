import { useEffect, useMemo, useState } from 'react';
import AppointmentCalendar from './components/AppointmentCalendar';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import HeroSection from './components/HeroSection';
import ProductList from './components/ProductList';
import ServiceList from './components/ServiceList';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const formatDuration = (value) => {
  if (!value) {
    return 'Brak danych';
  }

  if (value.startsWith('PT')) {
    const hours = Number(value.match(/(\d+)H/)?.[1] ?? 0);
    const minutes = Number(value.match(/(\d+)M/)?.[1] ?? 0);
    const parts = [];
    if (hours) {
      parts.push(`${hours}h`);
    }
    if (minutes) {
      parts.push(`${minutes}min`);
    }
    return parts.length ? parts.join(' ') : '0min';
  }

  if (value.includes(':')) {
    const [hours, minutes] = value.split(':');
    const hourValue = Number(hours);
    const minuteValue = Number(minutes);
    const parts = [];
    if (!Number.isNaN(hourValue) && hourValue > 0) {
      parts.push(`${hourValue}h`);
    }
    if (!Number.isNaN(minuteValue) && minuteValue > 0) {
      parts.push(`${minuteValue}min`);
    }
    return parts.length ? parts.join(' ') : value;
  }

  return value;
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit'
  });

const fetchJson = async (path) => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać danych: ${response.status}`);
  }
  return response.json();
};

export default function App() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        const [clientsResponse, productsResponse, servicesResponse, appointmentsResponse] =
          await Promise.all([
            fetchJson('/api/clients'),
            fetchJson('/api/products'),
            fetchJson('/api/services'),
            fetchJson('/api/appointments')
          ]);

        if (!isMounted) {
          return;
        }

        setClients(clientsResponse);
        setProducts(productsResponse);
        setServices(
          servicesResponse.map((service) => ({
            ...service,
            duration: formatDuration(service.duration)
          }))
        );
        setAppointments(appointmentsResponse);
        setError('');
      } catch (err) {
        if (isMounted) {
          setError(err.message ?? 'Nie udało się pobrać danych z API.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

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
      clientName: client?.fullName ?? 'Nieznana klientka',
      serviceName: service?.name ?? 'Nieznana usługa',
      date: formatDate(appointment.startAt),
      time: formatTime(appointment.startAt)
    };
  }, [appointments, clientsById, servicesById]);

  return (
    <div className="page">
      <HeroSection
        summary={{
          clients: clients.length,
          services: services.length,
          products: products.length
        }}
        upcomingAppointment={upcomingAppointment}
        isLoading={isLoading}
      />

      {error ? <p className="card error">{error}</p> : null}

      <section className="grid">
        <ClientForm />
        <ClientList clients={clients} isLoading={isLoading} />
        <ServiceList services={services} isLoading={isLoading} />
        <ProductList products={products} isLoading={isLoading} />
      </section>

      <AppointmentCalendar
        appointments={appointments}
        clientsById={clientsById}
        servicesById={servicesById}
        isLoading={isLoading}
      />
    </div>
  );
}
