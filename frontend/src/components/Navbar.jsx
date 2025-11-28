import { Link , useNavigate} from "react-router-dom";
import { useAuth } from "../context/authContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate(); // Obtén la función de navegación

  console.log("Usuario autenticado:", user);

  // Función auxiliar para obtener la primera letra del nombre de usuario
  const getFirstLetter = (username) => {
    if (!username || username.trim().length === 0) return '?'; // Valor por defecto si no hay nombre
    return username.charAt(0).toUpperCase(); // Devuelve la primera letra en mayúscula
  };

  // Manejador del click en "Salir"
  const handleLogout = async () => {
    try {
      await logout(); // Asegura que la promesa de logout se resuelva
      console.log("Sesión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Navega a la página de inicio después de intentar cerrar la sesión
      navigate('/');
    }
  };
  // Renderizado del Navbar
  return (
    <nav className="bg-gray-50 text-black px-8 py-4 shadow-lg flex justify-between items-center">
      {/* logo y nombre de la app */}
      <Link to="/" className="flex items-center space-x-3 no-underline">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        <h1 className="text-lg font-semibold tracking-wide">FinanzasApp</h1>
      </Link>
      {/* enlaces de navegación */}
      <ul className="flex space-x-6 items-center font-medium">
        {isAuthenticated ? (
          <>
            <li><Link to="/finanzas" className="hover:text-gray-600 transition">Finanzas</Link></li>
            <li><Link to="/metas" className="hover:text-gray-600 transition">Metas</Link></li>
            <li><Link to="/historial" className="hover:text-gray-600 transition">Historial</Link></li>
            <li><Link to="/profile" className="hover:text-gray-600 transition">Perfil</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="hover:text-gray-600 transition">Iniciar sesión</Link></li>
            <li><Link to="/register" className="hover:text-gray-600 transition">Regístrate</Link></li>
          </>
        )}
      </ul>
      {/* sección de usuario autenticado */}
      {isAuthenticated && (
        <div className="flex items-center space-x-5">
          {/* Círculo con la letra inicial del usuario */}
          <div className="flex items-center space-x-2">
            {/* Círculo con la letra inicial */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {getFirstLetter(user?.username)}
            </div>
            {/* Texto "Bienvenido: [nombre]" */}
            <span className="text-sm font-medium">
              Bienvenido: {user?.username || "Usuario"}
            </span>
          </div>
          {/* Botón Salir */}
          <button
            onClick={handleLogout} 
            className="bg-green-600 hover:bg-green-700 transition text-white text-sm px-4 py-2 rounded-full font-medium"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
