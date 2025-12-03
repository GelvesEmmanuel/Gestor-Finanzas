import { jest } from "@jest/globals";
// MOCK DEL MODELO META (ÚNICO Y CORRECTO)
const staticMocks = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
};

let MetaConstructorMock = { save: jest.fn() };

jest.unstable_mockModule("../../src/models/metas.model.js", () => {
  function MetaMock() {
    return MetaConstructorMock;
  }
  return { default: Object.assign(MetaMock, staticMocks) };
});

const Meta = (await import("../../src/models/metas.model.js")).default;

// Controladores
const {
  getMetas,
  createMetas,
  getMeta,
  updateMeta,
  deleteMeta,
  actualizarAhorroMeta,
} = await import("../../src/controllers/metas.controller.js");

// MOCK DE RESPONSE
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  MetaConstructorMock = { save: jest.fn() };
});

// TESTS: obtener metas
describe("MetasController - getMetas", () => {
  test("Debe retornar lista de metas del usuario", async () => {
    const req = { user: { id: "user123" } };
    const res = mockResponse();

    Meta.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([
        { titulo: "Meta 1" },
        { titulo: "Meta 2" },
      ]),
    });

    await getMetas(req, res);

    expect(Meta.find).toHaveBeenCalledWith({ user: "user123" });
    expect(res.json).toHaveBeenCalledWith([
      { titulo: "Meta 1" },
      { titulo: "Meta 2" },
    ]);
  });

  test("Debe manejar error inesperado en getMetas", async () => {
    const req = { user: { id: "user123" } };
    const res = mockResponse();

    Meta.find.mockImplementation(() => {
      throw new Error("DB Error");
    });

    await getMetas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al obtener las metas",
      error: "DB Error"
    });
  });
});

// TESTS: crear metas
describe("MetasController - createMetas", () => {
  test("Debe crear una nueva meta", async () => {
    const req = {
      body: {
        titulo: "Meta 1",
        descripcion: "Descripción",
        valorObjetivo: 5000,
        fecha: "2025-01-01",
      },
      user: { id: "user123" },
    };

    const res = mockResponse();

    MetaConstructorMock.save.mockResolvedValue({
      _id: "abc123",
      ...req.body,
      user: "user123",
    });

    await createMetas(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: "abc123",
      ...req.body,
      user: "user123",
    });
  });

  test("Debe manejar error inesperado en createMetas", async () => {
    const req = {
      body: {
        titulo: "Meta 1",
        descripcion: "Descripción",
        valorObjetivo: 5000,
      },
      user: { id: "user123" },
    };
    const res = mockResponse();

    MetaConstructorMock.save.mockRejectedValue(new Error("DB Error"));

    await createMetas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al crear nueva meta",
      error: "DB Error"
    });
  });
});

// TESTS: obtener meta
describe("MetasController - getMeta", () => {
  test("Debe retornar 404 si no existe la meta", async () => {
    const req = { params: { id: "meta1" } };
    const res = mockResponse();

    Meta.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    await getMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Meta no encontrada" });
  });

  test("Debe retornar metas existentes", async () => {
    const req = { params: { id: "meta1" } };
    const res = mockResponse();

    Meta.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: "meta1",
        titulo: "Meta",
      }),
    });

    await getMeta(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: "meta1",
      titulo: "Meta",
    });
  });
  test("Debe manejar error inesperado en getMeta", async () => {
    const req = { params: { id: "meta1" } };
    const res = mockResponse();
    Meta.findById.mockImplementation(() => {
      throw new Error("DB Error");
    });
    await getMeta(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al obtener la meta",
      error: "DB Error"
    });
  });
});

