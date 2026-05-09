const User = require('../src/models/user.model');

describe('Auth routes', () => {
  const userData = { name: 'Jane Reader', email: 'jane@example.com', password: 'securepass' };

  test('signup creates a new user and returns a token', async () => {
    const response = await request.post('/api/auth/signup').send(userData);

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(userData.email);

    const saved = await User.findOne({ email: userData.email });
    expect(saved).not.toBeNull();
  });

  test('login returns a token for valid credentials', async () => {
    await request.post('/api/auth/signup').send(userData);
    const response = await request.post('/api/auth/login').send({ email: userData.email, password: userData.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(userData.email);
  });

  test('me returns authenticated user profile', async () => {
    const signup = await request.post('/api/auth/signup').send(userData);
    const token = signup.body.token;

    const response = await request.get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(userData.email);
  });

  test('me rejects missing token', async () => {
    const response = await request.get('/api/auth/me');
    expect(response.status).toBe(401);
  });

  test('me rejects invalid token', async () => {
    const response = await request.get('/api/auth/me').set('Authorization', 'Bearer invalid.token.value');
    expect(response.status).toBe(401);
  });
});
