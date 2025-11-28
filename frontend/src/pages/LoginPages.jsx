// src/pages/LoginPage.jsx
import { useForm } from 'react-hook-form'; // Asegúrate de tener react-hook-form instalado
import { useAuth } from '../context/authContext'; // Asegúrate de la ruta correcta
import { useEffect, useState } from 'react'; // Añadido useState
import { Link, useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate

// Componente LoginPage

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, authErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Estado para controlar la visibilidad del modal de bienvenida
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  // Función para manejar el envío del formulario
  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  // Efecto para manejar la navegación y el modal de bienvenida
  useEffect(() => {
    if (isAuthenticated)  navigate("/finanzas");
  }, [isAuthenticated]);

  // Función para cerrar el modal y navegar
  const handleModalClose = () => {
    setShowWelcomeModal(false);
    navigate("/finanzas");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Mensaje descriptivo en la parte superior */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black">
            Ingresa a tu cuenta para llevar el control de tus finanzas personales
          </h1>
        </div>
        {/* Formulario dentro del cuadro blanco */}
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-xl shadow-lg p-8 w-full space-y-6"
        >
          {/* Título dentro del cuadro */}
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            Iniciar Sesión
          </h2>
          {/* Subtítulo dentro del cuadro */}
          <p className="text-sm text-gray-600 text-center mb-4">
            Completa los siguientes campos para ingresar
          </p>
          {/* Mensajes de error */}
          {authErrors.length > 0 &&
            authErrors.map((error, i) => (
              <div
                key={i}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4"
              >
                {error}
              </div>
            ))}
          {/* Campo de Nombre de usuario */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              {...register("username", { required: true })}
              className={`w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.username ? 'border border-red-500' : ''}`}
              placeholder="Ingresa tu nombre de usuario"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">Nombre de usuario es requerido</p>
            )}
          </div>
          {/* Campo de Contraseña */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className={`w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${errors.password ? 'border border-red-500' : ''}`}
              placeholder="Ingresa tu contraseña mayor a 6 caracteres"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">Contraseña es requerida</p>
            )}
          </div>
          {/* Botón de Ingresar */}
          <button
             
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold px-4 py-2 rounded-full mt-4 transform hover:scale-105 duration-300"
          >
            Ingresar
          </button>
          {/* Enlace para registrarse */}
          <p className="text-sm text-gray-600 text-center mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-green-600 hover:underline font-medium">
              Crear cuenta
            </Link>
          </p>
        </form>
        {/* Footer */}
        <footer className="mt-8 bg-gray-50 text-center text-sm text-gray-500 py-4 border-t border-gray-200">
          <p className="text-xs">
            © {new Date().getFullYear()} FinanzasApp. Todos los derechos reservados.
          </p>
        </footer>
      </div>
      {/* Modal ventana emergente de Bienvenida */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-white/95 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              ¡Bienvenido a la App de Finanzas!
            </h2>
            <p className="text-lg text-gray-800 text-center mb-6">
              Hola, <span className="font-semibold">{user?.username || "Usuario"}</span>
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleModalClose} // Cierra el modal y navega
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

export default LoginPage; // Exporta el componente LoginPage