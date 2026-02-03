export default class ProductsApi {
  constructor(client) {
    this.client = client;
  }

  getAll() {
    return this.client.get('/api/products');
  }

  getById(id) {
    return this.client.get(`/api/products/${id}`);
  }

  create(payload) {
    return this.client.post('/api/products', payload);
  }
}
