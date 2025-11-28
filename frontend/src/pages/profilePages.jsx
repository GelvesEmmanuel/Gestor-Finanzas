// src/pages/ProfilePage.jsx

import React from 'react';
import { useForm } from "react-hook-form"; // Asegúrate de tener react-hook-form instalado
import { useAuth } from "../context/authContext"; // Asegúrate de la ruta correcta
import { Link } from "react-router-dom"; // Asegúrate de importar Link
import { useState } from "react"; // Importa useState

// Componente ProfilePages

function ProfilePages() {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Estado para controlar la visibilidad del modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Función para manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateProfile(data);
      // Mostrar el modal de éxito
      setShowSuccessModal(true);
      // Opcional: puedes mostrar un mensaje de éxito o recargar el perfil
      console.log("Perfil actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      // Opcional: mostrar un mensaje de error al usuario
    }
  });

  // Función para cerrar el modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Contenedor principal */}
      <div className="w-full max-w-6xl space-y-8">
        {/* Título */}
        <h1 className="text-4xl font-bold text-black text-center">Mi Perfil</h1>
        <p className="text-base text-gray-600 text-center mb-8">
          Podrás ver la información asociada a tu cuenta.
        </p>
        {/* Contenido principal con dos columnas */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Columna izquierda: Información del usuario */}
          <div className="md:w-1/3 w-full bg-white rounded-2xl shadow-xl p-8">
            {/* Círculo con la letra inicial */}
            <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            {/* Nombre y rol */}
            <div className="text-center mb-6">
              <p className="font-semibold text-black text-lg">Miembro</p>
              <span className="text-2xl font-medium text-black">
                {user?.username || "Usuario"}
              </span>
            </div>
            {/* Botones de navegación */}
            <div className="space-y-4">
              {/* Botón para Metas */}
              <Link to="/metas" className="block w-full bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition text-center">
                Gestion de metas
              </Link>
              {/* Botón para Finanzas */}
              <Link to="/finanzas" className="block w-full bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition text-center">
                Gestion de finanzas
              </Link>
              {/* --- NUEVO BOTÓN PARA HISTORIAL --- */}
              <Link to="/historial" className="block w-full bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition text-center">
                Historial
              </Link>
              {/* --- FIN NUEVO BOTÓN --- */}
            </div>
          </div>
          {/* Columna derecha: Formulario de información personal */}
          <div className="md:w-2/3 w-full bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-black">Informacion personal</h2>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Campo de Nombre */}
              <div className="flex flex-col text-left">
                <label className="text-base font-medium text-gray-700 mb-2">Nombre:</label>
                <input
                  type="text"
                  defaultValue={user?.username || ""}
                  {...register("username", { required: true })}
                  className={`w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.username ? 'border border-red-500' : ''}`}
                  placeholder="Nombre"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">Nombre es requerido</p>
                )}
              </div>
              {/* Campo de Contraseña */}
              <div className="flex flex-col text-left">
                <label className="text-base font-medium text-gray-700 mb-2">Contraseña:</label>
                <input
                  type="password" // Campo para actualizar la contraseña
                  {...register("password", {
                    required: false,
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres"
                    }
                  })}
                  className={`w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.password ? 'border border-red-500' : ''}`}
                  placeholder="Ingrese nueva contraseña (opcional)"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              {/* Botón Guardar */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 transition-transform text-white font-semibold px-6 py-3 rounded-full mt-6 transform hover:scale-105 duration-300"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
        {/* Pie de página */}
        <footer className="mt-12 bg-gray-50 text-center text-sm text-gray-500 py-6 border-t border-gray-200 w-full">
          <p className="text-sm">
            © {new Date().getFullYear()} FinanzasApp. Todos los derechos reservados.
          </p>
        </footer>
      </div>
      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-white/80 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              ¡Usuario actualizado con éxito!
            </h2>
            <div className="flex justify-center">
              <button
                onClick={closeSuccessModal}
                className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-2 rounded-full"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePages; // Exporta el componente ProfilePages