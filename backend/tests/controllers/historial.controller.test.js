// tests/controllers/historial.controller.test.js
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { getHistorialGeneral, descargarHistorial } from "../../src/controllers/historial.controller.js";
import Finanza from "../../src/models/finanzas.model.js";
import Meta from "../../src/models/metas.model.js";

// Mocks de dependencias externas
jest.mock("exceljs", () => ({
  Workbook: jest.fn().mockImplementation(() => ({
    addWorksheet: jest.fn().mockReturnValue({
      columns: [],
      addRow: jest.fn(),
    }),
    xlsx: {
      writeBuffer: jest.fn().mockResolvedValue(Buffer.from("EXCEL_DATA")),
    },
  })),
}));

jest.mock("pdf-lib", () => ({
  PDFDocument: {
    create: jest.fn().mockResolvedValue({
      addPage: jest.fn().mockReturnValue({
        getWidth: () => 600,
        getHeight: () => 800,
        drawText: jest.fn(),
        drawLine: jest.fn(),
      }),
      getPages: jest.fn().mockReturnValue([
        { getWidth: () => 600, getHeight: () => 800, drawText: jest.fn() },
      ]),
      embedFont: jest.fn().mockResolvedValue({}),
      save: jest.fn().mockResolvedValue(new Uint8Array([37, 80, 68, 70])), // pdf-lib devuelve Uint8Array
    }),
  },
  StandardFonts: { Helvetica: "Helvetica", HelveticaBold: "HelveticaBold" },
  rgb: () => ({ r: 0, g: 0, b: 0 }),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

const mockUserId = new mongoose.Types.ObjectId();

describe("Historial - getHistorialGeneral", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe devolver historial sin filtros", async () => {
    const req = {
      user: { id: mockUserId.toString() },
      query: {},
    };

    const mockFin = [
      {
        _id: new mongoose.Types.ObjectId(),
        fecha: new Date("2024-01-10"),
        tipo: "Ingreso",
        descripcion: "Pago",
        valor: 500,
        user: mockUserId,
      },
    ];

    Finanza.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockFin),
    });

    const res = mockRes();
    await getHistorialGeneral(req, res);

    expect(Finanza.find).toHaveBeenCalledWith({ user: mockUserId.toString() });
    expect(res.json).toHaveBeenCalledWith([
      {
        id: mockFin[0]._id.toString(),
        fecha: mockFin[0].fecha,
        tipo: "Finanza",
        accion: "Ingreso",
        descripcion: "Pago",
        monto: 500,
      },
    ]);
  });

  test("Debe filtrar por fecha de inicio", async () => {
    const req = {
      user: { id: mockUserId.toString() },
      query: { fechaInicio: "2024-01-01" },
    };

    Finanza.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    const res = mockRes();
    await getHistorialGeneral(req, res);

    expect(Finanza.find).toHaveBeenCalledWith(
      expect.objectContaining({
        user: mockUserId.toString(),
        fecha: expect.objectContaining({ $gte: new Date("2024-01-01") }),
      })
    );
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test("Debe manejar errores internos", async () => {
    const req = { user: { id: mockUserId.toString() }, query: {} };

    Finanza.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("DB ERROR")),
    });

    const res = mockRes();
    await getHistorialGeneral(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error interno del servidor",
    });
  });
});

describe("Historial - descargarHistorial", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Debe generar PDF correctamente", async () => {
    const req = {
      user: { id: mockUserId.toString() },
      query: { formato: "pdf" },
    };

    const mockFin = [
      {
        _id: new mongoose.Types.ObjectId(),
        fecha: new Date("2024-01-02"),
        tipo: "Ingreso",
        descripcion: "Pago",
        valor: 100,
        user: mockUserId,
      },
    ];

    Finanza.find = jest.fn().mockResolvedValue(mockFin);
    Meta.find = jest.fn().mockResolvedValue([]);

    const res = mockRes();
    await descargarHistorial(req, res);

    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
    expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=historial.pdf");
    expect(res.send).toHaveBeenCalledWith(expect.any(Uint8Array));
  });

  test("Debe generar Excel correctamente", async () => {
    const req = {
      user: { id: mockUserId.toString() },
      query: { formato: "excel" },
    };

    Finanza.find = jest.fn().mockResolvedValue([
      {
        _id: new mongoose.Types.ObjectId(),
        fecha: new Date(),
        tipo: "Ingreso",
        descripcion: "Pago",
        valor: 100,
        user: mockUserId,
      },
    ]);
    Meta.find = jest.fn().mockResolvedValue([]);

    const res = mockRes();
    await descargarHistorial(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    expect(res.setHeader).toHaveBeenCalledWith("Content-Disposition", "attachment; filename=historial.xlsx");
    expect(res.send).toHaveBeenCalledWith(expect.any(Buffer));
  });

  test("Debe devolver error si el formato es inválido", async () => {
    const req = {
      user: { id: mockUserId.toString() },
      query: { formato: "txt" },
    };

    const res = mockRes();
    await descargarHistorial(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Formato inválido" });
  });

  test("Debe manejar errores internos", async () => {
    const req = {
      user: { id: mockUserId.toString() },
      query: { formato: "pdf" },
    };
    Finanza.find = jest.fn().mockRejectedValue(new Error("DB ERROR"));

    const res = mockRes();
    await descargarHistorial(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error interno del servidor",
    });
  });
});