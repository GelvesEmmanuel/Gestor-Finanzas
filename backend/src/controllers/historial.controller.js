// src/controllers/historial.controller.js

import Finanza from "../models/finanzas.model.js";
import Meta from "../models/metas.model.js";
import ExcelJS from "exceljs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// OBTENER HISTORIAL (CON FILTRO)
export const getHistorialGeneral = async (req, res) => {
  const userId = req.user.id;
 
  try {
    const { fechaInicio, fechaFin } = req.query;

    let filtroFinanza = { user: userId };
    

    if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      filtroFinanza.fecha = { ...filtroFinanza.fecha, $gte: inicio };
      
    }

    if (fechaFin) {
      const fin = new Date(fechaFin + "T23:59:59");
      filtroFinanza.fecha = { ...filtroFinanza.fecha, $lte: fin };
      
    }

    // Consultas filtradas
    const finanzas = await Finanza.find(filtroFinanza).sort({ createdAt: -1 });
    

    const historial = [
      ...finanzas.map(f => ({
        id: f._id.toString(),
        fecha: f.fecha || f.createdAt,
        tipo: "Finanza",
        accion: f.tipo,
        descripcion: f.descripcion,
        monto: f.valor
      }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json(historial);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GENERADOR DE PDF CON BORDES
const generarPDF = async (historial) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([600, 800]);

  const margin = 40;
  const rowHeight = 25;
  const pageWidth = page.getWidth();
  const startY = page.getHeight() - margin - 70;

  const columns = [
    { header: "Fecha", width: 90 },
    { header: "Tipo", width: 80 },
    { header: "Acción", width: 130 },
    { header: "Descripción", width: 160 },
    { header: "Monto", width: 70 }
  ];

  page.drawText("HISTORIAL DE FINANZAS", {
    x: pageWidth / 2 - 120,
    y: page.getHeight() - 50,
    size: 20,
    font: bold,
    color: rgb(0, 0, 0)
  });

  let y = startY;

  const drawRowWithBorders = (rowData) => {
    let x = margin;

    columns.forEach((col) => {
      page.drawLine({ start: { x, y }, end: { x, y: y - rowHeight }, thickness: 1, color: rgb(0, 0, 0) });
      x += col.width;
    });

    page.drawLine({ start: { x, y }, end: { x, y: y - rowHeight }, thickness: 1, color: rgb(0, 0, 0) });

    page.drawLine({ start: { x: margin, y }, end: { x, y }, thickness: 1, color: rgb(0, 0, 0) });
    page.drawLine({ start: { x: margin, y: y - rowHeight }, end: { x, y: y - rowHeight }, thickness: 1, color: rgb(0, 0, 0) });

    let textX = margin + 5;
    rowData.forEach((text, index) => {
      page.drawText(String(text), {
        x: textX,
        y: y - 17,
        size: 10,
        font,
        color: rgb(0, 0, 0)
      });
      textX += columns[index].width;
    });
  };

  drawRowWithBorders(columns.map(c => c.header));
  y -= rowHeight;

  for (const item of historial) {
    if (y < margin + 40) {
      page = pdfDoc.addPage([600, 800]);
      y = startY;
      drawRowWithBorders(columns.map(c => c.header));
      y -= rowHeight;
    }

    drawRowWithBorders([
      new Date(item.fecha).toLocaleDateString(),
      item.tipo,
      item.accion,
      item.descripcion,
      `$${item.monto}`
    ]);

    y -= rowHeight;
  }

  const watermark = "FinanzasApp";
  const wmSize = 50;
  const wmWidth = bold.widthOfTextAtSize(watermark, wmSize);

  pdfDoc.getPages().forEach((p) => {
    p.drawText(watermark, {
      x: (p.getWidth() - wmWidth) / 2,
      y: p.getHeight() / 2,
      size: wmSize,
      font: bold,
      color: rgb(0.85, 0.85, 0.85)
    });
  });

  return pdfDoc.save();
};
// GENERAR EXCEL
const generarExcel = async (historial) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Historial");

  sheet.columns = [
    { header: "Fecha", key: "fecha", width: 15 },
    { header: "Tipo", key: "tipo", width: 15 },
    { header: "Acción", key: "accion", width: 20 },
    { header: "Descripción", key: "descripcion", width: 40 },
    { header: "Monto", key: "monto", width: 15 }
  ];

  historial.forEach(h => {
    sheet.addRow({
      fecha: new Date(h.fecha).toLocaleDateString(),
      tipo: h.tipo,
      accion: h.accion,
      descripcion: h.descripcion,
      monto: h.monto
    });
  });

  return workbook.xlsx.writeBuffer();
};

// DESCARGAR HISTORIAL (CON FILTRO)
export const descargarHistorial = async (req, res) => {
  const userId = req.user.id;
  const { formato, fechaInicio, fechaFin } = req.query;

  try {
    let filtroFinanza = { user: userId };
    let filtroMeta = { user: userId };

    if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      filtroFinanza.fecha = { ...filtroFinanza.fecha, $gte: inicio };
      filtroMeta.createdAt = { ...filtroMeta.createdAt, $gte: inicio };
    }

    if (fechaFin) {
      const fin = new Date(fechaFin + "T23:59:59");
      filtroFinanza.fecha = { ...filtroFinanza.fecha, $lte: fin };
      filtroMeta.createdAt = { ...filtroMeta.createdAt, $lte: fin };
    }

    const fin = await Finanza.find(filtroFinanza);
    const met = await Meta.find(filtroMeta);

    const historial = [
      ...fin.map(f => ({
        id: f._id.toString(),
        fecha: f.fecha || f.createdAt,
        tipo: "Finanza",
        accion: f.tipo,
        descripcion: f.descripcion,
        monto: f.valor
      })),
      ...met.map(m => ({
        id: m._id.toString(),
        fecha: m.createdAt,
        tipo: "Meta",
        accion: "Creación de Meta",
        descripcion: m.descripcion,
        monto: m.valorObjetivo
      }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    let file;
    let fileName;
    let contentType;

    if (formato === "pdf") {
      file = await generarPDF(historial);
      fileName = "historial.pdf";
      contentType = "application/pdf";

    } else if (formato === "excel") {
      file = await generarExcel(historial);
      fileName = "historial.xlsx";
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    } else {
      return res.status(400).json({ message: "Formato inválido" });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(file);

  } catch (err) {
    console.error("Error al descargar historial:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};