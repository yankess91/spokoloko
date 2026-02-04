export default class ClientsApi {
  constructor(client) {
    this.client = client;
  }

  getAll() {
    return this.client.get('/api/clients');
  }

  search(searchTerm = '') {
    const query = searchTerm.trim();
    return this.client.get(`/api/clients${query ? `?search=${encodeURIComponent(query)}` : ''}`);
  }

  getById(id) {
    return this.client.get(`/api/clients/${id}`);
  }

  create(payload) {
    return this.client.post('/api/clients', payload);
  }

  updateStatus(id, payload) {
    return this.client.patch(`/api/clients/${id}/status`, payload);
  }
}
