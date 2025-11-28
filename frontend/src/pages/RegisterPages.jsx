// src/pages/RegisterPage.jsx
import { useForm } from "react-hook-form"; // Asegúrate de tener react-hook-form instalado
import { useAuth } from "../context/authContext"; // Asegúrate de la ruta correcta
import { useNavigate, Link } from "react-router-dom"; // Asegúrate de importar useNavigate
import { useState } from "react"; // Añadido useState

// Componente RegisterPage

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, authErrors } = useAuth();
  const navigate = useNavigate();

  // Estado para controlar la visibilidad del modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup(values);
      // Mostrar el modal de éxito en lugar de navegar inmediatamente
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      // El error ya se maneja en el contexto de autenticación
    }
  });

  // Función para cerrar el modal y navegar
  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Mensaje superior */}
      <div className="w-full max-w-md mb-6 text-center">
        <h1 className="text-2xl font-semibold text-black">
          Crea tu cuenta para gestionar tus finanzas personales
        </h1>
      </div>
      {/* Formulario */}
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6"
      >
        {authErrors.length > 0 &&
          authErrors.map((error, i) => (
            <div
              key={i}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4"
            >
              {error}
            </div>
          ))}
        <h2 className="text-2xl font-bold text-center mb-2 text-black">
          Registro de Usuario
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Completa los siguientes campos para crear tu cuenta
        </p>
        <div className="flex flex-col text-left">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            type="text"
            {...register("username", { required: "Nombre de usuario es requerido" })}
            className={`w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.username ? 'border border-red-500' : ''}`}
            placeholder="Ingresa tu nombre de usuario"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
          )}
        </div>
        <div className="flex flex-col text-left">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email es requerido",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Expresión regular para validar email
                message: "Email inválido"
              }
            })}
            className={`w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.email ? 'border border-red-500' : ''}`}
            placeholder="Ingresa tu email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col text-left">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres"
              }
            })}
            className={`w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.password ? 'border border-red-500' : ''}`}
            placeholder="Ingresa tu contraseña"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition-transform text-white font-semibold px-4 py-2 rounded-full mt-4 transform hover:scale-105 duration-300"
        >
          Registrar
        </button>
        <p className="text-sm text-gray-600 text-center mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
      {/* Pie de página */}
      <footer className="mt-8 bg-gray-50 text-center text-sm text-gray-500 py-4 border-t border-gray-200 w-full max-w-md">
        <p className="text-xs">
          © {new Date().getFullYear()} FinanzasApp. Todos los derechos reservados.
        </p>
      </footer>
      {/* Modal ventana emergente de creacion de cuenta */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-white/95 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              ¡Cuenta creada con éxito!
            </h2>
            <p className="text-lg text-gray-800 text-center mb-6">
              Tu cuenta ha sido registrada correctamente.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleModalClose}
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

export default RegisterPage; // Exporta el componente RegisterPage