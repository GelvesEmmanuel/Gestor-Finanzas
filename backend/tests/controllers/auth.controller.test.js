import { jest } from "@jest/globals";

// MOCK MODULES (ANTES DE IMPORTAR CONTROLADOR)
jest.unstable_mockModule("../../src/models/user.model.js", () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule("../../src/libs/jwt.js", () => ({
  createdAccesToken: jest.fn(),
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn().mockImplementation((token, secret) => {
      if (token === "valid-token-for-testing") {
        return { id: "user-id-123" };
      }
      throw new Error("Invalid token");
    }),
  },
}));

const User = (await import("../../src/models/user.model.js")).default;
const bcrypt = (await import("bcryptjs")).default;
const jwt = (await import("jsonwebtoken")).default;
const { createdAccesToken } = await import("../../src/libs/jwt.js");

const { register, login, logout, profile, verifyToken } = await import(
  "../../src/controllers/auth.controller.js"
);

// MOCK RESPONSE
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn((name, value, options) => res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

// TESTS
describe("AuthController - register", () => {
  test("Debe devolver un 400 si el usuario ya existe", async () => {
    const req = { body: { email: "test@test.com", password: "123456", username: "test" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ email: "test@test.com" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(["el correo ya esta en uso "]);
  });

  test("Debe registrar usuario nuevo", async () => {
    const req = { body: { email: "new@test.com", password: "123456", username: "new" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedpassword");
    User.create.mockResolvedValue({
      _id: "123",
      username: "new",
      email: "new@test.com",
      createdAt: "today",
      updatedAt: "today",
    });

    await register(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: "123",
      username: "new",
      email: "new@test.com",
      createdAt: "today",
      updatedAt: "today",
    });
  });

  test("Debe manejar error inesperado en register", async () => {
    const req = { body: { email: "test@test.com", password: "123456", username: "test" } };
    const res = mockResponse();

    User.findOne.mockRejectedValue(new Error("DB Error"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});

// LOGIN
describe("AuthController - login", () => {
  test("Debe retornar 400 si el usuario no existe", async () => {
    const req = { body: { username: "wrong", password: "123456" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("Debe retornar 400 si la contraseña es incorrecta", async () => {
    const req = { body: { username: "test", password: "wrongpass" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({ username: "test", password: "hashedpass" });
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Incorrect password" });
  });

  test("Debe loguear correctamente", async () => {
    const req = { body: { username: "test", password: "123456" } };
    const res = mockResponse();

    User.findOne.mockResolvedValue({
      _id: "abc123",
      username: "test",
      email: "test@test.com",
      password: "hashedpass",
    });

    bcrypt.compare.mockResolvedValue(true);
    createdAccesToken.mockResolvedValue("fake-token");

    await login(req, res);

    expect(res.cookie).toHaveBeenCalledWith("token", "fake-token", expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({
      id: "abc123",
      username: "test",
      email: "test@test.com",
      createdAt: undefined,
      updatedAt: undefined,
    });
  });

  test("Debe manejar error inesperado en login", async () => {
    const req = { body: { username: "test", password: "123456" } };
    const res = mockResponse();

    User.findOne.mockRejectedValue(new Error("DB Error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});

// LOGOUT
describe("AuthController - logout", () => {
  test("Debe limpiar cookie del usuario una vez cierre sesión", () => {
    const res = mockResponse();

    logout({}, res);

    expect(res.cookie).toHaveBeenCalledWith("token", "", expect.any(Object));
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });
});

describe("AuthController - profile", () => {
  test("Debe retornar 400 si usuario no existe", async () => {
    const req = { user: { id: "123" } };
    const res = mockResponse();

    User.findById.mockResolvedValue(null);

    await profile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "user not found" });
  });

  test("Debe retornar perfil", async () => {
    const req = { user: { id: "123" } };
    const res = mockResponse();

    User.findById.mockResolvedValue({
      _id: "123",
      username: "user",
      email: "user@test.com",
      createdAt: "today",
      updatedAt: "today",
    });

    await profile(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: "123",
      username: "user",
      email: "user@test.com",
      createdAt: "today",
      updatedAt: "today",
    });
  });

  test("Debe manejar error inesperado en profile", async () => {
    const req = { user: { id: "123" } };
    const res = mockResponse();

    User.findById.mockRejectedValue(new Error("DB Error"));

    await profile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});

describe("AuthController - verifyToken", () => {
  test("Debe retornar 400 si no hay token activo para el usuario", async () => {
    const res = mockResponse();
    await verifyToken({ cookies: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No esta autorizado" });
  });

  test("Debe retornar 401 si token inválido", async () => {
    const req = { cookies: { token: "invalid-token" } };
    const res = mockResponse();
    await verifyToken(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No esta autorizado" });
  });

  test("Debe validar token y retornar usuario", async () => {
    const req = { cookies: { token: "valid-token-for-testing" } };
    const res = mockResponse();

    User.findById.mockResolvedValue({
      _id: "user-id-123",
      username: "test",
      email: "test@test.com",
    });

    await verifyToken(req, res);

    expect(res.json).toHaveBeenCalledWith({
      id: "user-id-123",
      username: "test",
      email: "test@test.com",
    });
  });

  test("Debe manejar error inesperado en verifyToken", async () => {
    const req = { cookies: { token: "valid-token-for-testing" } };
    const res = mockResponse();

    User.findById.mockRejectedValue(new Error("DB Error"));

    await verifyToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No esta autorizado" });
  });
  test("Debe manejar error inesperado en register", async () => {
    const req = { body: { email: "test@test.com", password: "123456", username: "test" } };
    const res = mockResponse();

    User.findOne.mockRejectedValue(new Error("DB Error"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });

  test("Debe manejar error inesperado en login", async () => {
    const req = { body: { username: "test", password: "123456" } };
    const res = mockResponse();

    User.findOne.mockRejectedValue(new Error("DB Error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });

  test("Debe manejar error inesperado en profile", async () => {
    const req = { user: { id: "123" } };
    const res = mockResponse();

    User.findById.mockRejectedValue(new Error("DB Error"));

    await profile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB Error" });
  });
});