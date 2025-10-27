import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getBalanceRequest, createFinanzaRequest } from "../api/finanzas";
import { useFinanzas } from "../context/finanzasContext";

function FinanzasPages() {  
  
  const { register, handleSubmit, reset } = useForm();
  const {balance, createFinanza, loading} = useFinanzas()
  
  


   const onSubmit = handleSubmit(async (data) => {
      await createFinanza(data);
      reset();
  });


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      {/* Tarjeta del balance */}
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-80">
        <h2 className="text-2xl font-bold mb-4">💰 Balance Actual</h2>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <>
            <p className="text-green-600 font-semibold">
              Ingresos: ${balance.ingresos}
            </p>
            <p className="text-red-600 font-semibold">Gastos: ${balance.gastos}</p>
            <hr className="my-3" />
            <h1 className="text-3xl font-bold">
              Total:{" "}
              <span
                className={
                  balance.balance >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                ${balance.balance}
              </span>
            </h1>
          </>
        )}
      </div>

      {/* Formulario para registrar */}
      <form
        onSubmit={onSubmit}
        className="mt-8 flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md w-80"
      >
        <input
          type="number"
          placeholder="Valor"
          {...register("valor", { required: true })}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Descripción"
          {...register("descripcion", { required: true })}
          className="border p-2 rounded"
        />

        <select {...register("tipo")} className="border p-2 rounded">
          <option value="Ingreso">Ingreso</option>
          <option value="Gasto">Gasto</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
export default FinanzasPages;
