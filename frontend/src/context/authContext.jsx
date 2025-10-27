import { useContext } from "react";
import { createContext, useState, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
} from "../api/auth.js";
import { set } from "mongoose";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muest be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authErrors, setAuthErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res);
      setAuthErrors([]);
    } catch (error) {
      console.log(error.response);

      if (error.response?.data) {
        const errData = error.response.data;
        // Si el backend devuelve { error: [...] }
        if (Array.isArray(errData.error)) {
          setAuthErrors(errData.error);
        }
        // Si devuelve directamente un array [...]
        else if (Array.isArray(errData)) {
          setAuthErrors(errData);
        }
        // Si devuelve solo un string o algo diferente
        else if (typeof errData === "string") {
          setAuthErrors([errData]);
        } else {
          setAuthErrors(["Ocurrió un error desconocido"]);
        }
      } else {
        setAuthErrors(["Error de conexión con el servidor"]);
      }

      //setAuthErrors(error.response.data)
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res.data);
      setAuthErrors([]);
      setUser(res.data)
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response);

      if (error.response?.data) {
        const errData = error.response.data;
        // Si el backend devuelve { error: [...] }
        if (Array.isArray(errData.error)) {
          setAuthErrors(errData.error);
        }
        // Si devuelve directamente un array [...]
        else if (Array.isArray(errData)) {
          setAuthErrors(errData);
        }
        // Si devuelve solo un string o algo diferente
        else if (typeof errData === "string") {
          setAuthErrors([errData]);
        } else {
          setAuthErrors(["Ocurrió un error desconocido"]);
        }
      } else {
        setAuthErrors(["Error de conexión con el servidor"]);
      }
    }
  };
  // funcion para eleminar los mensajes de error depues de determinado tiempo

  useEffect(() => {
    if (authErrors.length > 0) {
      const timer = setTimeout(() => {
        setAuthErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authErrors]);
  // funcion para comprobar cookie con js-cookie y protejer rutas con protetctedRoutes 

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false)
        return setUser(null);
      }
      try {
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);
        if (!res.data) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);



    // funcion loout removiendo el token
    const logout = () => {
      Cookies.remove("token")
      setIsAuthenticated(false)
      setUser(null)

    }
  return (
    <AuthContext.Provider
      value={{
        signup,
        user,
        logout,
        isAuthenticated,
        authErrors,
        signin,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
