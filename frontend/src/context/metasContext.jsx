// src/context/metaContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from './authContext'; // Para saber si el usuario está autenticado
// Importa las funciones de la API
import {getMetasRequest,createMetaRequest,updateMetaRequest,deleteMetaRequest} from '../api/metas';

// Crea el contexto
const metaContext = createContext();

// Hook personalizado para usar el contexto
export const useMeta = () => {
  const context = useContext(metaContext);
  if (!context) {
    throw new Error("useMeta must be used within a MetaProvider");
  }
  return context;
};

// Proveedor del contexto
export function MetaProvider({ children }) {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const { isAuthenticated } = useAuth(); // Obtener estado de autenticación

  // Función para cargar las metas desde el backend
  const fetchMetas = async () => {
    if (!isAuthenticated) {
      // Si no está autenticado, limpiar metas y salir
      setMetas([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getMetasRequest(); // Llama a la API
      setMetas(res.data); // Actualiza el estado con las metas del backend
    } catch (error) {
      console.error("Error al obtener las metas:", error);
      // Opcional: podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
    }
  }; 

  // Función para crear una nueva meta
  const createMeta = async (metaData) => {
    try {
      const res = await createMetaRequest(metaData); // Llama a la API
      setMetas([...metas, res.data]);
      console.log(metaData)
      return res.data;
      
    } catch (error) {
      console.error("Error al crear la meta:", error);
      throw error;
    }
  };

  // Función para actualizar una meta existente
  const updateMeta = async (id, newData) => {
    try {
      const res = await updateMetaRequest(id, newData); // Llama a la API
      setMetas(metas.map(meta => meta._id === id ? res.data : meta));
      return res.data;
    } catch (error) {
      console.error("Error al actualizar la meta:", error);
            throw error;
    }
  };

  // Función para eliminar una meta
  const deleteMeta = async (id) => {
    try {
      await deleteMetaRequest(id); // Llama a la API
      setMetas(metas.filter(meta => meta._id !== id));
    } catch (error) {
      console.error("Error al eliminar la meta:", error);
      throw error;
    }
  };

  // Efecto para cargar metas cuando el usuario se autentica o cambia
  useEffect(() => {
    fetchMetas();
  }, [isAuthenticated]);

  // Valor que expone el contexto
  return (
    <metaContext.Provider
      value={{
        metas,
        loading,
        fetchMetas,
        createMeta,
        updateMeta,
        deleteMeta,
      }}
    >
      {children}
    </metaContext.Provider>
  );
}