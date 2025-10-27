import { useForm } from "react-hook-form";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { useNavigate , Link} from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, authErrors } = useAuth();
  const navigation = useNavigate();

  // uso el useffect para comprobar si el ususr esat authenticado y redirige a ruta

   

  const onSubmit = handleSubmit(async (values) => {
    await  signup(values); 
    navigation("/login")
   
  });
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
          Registro de Usuario
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
            Digita tu email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-zinc-500"
            placeholder="Email del usuario"
          />
          {errors.username && (
            <p className="text-red-500">Email es requerido</p>
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
            placeholder="Contraseña del usuario"
          />
          {errors.username && (
            <p className="text-red-500">Contrase;a es requerido</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-700 hover:bg-zinc-600 transition text-white font-semibold px-4 py-2 rounded-md mt-4"
        >
          Registrar
        </button>
        <p className="text-sm text-zinc-400 text-center mt-3">
              ¿ Ya tienes una cuenta?
              <Link to="/login" className="text-zinc-200 hover:underline">
                Inicia seccion aqui
              </Link>
            </p>
      </form>
    </div>
  );
}
export default RegisterPage;
