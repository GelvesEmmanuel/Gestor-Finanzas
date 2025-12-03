import { jest } from "@jest/globals";

// MOCK COMPLETO DEL MODELO FINANZA
let FinanzaConstructorMock = { save: jest.fn() };

jest.unstable_mockModule("../../src/models/finanzas.model.js", () => {
  return {
    default: Object.assign(
      function () {
        return FinanzaConstructorMock;
      },
      {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        create: jest.fn(),
      }
    ),
  };
});

const Finanza = (await import("../../src/models/finanzas.model.js")).default;

// Controlador
const {
  getFinanzas,
  createFinanzas,
  getFinanza,
  updateFinanzas,
  deleteFinanzas,
  getBalance,
  getFinanzasPeriodo,
} = await import("../../src/controllers/finanzas.controller.js");

// MOCK RESPONSE
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  FinanzaConstructorMock = { save: jest.fn() };
});

// TESTS: GET FINANZAS
describe("FinanzasController - getFinanzas", () => {
  test("Debe retornar lista de finanzas del usuario", async () => {
    const req = { user: { id: "user123" } };
    const res = mockResponse();

    Finanza.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        { valor: 100, tipo: "Ingreso" },
        { valor: 50, tipo: "Gasto" },
      ]),
    });

    await getFinanzas(req, res);

    expect(Finanza.find).toHaveBeenCalledWith({ user: "user123" });
    expect(res.json).toHaveBeenCalledWith([
      { valor: 100, tipo: "Ingreso" },
      { valor: 50, tipo: "Gasto" },
    ]);
  });
});

// TESTS: CREATE FINANZAS
describe("FinanzasController - createFinanzas", () => {
  test("Debe retornar 400 si tipo no es válido", async () => {
    const req = {
      body: { valor: 100, descripcion: "test", tipo: "Otro" },
      user: { id: "user123" },
    };
    const res = mockResponse();

    await createFinanzas(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El tipo debe ser gasto o Ingreso",
    });
  });

  test("Debe guardar una nueva finanza", async () => {
    const req = {
      body: {
        valor: 200,
        descripcion: "Venta",
        tipo: "Ingreso",
        fecha: "2025-01-01",
      },
      user: { id: "user123" },
    };
    const res = mockResponse();

    FinanzaConstructorMock.save.mockResolvedValue({
      _id: "abc123",
      valor: 200,
      descripcion: "Venta",
      tipo: "Ingreso",
      fecha: "2025-01-01",
    });

    await createFinanzas(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: "abc123",
      valor: 200,
      descripcion: "Venta",
      tipo: "Ingreso",
      fecha: "2025-01-01",
    });
  });
});

// TESTS: GET FINANZA
describe("FinanzasController - getFinanza", () => {
  test("Debe retornar 404 si no existe", async () => {
    const req = { params: { id: "id123" } };
    const res = mockResponse();

    Finanza.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await getFinanza(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "tarea no encontrada",
    });
  });

  test("Debe retornar una finanza", async () => {
    const req = { params: { id: "id123" } };
    const res = mockResponse();

    Finanza.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({ _id: "id123", valor: 100 }),
    });

    await getFinanza(req, res);

    expect(res.json).toHaveBeenCalledWith({ _id: "id123", valor: 100 });
  });
});

// TESTS: UPDATE FINANZAS
describe("FinanzasController - updateFinanzas", () => {
  test("Debe retornar 404 si no existe", async () => {
    const req = { params: { id: "1" }, body: {} };
    const res = mockResponse();

    Finanza.findByIdAndUpdate.mockResolvedValue(null);

    await updateFinanzas(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "tarea no encontrada",
    });
  });

  test("Debe actualizar finanza", async () => {
    const req = { params: { id: "1" }, body: { valor: 500 } };
    const res = mockResponse();

    Finanza.findByIdAndUpdate.mockResolvedValue({
      _id: "1",
      valor: 500,
    });

    await updateFinanzas(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: "1",
      valor: 500,
    });
  });
});

// TESTS: DELETE FINANZAS
describe("FinanzasController - deleteFinanzas", () => {
  test("Debe retornar 404 si no existe", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    Finanza.findByIdAndDelete.mockResolvedValue(null);

    await deleteFinanzas(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "tarea no encontrada",
    });
  });

  test("Debe eliminar y retornar 204", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    Finanza.findByIdAndDelete.mockResolvedValue({ _id: "1" });

    await deleteFinanzas(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});

// TESTS: GET BALANCE
describe("FinanzasController - getBalance", () => {
  test("Debe calcular ingresos, gastos y balance correctamente", async () => {
    const req = { user: { id: "user123" } };
    const res = mockResponse();

    Finanza.find.mockResolvedValue([
      { tipo: "Ingreso", valor: 100 },
      { tipo: "Ingreso", valor: 200 },
      { tipo: "Gasto", valor: 50 },
    ]);

    await getBalance(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ingresos: 300,
      gastos: 50,
      balance: 250,
    });
  });
});

// TESTS: GET FINANZAS PERIODO
describe("FinanzasController - getFinanzasPeriodo", () => {
  test("Debe retornar 400 si faltan fechas", async () => {
    const req = { body: {} };
    const res = mockResponse();

    await getFinanzasPeriodo(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "valores incorrectos" });
  });

  test("Debe calcular resumen de periodo", async () => {
    const req = {
      user: { id: "user123" },
      body: {
        fechaInicio: "2025-01-01",
        fechaFin: "2025-01-31",
      },
    };
    const res = mockResponse();

    Finanza.find.mockResolvedValue([
      { tipo: "Ingreso", valor: 100 },
      { tipo: "Gasto", valor: 40 },
    ]);

    await getFinanzasPeriodo(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ingresosPeriodo: 100,
      gastosPeriodo: 40,
      balancePeriodo: 60,
      registros: [
        { tipo: "Ingreso", valor: 100 },
        { tipo: "Gasto", valor: 40 },
      ],
    });
  });
});
