// src/pages/finanzasPages.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useFinanzas } from "../context/finanzasContext";
import { useAuth } from "../context/authContext";


// Componente FinanzasPages

function FinanzasPages() {
  const { register, handleSubmit, reset } = useForm();
  const { balance, createFinanza} = useFinanzas();

  const { user } = useAuth();

// registrar finanza
const onSubmit = handleSubmit(async (data) => {
    await createFinanza(data);
    await fetchHistorial();
    reset();
  });

 
  // FILTRAR SOLO FINANZAS

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-black text-center mb-6">
          Registro finanzas
        </h1>
        {/* TARJETAS */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 w-full">
          <div className="bg-green-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center flex-1 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Ingresos</h2>
            <p className="text-2xl font-bold">${balance?.ingresos ?? 0}</p>
          </div>
          <div className="bg-red-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center flex-1 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Gastos</h2>
            <p className="text-2xl font-bold">${balance?.gastos ?? 0}</p>
          </div>
          <div className="bg-yellow-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center flex-1 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Balance</h2>
            <p className="text-2xl font-bold">${balance?.balance ?? 0}</p>
          </div>
        </div>
        {/* FORMULARIO */}
        <div className="w-full max-w-2xl mx-auto">
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-black">
              Agregar movimiento
            </h2>
            <div className="flex flex-col text-left">
              <label className="text-base font-medium text-gray-700 mb-2">
                Valor
              </label>
              <input
                placeholder="Ingresa valor"
                type="number"
                {...register("valor", { required: true })}
                className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col text-left">
              <label className="text-base font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                placeholder="Ingresa descripción"
                type="text"
                {...register("descripcion", { required: true })}
                className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col text-left">
              <label className="text-base font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                {...register("tipo")}
                className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg"
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Gasto">Gasto</option>
              </select>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-full mt-6">
              Registrar
            </button>
            
          </form>
        </div>
        
       
        <footer className="mt-12 text-center text-sm text-gray-500 py-6 border-t border-gray-200">
          © {new Date().getFullYear()} FinanzasApp
        </footer>
      </div>
    </div>
  );
}
export default FinanzasPages;