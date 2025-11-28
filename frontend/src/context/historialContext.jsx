
// src/context/historialContext.jsx
import { createContext, useContext, useState } from 'react';
import { useAuth } from './authContext'; // Importamos useAuth para saber si el usuario está autenticado
import { getHistorialGeneralRequest } from '../api/historial'; // Importamos la función de la API

const HistorialContext = createContext();

// Hook personalizado para usar el contexto
export const useHistorial = () => {
  const context = useContext(HistorialContext);
  if (!context) {
    throw new Error('useHistorial must be used within a HistorialProvider');
  }
  return context;
};

// Proveedor del contexto
export const HistorialProvider = ({ children }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga (ahora lo controla cada componente que llame a fetch)
  const [error, setError] = useState(null); // Estado para manejar errores
  const { isAuthenticated } = useAuth(); // Obtenemos el estado de autenticación

  // Función para cargar el historial del backend
const fetchHistorial = async (fechaInicio, fechaFin) => {
  
  if (!isAuthenticated) {
    setHistorial([]);
    setError("Usuario no autenticado.");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const res = await getHistorialGeneralRequest(fechaInicio, fechaFin);
    console.log("DATA DEL BACKEND:", res.data);
    setHistorial(res.data);

  } catch (err) {
    console.error("Error al obtener el historial:", err);
    setError(err.message || "Error desconocido al cargar el historial.");
  } finally {
    setLoading(false);
  }
};

  // Valor que expone el contexto
  const value = {
    historial,
    loading,
    error,
    fetchHistorial,
  };

  return (
    <HistorialContext.Provider value={value}>
      {children}
    </HistorialContext.Provider>
  );
};
