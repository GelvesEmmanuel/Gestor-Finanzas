// tests/integration/finanzas.integration.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { connectMongoMemory, disconnectMongoMemory } from '../setup/integration.setup.js';
import app from '../../src/app.js';
import request from 'supertest';
import User from '../../src/models/user.model.js';
import Finanza from '../../src/models/finanzas.model.js';

describe('Finanzas - Pruebas de integración', () => {
  let server;
  let cookie;

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

    await request(app)
      .post('/api/register')
      .send({ username: 'testuser', email: 'test@test.com', password: '123456' });

    const loginRes = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: '123456' });

    cookie = loginRes.headers['set-cookie'];
  });

  test('POST /api/finanzas - debe crear una finanza válida', async () => {
    const finanzaData = {
      valor: 100,
      descripcion: 'Venta',
      tipo: 'Ingreso',
    };

    const res = await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send(finanzaData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('valor', 100);
    expect(res.body).toHaveProperty('tipo', 'Ingreso');
    expect(res.body.user).toBeDefined();
  });

  test('POST /api/finanzas - debe rechazar tipo inválido', async () => {
    const res = await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({
        valor: 50,
        descripcion: 'Compra',
        tipo: 'Otro', 
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "El tipo debe ser gasto o Ingreso" });
  });

  test('GET /api/finanzas - debe retornar finanzas del usuario autenticado', async () => {
    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 200, descripcion: 'Pago', tipo: 'Ingreso' });

    const res = await request(app)
      .get('/api/finanzas')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].valor).toBe(200);
  });

  test('GET /api/finanzas/:id - debe retornar una finanza existente', async () => {
    const createRes = await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 300, descripcion: 'Inversión', tipo: 'Gasto' });

    const finanzaId = createRes.body._id;

    const res = await request(app)
      .get(`/api/finanzas/${finanzaId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(finanzaId);
    expect(res.body.valor).toBe(300);
  });

  test('GET /api/finanzas/:id - debe retornar 404 si no existe', async () => {
    const fakeId = '60d5ec49e6d8b123456789ab';

    const res = await request(app)
      .get(`/api/finanzas/${fakeId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "tarea no encontrada" });
  });

  test('PUT /api/finanzas/:id - debe actualizar una finanza', async () => {
    const createRes = await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 400, descripcion: 'Inicial', tipo: 'Ingreso' });

    const finanzaId = createRes.body._id;

    const res = await request(app)
      .put(`/api/finanzas/${finanzaId}`)
      .set('Cookie', cookie)
      .send({ valor: 500, descripcion: 'Actualizada' });

    expect(res.statusCode).toBe(200);
    expect(res.body.valor).toBe(500);
    expect(res.body.descripcion).toBe('Actualizada');
  });

  test('DELETE /api/finanzas/:id - debe eliminar y retornar 204', async () => {
    const createRes = await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 600, descripcion: 'A borrar', tipo: 'Gasto' });

    const finanzaId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/finanzas/${finanzaId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({}); 
  });

  test('GET /api/finanzasBalance - debe calcular balance correctamente', async () => {
    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 1000, descripcion: 'Salario', tipo: 'Ingreso' });

    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 300, descripcion: 'Renta', tipo: 'Gasto' });

    const res = await request(app)
      .get('/api/finanzasBalance')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ingresos', 1000);
    expect(res.body).toHaveProperty('gastos', 300);
    expect(res.body).toHaveProperty('balance', 700);
  });

  test('POST /api/finanzasPeriodo - debe filtrar por fechas', async () => {
    const hoy = new Date().toISOString().split('T')[0];

    await request(app)
      .post('/api/finanzas')
      .set('Cookie', cookie)
      .send({ valor: 200, descripcion: 'Hoy', tipo: 'Ingreso', fecha: hoy });

    const res = await request(app)
      .post('/api/finanzasPeriodo')
      .set('Cookie', cookie)
      .send({ fechaInicio: hoy, fechaFin: hoy });

    expect(res.statusCode).toBe(200);
    expect(res.body.registros.length).toBe(1);
    expect(res.body.ingresosPeriodo).toBe(200);
  });
  test('POST /api/finanzasPeriodo - debe rechazar sin fechas', async () => {
    const res = await request(app)
      .post('/api/finanzasPeriodo')
      .set('Cookie', cookie)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "valores incorrectos" });
  });
});