// TESTS: actualizar meta
describe("MetasController - updateMeta", () => {
  test("Debe retornar 404 si no existe la meta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" }, body: {} };
    const res = mockResponse();

    Meta.findById.mockResolvedValue(null);

    await updateMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Meta no encontrada" });
  });

  test("Debe retornar 403 si no es propietario de la meta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" }, body: {} };
    const res = mockResponse();

    Meta.findById.mockResolvedValue({
      user: { _id: "otroUsuario" },
    });

    await updateMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "No tienes permiso para actualizar esta meta"
    });
  });

  test("Debe actualizar correctamente la meta", async () => {
    const req = {
      params: { id: "1" },
      user: { id: "user123" },
      body: { titulo: "Nuevo título" },
    };
    const res = mockResponse();

    Meta.findById.mockResolvedValue({
      user: { _id: "user123" },
    });

    Meta.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: "1",
        titulo: "Nuevo título",
      }),
    });

    await updateMeta(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: "1",
      titulo: "Nuevo título",
    });
  });

  test("Debe manejar error inesperado en updateMeta", async () => {
    const req = {
      params: { id: "1" },
      user: { id: "user123" },
      body: { titulo: "Nuevo título" },
    };
    const res = mockResponse();

    Meta.findById.mockRejectedValue(new Error("DB Error"));

    await updateMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al actualizar la meta",
      error: "DB Error"
    });
  });
});

// TESTS: eliminar meta
describe("MetasController - deleteMeta", () => {
  test("Debe retornar 404 si no existe la meta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" } };
    const res = mockResponse();

    Meta.findById.mockResolvedValue(null);

    await deleteMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Meta no encontrada" });
  });

  test("Debe retornar 403 si no es propietario de la meta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" } };
    const res = mockResponse();

    Meta.findById.mockResolvedValue({
      user: { _id: "otro" },
    });

    await deleteMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "No tienes permiso para eliminar esta meta"
    });
  });

  test("Debe eliminar exitosamente la meta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" } };
    const res = mockResponse();

    Meta.findById.mockResolvedValue({
      user: { _id: "user123" },
    });

    Meta.findByIdAndDelete.mockResolvedValue({});

    await deleteMeta(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
  test("Debe manejar error inesperado en deleteMeta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" } };
    const res = mockResponse();

    Meta.findById.mockRejectedValue(new Error("DB Error"));

    await deleteMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al eliminar la meta",
      error: "DB Error"
    });
  });
});

describe("MetasController - actualizarAhorroMeta", () => {
  test("Debe retornar 404 si no existe la meta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" }, body: {} };
    const res = mockResponse();

    Meta.findById.mockResolvedValue(null);

    await actualizarAhorroMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Meta no encontrada" });
  });

  test("Debe retornar 403 si no es propietario de la meta", async () => {
    const req = { params: { id: "1" }, user: { id: "user123" }, body: {} };
    const res = mockResponse();

    Meta.findById.mockResolvedValue({
      user: { _id: "otro" },
    });

    await actualizarAhorroMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "No tienes permiso para actualizar esta meta"
    });
  });

  test("Debe retornar 400 si el ahorro excede el objetivo", async () => {
    const req = {
      params: { id: "1" },
      user: { id: "user123" },
      body: { valorAhorro: 2000 },
    };
    const res = mockResponse();

    Meta.findById.mockResolvedValue({
      valorObjetivo: 1000,
      user: { _id: "user123" },
    });

    await actualizarAhorroMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "El ahorro no puede exceder el valor objetivo de la meta."
    });
  });

  test("Debe actualizar el ahorro correctamente", async () => {
    const req = {
      params: { id: "1" },
      user: { id: "user123" },
      body: { valorAhorro: 500 },
    };
    const res = mockResponse();

    Meta.findById.mockResolvedValue({
      valorObjetivo: 1000,
      user: { _id: "user123" },
    });

    Meta.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: "1",
        valorAhorroActual: 500,
      }),
    });

    await actualizarAhorroMeta(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: "1",
      valorAhorroActual: 500,
    });
  });
  test("Debe manejar error inesperado en actualizarAhorroMeta", async () => {
    const req = {
      params: { id: "1" },
      user: { id: "user123" },
      body: { valorAhorro: 500 },
    };
    const res = mockResponse();

    Meta.findById.mockRejectedValue(new Error("DB Error"));

    await actualizarAhorroMeta(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error al actualizar el ahorro de la meta",
      error: "DB Error"
    });
  });
});