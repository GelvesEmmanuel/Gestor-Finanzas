import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPages.jsx";
import LoginPage from "./pages/LoginPages.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import HomePages from "./pages/homePages.jsx";
import FinanzasPages from "./pages/finanzasPages.jsx";
import FinanzasFormPages from "./pages/finanzasFormPages.jsx";
import ProfilePages from "./pages/profilePages.jsx";
import Navbar from "./components/Navbar.jsx";
import MetasPages from "./pages/metasPages.jsx";
import HistorialPages from "./pages/historialPages.jsx"

import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import { FinanzasProvider } from "./context/finanzasContext.jsx";
import { HistorialProvider } from "./context/historialContext.jsx";
import { MetaProvider } from "./context/metasContext.jsx";
//Establesco rutas del fron tend mediante react router dom v6
function App() {
  return (
    <AuthProvider>
      <FinanzasProvider>
        <HistorialProvider>
          <MetaProvider>
          
        <BrowserRouter>
            
          <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<HomePages />} /> /* publico */
            <Route path="/login" element={<LoginPage />} /> 
            <Route path="/register" element={<RegisterPage />} /> 
            <Route element={<ProtectedRoutes />}>
              <Route path="/finanzas" element={<FinanzasPages />} />
              <Route path="/add-finanzas" element={<FinanzasFormPages />} />
              <Route path="/finanzas/:id" element={<h1>actualizar</h1>} />
              <Route path="/profile" element={<ProfilePages />} />
              <Route path= "/metas" element= {<MetasPages />}> </Route>
              <Route path="/historial" element= {<HistorialPages/>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </MetaProvider>
        </HistorialProvider>
      </FinanzasProvider>
    </AuthProvider>
  );
}

export default App;
