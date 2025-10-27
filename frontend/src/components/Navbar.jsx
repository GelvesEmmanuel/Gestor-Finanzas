import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  console.log("Usuario autenticado:", user);
  return (
    <nav className="bg-zinc-900 text-white px-8 py-4 shadow-lg flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-cover" />
        <h1 className="text-lg font-semibold tracking-wide">FinanzasApp</h1>
      </div>

      <ul className="flex space-x-6 items-center">
        {isAuthenticated ? (
          <>
          
            <li><Link to="/" className="hover:text-zinc-400 transition">Inicio</Link></li>
            <li><Link to="/finanzas" className="hover:text-zinc-400 transition">Finanzas</Link></li>
            <li><Link to="/metas" className="hover:text-zinc-400 transition">metas</Link></li>
            <li><Link to="/profile" className="hover:text-zinc-400 transition">Perfil</Link></li>
          </>
        ) : (
          <><li><Link to="/" className="hover:text-zinc-400 transition">Inicio</Link></li>
            <li><Link to="/login" className="hover:text-zinc-400 transition">Login</Link></li>
            <li><Link to="/register" className="hover:text-zinc-400 transition">Registro</Link></li>
          </>
        )}
      </ul>

      {isAuthenticated && (
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-2">
            <img
              src="/user-icon.png"
              alt="Usuario"
              className="w-8 h-8 rounded-full border border-zinc-600 object-cover"
            />
            <span className="text-sm font-medium text-zinc-300">
                Bienvenido: {user?.username || "Usuario"}
            </span>
          </div>
          <button
            onClick={logout}
            className="bg-zinc-700 hover:bg-zinc-600 transition text-white text-sm px-4 py-2 rounded-md font-medium"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
