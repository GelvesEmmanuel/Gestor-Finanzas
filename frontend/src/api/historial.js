
// src/api/historial.js
import axios from './axios'; // Asegúrate de que './axios' esté configurado con la baseURL correcta

// Función para obtener el historial general del usuario
export const getHistorialGeneralRequest = (fechaInicio, fechaFin) => {
  
  return axios.get('/historial', {
    params: {
      fechaInicio,
      fechaFin
    }
  });
};


export const downloadHistorialRequest = (fechaInicio, fechaFin, formato) => {
  // Validar formato
  if (!formato || (formato !== 'excel' && formato !== 'pdf')) {
    throw new Error('Formato inválido. Use "excel" o "pdf".');
  }
  // Construir los parámetros de consulta
  const params = new URLSearchParams();
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);
  params.append('formato', formato); // Añadir el parámetro de formato
  // Hacer la petición GET con responseType 'blob' para manejar archivos binarios
  return axios.get('/historial/download', {
    params, // Adjuntar los parámetros de fecha y formato
    responseType: 'blob' // Indicar a axios que espere un blob (archivo binario)
  });
};