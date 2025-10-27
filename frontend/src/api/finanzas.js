import axios from './axios'


export const getFinanzasRequest = () => axios.get('/finanzas');

// crear nueva finanza (ingreso o gasto)
export const createFinanzaRequest = (data) => axios.post('/finanzas', data);

// obtener balance total
export const getBalanceRequest = () => axios.get('/finanzasBalance');

// obtener finanzas por periodo
export const getFinanzasPeriodoRequest = (fechaInicio, fechaFin) =>
  axios.get(`/finanzasPeriodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);

// eliminar una finanza
export const deleteFinanzaRequest = (id) => axios.delete(`/finanzas/${id}`);

// actualizar una finanza
export const updateFinanzaRequest = (id, data) => axios.put(`/finanzas/${id}`, data);
