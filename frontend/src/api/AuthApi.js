export default class AuthApi {
  constructor(client) {
    this.client = client;
  }

  login(payload) {
    return this.client.post('/api/auth/login', payload);
  }
}
