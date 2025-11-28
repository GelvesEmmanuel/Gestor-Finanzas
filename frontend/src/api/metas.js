// src/api/metas.js
import axios from './axios'

// Obtener todas las metas del usuario autenticado
export const getMetasRequest = () => axios.get('/metas');

// Crear una nueva meta
export const createMetaRequest = (data) => axios.post('/metas', data);

// Obtener una meta específica por ID
export const getMetaByIdRequest = (id) => axios.get(`/metas/${id}`);

// Actualizar una meta existente por ID
export const updateMetaRequest = (id, data) => axios.put(`/metas/${id}`, data);

// Eliminar una meta por ID
export const deleteMetaRequest = (id) => axios.delete(`/metas/${id}`);

// Actualizar el ahorro actual de una meta
export const actualizarAhorroMetaRequest = (id, data) => axios.put(`/metas/${id}/ahorro`, data); 