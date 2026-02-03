export default class ClientsApi {
  constructor(client) {
    this.client = client;
  }

  getAll() {
    return this.client.get('/api/clients');
  }

  getById(id) {
    return this.client.get(`/api/clients/${id}`);
  }

  create(payload) {
    return this.client.post('/api/clients', payload);
  }
}
