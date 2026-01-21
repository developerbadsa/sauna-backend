import request from 'supertest';

import { app, cleanupDb } from './testUtils';

beforeAll(async () => {
  await cleanupDb();
});

afterAll(async () => {
  await cleanupDb();
});

describe('Auth flow', () => {
  it('registers and logs in a user', async () => {
    const email = 'test-user@example.com';
    const password = 'Password123!';

    const register = await request(app).post('/api/auth/register').send({ email, password });
    expect(register.status).toBe(200);

    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    expect(login.body.data.tokens.accessToken).toBeDefined();
  });
});
