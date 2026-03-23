export default class AppointmentsApi {
  constructor(client) {
    this.client = client;
  }

  getAll() {
    return this.client.get('/api/appointments');
  }

  getNearestUpcoming() {
    return this.client.get('/api/appointments/nearest-upcoming');
  }

  getById(id) {
    return this.client.get(`/api/appointments/${id}`);
  }

  create(payload) {
    return this.client.post('/api/appointments', payload);
  }

  update(id, payload) {
    return this.client.put(`/api/appointments/${id}`, payload);
  }

  delete(id) {
    return this.client.delete(`/api/appointments/${id}`);
  }
}
