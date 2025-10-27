import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, authErrors, isAuthenticated } = useAuth();
  const navigation = useNavigate()
  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigation("/finanzas");
  }, [isAuthenticated]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <form
        onSubmit={onSubmit}
        className="flex flex-col bg-zinc-800 rounded-2xl shadow-lg p-8 w-full max-w-md space-y-5"
      >
        {authErrors.length > 0 &&
          authErrors.map((error, i) => (
            <div
              key={i}
              className="bg-red-500 p-2 text-white text-center rounded-md"
            >
              {error}
            </div>
          ))}

        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          Iniciar Sesión
        </h2>

        <div className="flex flex-col text-left">
          <label className="text-sm font-medium text-zinc-300 mb-1">
            Digita tu nombre de usuario
          </label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-zinc-500"
            placeholder="Nombre de usuario"
          />
          {errors.username && (
            <p className="text-red-500">Nombre de usuario es requerido</p>
          )}
        </div>

        <div className="flex flex-col text-left">
          <label className="text-sm font-medium text-zinc-300 mb-1">
            Digita tu contraseña
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-zinc-500"
            placeholder="Contraseña"
          />
          {errors.password && (
            <p className="text-red-500">Nombre de usuario es requerido</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-700 hover:bg-zinc-600 transition text-white font-semibold px-4 py-2 rounded-md mt-4"
        >
          Ingresar
        </button>

        <p className="text-sm text-zinc-400 text-center mt-3">
          ¿No tienes una cuenta?
          <Link to="/register" className="text-zinc-200 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
export default LoginPage;
