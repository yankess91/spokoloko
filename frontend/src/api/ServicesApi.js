export default class ServicesApi {
  constructor(client) {
    this.client = client;
  }

  getAll() {
    return this.client.get('/api/services');
  }

  getById(id) {
    return this.client.get(`/api/services/${id}`);
  }

  create(payload) {
    return this.client.post('/api/services', payload);
  }
}
