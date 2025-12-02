import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { createFinanzaRequest, getBalanceRequest, deleteFinanzaRequest, updateFinanzaRequest } from "../api/finanzas";

import { useAuth } from "./authContext";


const finanzasContext = createContext();

export const useFinanzas = () => {
  const context = useContext(finanzasContext);
  if (!context) {
    throw new Error("useAuth muest be used within an AuthProvider");
  }
  return context;
};
export function FinanzasProvider({ children }) {
  const [balance, setBalance] = useState({
    ingresos: 0,
    gastos: 0,
    balance: 0,
  });
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);

  //obtener balance desde el backend

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const res = await getBalanceRequest();
      setBalance(res.data);
    } catch (error) {
      console.log("error al obtener balance", error);
    } finally {
      setLoading(false);
    }
  };

  const createFinanza = async (finanzaData) => {
    try {
      await createFinanzaRequest(finanzaData);
      await fetchBalance();
    } catch (error) {
      console.log("Error al crear la finanza", error);
    }
  };
// ACTUALIZAR FINANZA 
  const updateFinanza = async (id, data) => {
    try {
      const res = await updateFinanzaRequest(id, data);

      setFinanzas(finanzas.map(f => f._id === id ? res.data : f));
      recalculateBalance();
      await fetchBalance();
    } catch (error) {
      console.log("Error al actualizar finanza", error);
    }
  };

  // ELIMINAR FINANZA
  const deleteFinanza = async (id) => {
    try {
      await deleteFinanzaRequest(id);

      setFinanzas(finanzas.filter(f => f._id !== id));
      recalculateBalance();
      await fetchBalance();
    } catch (error) {
      console.log("Error al eliminar finanza", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBalance();
    } else {
      setBalance({ ingresos: 0, gastos: 0, balance: 0 });
    }
  }, [isAuthenticated, user]);

  return (
    <finanzasContext.Provider
      value={{
        balance,
        loading,
        fetchBalance,
        createFinanza,
        deleteFinanza,
        updateFinanza
      }}
    >
      {children}
    </finanzasContext.Provider>
  );
}
