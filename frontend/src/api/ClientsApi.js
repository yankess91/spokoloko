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

  getOrders(id) {
    return this.client.get(`/api/clients/${id}/orders`);
  }

  create(payload) {
    return this.client.post('/api/clients', payload);
  }

  update(id, payload) {
    return this.client.put(`/api/clients/${id}`, payload);
  }

  updateStatus(id, payload) {
    return this.client.patch(`/api/clients/${id}/status`, payload);
  }

  delete(id) {
    return this.updateStatus(id, { isActive: false });
  }
}
