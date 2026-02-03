export default class AuthApi {
  constructor(client) {
    this.client = client;
  }

  login(payload) {
    return this.client.post('/auth/login', payload);
  }

  register(payload) {
    return this.client.post('/auth/register', payload);
  }
}
