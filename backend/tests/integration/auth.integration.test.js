// tests/integration/auth.integration.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { connectMongoMemory, disconnectMongoMemory } from '../setup/integration.setup.js';
import app from '../../src/app.js';
import request from 'supertest';
import User from '../../src/models/user.model.js';

const userData = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'secure123',
};

describe('Auth - Pruebas de integración', () => {
  let server;

  beforeAll(async () => {
    await connectMongoMemory();
    server = app.listen();
  });

  afterAll(async () => {
    await server.close();
    await disconnectMongoMemory();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /api/register - debe registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(userData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', userData.username);
  });

  test('POST /api/register - debe rechazar email duplicado', async () => {
    await request(app).post('/api/register').send(userData);
    const res = await request(app).post('/api/register').send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(["el correo ya esta en uso "]);
  });

  test('POST /api/login - debe iniciar sesión', async () => {
    await request(app).post('/api/register').send(userData);
    const res = await request(app)
      .post('/api/login')
      .send({
        username: userData.username,
        password: userData.password,
      });

    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('token=');
  });

  test('POST /api/login - debe rechazar contraseña incorrecta', async () => {
    await request(app).post('/api/register').send(userData);
    const res = await request(app)
      .post('/api/login')
      .send({
        username: userData.username,
        password: 'wrongpass',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Incorrect password" });
  });

  test('POST /api/logout - debe eliminar la cookie', async () => {
    await request(app).post('/api/register').send(userData);
    const loginRes = await request(app)
      .post('/api/login')
      .send({
        username: userData.username,
        password: userData.password,
      });

    const res = await request(app)
      .post('/api/logout')
      .set('Cookie', loginRes.headers['set-cookie']);

    expect(res.statusCode).toBe(200);
  });

  test('GET /api/profile - debe devolver perfil', async () => {
    await request(app).post('/api/register').send(userData);
    const loginRes = await request(app)
      .post('/api/login')
      .send({
        username: userData.username,
        password: userData.password,
      });

    const res = await request(app)
      .get('/api/profile')
      .set('Cookie', loginRes.headers['set-cookie']);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', userData.username);
  });

  test('GET /api/profile - debe rechazar sin autenticación', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "No token, authhorization denied" });
  });
  test('POST /api/register - debe rechazar campos faltantes', async () => {
    const res = await request(app).post('/api/register').send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/profile - debe rechazar token inválido', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Cookie', 'token=abc123invalid');
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("invalid token");
  });
  test('POST /api/register - debe rechazar contraseña corta', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'test', email: 't@test.com', password: '123' }); // <6 chars

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: ["Contrasena debe ser mayor a 6 caracteres"] });
  });

  test('POST /api/register - debe manejar error de base de datos', async () => {
    const spy = jest.spyOn(User, 'create').mockRejectedValue(new Error('DB Error'));
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'test', email: 't@test.com', password: '123456' });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBeDefined();
    spy.mockRestore();
  });
});