// src/routes/historial.routes.js
import { Router } from "express";
import { authRequired } from '../middlewares/validatetoken.js'; // Usamos el middleware de autenticación
import { getHistorialGeneral } from '../controllers/historial.controller.js';
import { descargarHistorial } from '../controllers/historial.controller.js';

const router = Router();

// Ruta para obtener el historial general del usuario autenticado
router.get('/historial', authRequired, getHistorialGeneral);

// Ruta para descargar el historial en Excel o PDF
router.get('/historial/download', authRequired, descargarHistorial); // Ruta protegida para descargar

export default router;