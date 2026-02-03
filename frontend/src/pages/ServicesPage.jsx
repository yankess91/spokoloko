import ServiceList from '../components/ServiceList';
import useServices from '../hooks/useServices';

export default function ServicesPage() {
  const { services, isLoading, error } = useServices();

  return (
    <div className="page-content">
      <header className="section-header">
        <h1>Usługi</h1>
        <p className="muted">Lista usług oferowanych w salonie.</p>
      </header>

      {error ? <p className="card error">{error}</p> : null}

      <section className="grid">
        <ServiceList services={services} isLoading={isLoading} linkBase="/services" />
      </section>
    </div>
  );
}
