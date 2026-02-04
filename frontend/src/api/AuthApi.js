export default class AuthApi {
  constructor(client) {
    this.client = client;
  }

  login(payload) {
    return this.client.post('/api/auth/login', payload);
  }

  register(payload) {
    return this.client.post('/api/auth/register', payload);
  }
}
