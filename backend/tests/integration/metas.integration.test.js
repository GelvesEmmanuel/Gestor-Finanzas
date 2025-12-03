// tests/integration/metas.integration.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { connectMongoMemory, disconnectMongoMemory } from '../setup/integration.setup.js';
import app from '../../src/app.js';
import request from 'supertest';
import User from '../../src/models/user.model.js';
import Meta from '../../src/models/metas.model.js';

describe('Metas - Pruebas de integración', () => {
  let server;
  let cookie;
  let userId;

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
    await Meta.deleteMany({});

    const registerRes = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', email: 'test@test.com', password: '123456' });

    const loginRes = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: '123456' });

    cookie = loginRes.headers['set-cookie'];
    userId = registerRes.body.id;
  });

  const createMeta = async (cookie, metaData = {}) => {
    const defaultData = {
      titulo: 'Meta de prueba',
      descripcion: 'Descripción de prueba',
      valorObjetivo: 1000,
      valorAhorroActual: 0,
      ...metaData
    };
    
    const res = await request(app)
      .post('/api/metas')
      .set('Cookie', cookie)
      .send(defaultData);
    
    if (res.statusCode !== 200) {
      console.error('Error al crear meta:', res.body);
    }
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    return res.body;
  };

  test('POST /api/metas - debe crear una nueva meta', async () => {
    const metaData = {
      titulo: 'Viaje a Europa',
      descripcion: 'Ahorrar para pasajes',
      valorObjetivo: 2000,
    };

    const res = await request(app)
      .post('/api/metas')
      .set('Cookie', cookie)
      .send(metaData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('titulo', 'Viaje a Europa');
    expect(res.body).toHaveProperty('valorObjetivo', 2000);
    expect(res.body.user).toBeDefined();
  });

  test('GET /api/metas - debe retornar metas del usuario autenticado', async () => {
    await createMeta(cookie, { titulo: 'Auto', valorObjetivo: 10000 });

    const res = await request(app)
      .get('/api/metas')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].titulo).toBe('Auto');
  });

  test('GET /api/metas/:id - debe retornar una meta existente', async () => {
    const meta = await createMeta(cookie, { titulo: 'Estudios', valorObjetivo: 5000 });
    const metaId = meta._id;

    const res = await request(app)
      .get(`/api/metas/${metaId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(metaId);
    expect(res.body.titulo).toBe('Estudios');
  });

  test('GET /api/metas/:id - debe retornar 404 si no existe', async () => {
    const fakeId = '60d5ec49e6d8b123456789ab';
    const res = await request(app)
      .get(`/api/metas/${fakeId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Meta no encontrada" });
  });

  test('PUT /api/metas/:id - debe actualizar meta propia', async () => {
    const meta = await createMeta(cookie, { titulo: 'Vieja', valorObjetivo: 1000 });
    const metaId = meta._id;

    const res = await request(app)
      .put(`/api/metas/${metaId}`)
      .set('Cookie', cookie)
      .send({ titulo: 'Nueva', valorObjetivo: 2000 });

    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Nueva');
    expect(res.body.valorObjetivo).toBe(2000);
  });

  test('PUT /api/metas/:id - debe rechazar actualizar meta de otro usuario', async () => {
    await request(app)
      .post('/api/register')
      .send({ username: 'otheruser', email: 'other@test.com', password: '123456' });

    const otherLogin = await request(app)
      .post('/api/login')
      .send({ username: 'otheruser', password: '123456' });

    const otherCookie = otherLogin.headers['set-cookie'];
    const meta = await createMeta(otherCookie, { titulo: 'Meta ajena', valorObjetivo: 999 });
    const metaId = meta._id;

    const res = await request(app)
      .put(`/api/metas/${metaId}`)
      .set('Cookie', cookie)
      .send({ titulo: 'Hackeada' });

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ message: "No tienes permiso para actualizar esta meta" });
  });

  test('DELETE /api/metas/:id - debe eliminar meta propia', async () => {
    const meta = await createMeta(cookie, { titulo: 'A borrar', valorObjetivo: 500 });
    const metaId = meta._id;

    const res = await request(app)
      .delete(`/api/metas/${metaId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});

    const getRes = await request(app)
      .get(`/api/metas/${metaId}`)
      .set('Cookie', cookie);

    expect(getRes.statusCode).toBe(404);
  });

  test('DELETE /api/metas/:id - debe rechazar eliminar meta de otro usuario', async () => {
    await request(app)
      .post('/api/register')
      .send({ username: 'other2', email: 'other2@test.com', password: '123456' });

    const otherLogin = await request(app)
      .post('/api/login')
      .send({ username: 'other2', password: '123456' });

    const otherCookie = otherLogin.headers['set-cookie'];
    const meta = await createMeta(otherCookie, { titulo: 'Protegida', valorObjetivo: 1 });
    const metaId = meta._id;

    const res = await request(app)
      .delete(`/api/metas/${metaId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ message: "No tienes permiso para eliminar esta meta" });
  });
});