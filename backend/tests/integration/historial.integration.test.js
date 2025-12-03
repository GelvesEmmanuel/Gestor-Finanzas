// tests/integration/historial.integration.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { connectMongoMemory, disconnectMongoMemory } from '../setup/integration.setup.js';
import app from '../../src/app.js';
import request from 'supertest';
import User from '../../src/models/user.model.js';
import Finanza from '../../src/models/finanzas.model.js';
import Meta from '../../src/models/metas.model.js';

describe('Historial - Pruebas de integración', () => {
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
    await Finanza.deleteMany({});
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

  // ✅ 1. Obtener historial (solo finanzas)
  test('GET /api/historial - debe retornar historial de finanzas sin filtros', async () => {
    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 100, descripcion: 'Ingreso', tipo: 'Ingreso' });

    const res = await request(app)
      .get('/api/historial')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);

    const finanza = res.body[0];
    expect(finanza.tipo).toBe('Finanza');
    expect(finanza.accion).toBe('Ingreso');
    expect(finanza.monto).toBe(100);
  });

  // ✅ 2. Filtrar historial por fechas
  test('GET /api/historial - debe filtrar por fechaInicio y fechaFin', async () => {
    const hoy = new Date().toISOString().split('T')[0];
    
    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 200, descripcion: 'Hoy', tipo: 'Gasto', fecha: hoy });

    const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 300, descripcion: 'Ayer', tipo: 'Ingreso', fecha: ayer });

    const res = await request(app)
      .get('/api/historial')
      .query({ fechaInicio: hoy, fechaFin: hoy })
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].descripcion).toBe('Hoy');
  });

  // ✅ 3. Descargar PDF
  test('GET /api/historial/download - debe generar PDF correctamente', async () => {
    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 100, descripcion: 'PDF Test', tipo: 'Ingreso' });

    const res = await request(app)
      .get('/api/historial/download')
      .query({ formato: 'pdf' })
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toContain('historial.pdf');
    expect(res.body).toBeInstanceOf(Uint8Array);
  });

// ✅ 4. Descargar Excel
test('GET /api/historial/download - debe generar Excel correctamente', async () => {
  await request(app)
    .post('/api/finanzas')
    .set('Cookie', cookie)
    .send({ valor: 200, descripcion: 'Excel Test', tipo: 'Gasto' });

  const res = await request(app)
    .get('/api/historial/download')
    .query({ formato: 'excel' })
    .set('Cookie', cookie);

  expect(res.statusCode).toBe(200);
  expect(res.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  expect(res.headers['content-disposition']).toContain('historial.xlsx');
  expect(res.body).not.toBeNull();
  expect(res.body).not.toBeUndefined();
});

  test('GET /api/historial/download - debe rechazar formato inválido', async () => {
    const res = await request(app)
      .get('/api/historial/download')
      .query({ formato: 'txt' })
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Formato inválido" });
  });

  test('GET /api/historial - debe rechazar sin autenticación', async () => {
    const res = await request(app).get('/api/historial');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "No token, authhorization denied" });
  });

  test('GET /api/historial/download - debe rechazar sin autenticación', async () => {
    const res = await request(app).get('/api/historial/download').query({ formato: 'pdf' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "No token, authhorization denied" });
  });
});