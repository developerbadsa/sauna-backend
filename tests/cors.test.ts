import request from 'supertest';

const createAppWithCorsOrigin = async (corsOrigin: string) => {
  process.env.CORS_ORIGIN = corsOrigin;
  jest.resetModules();
  const { createApp } = await import('../src/app');
  return createApp();
};

describe('CORS', () => {
  it('allows configured origins even when config includes trailing slash', async () => {
    const app = await createAppWithCorsOrigin('http://localhost:3000/');

    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:3000');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('allows wildcard origin patterns', async () => {
    const app = await createAppWithCorsOrigin('https://*.vercel.app');

    const response = await request(app)
      .get('/health')
      .set('Origin', 'https://happy-sauna.vercel.app');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://happy-sauna.vercel.app');
  });
});
