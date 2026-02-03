export default class AppointmentsApi {
  constructor(client) {
    this.client = client;
  }

  getAll() {
    return this.client.get('/api/appointments');
  }

  getById(id) {
    return this.client.get(`/api/appointments/${id}`);
  }

  create(payload) {
    return this.client.post('/api/appointments', payload);
  }
}
