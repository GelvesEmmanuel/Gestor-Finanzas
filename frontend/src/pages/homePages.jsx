// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Componente HomePages

const HomePages = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* contexto principal */}
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-black">Bienvenido a tu App de Finanzas</h1>
        <p className="text-lg mb-10 text-gray-600"> 
          Gestiona tus finanzas personales de manera sencilla e intuitiva. Registra tus ingresos y gastos,
          establece metas y mantén un control total sobre tu dinero.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Image 1 */}
          <div className="bg-gray-200 from-indigo-100 to-blue-100 rounded-3xl p-6 shadow-lg flex flex-col items-center">
            <img src="/public/1761612945.png" alt="Gráfico de crecimiento" className="w-full max-w-full h-auto rounded-lg" />
          </div>
          {/* Image 2 */}
          <div className="bg-gray-200 from-indigo-100 to-blue-100 rounded-3xl p-6 shadow-lg flex flex-col items-center">
            <img src="/public/1761613186.png" alt="Panel de control" className="w-full max-w-full h-auto rounded-lg" />
          </div>
        </div>
        {/* Sección de Beneficios y Objetivo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">¿Por qué usar nuestra App?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-blue-600 mb-2">Beneficio del Registro</h3>
              <p className="text-gray-600">
                Al registrarte, obtienes acceso completo a todas las herramientas de gestión financiera.
                Puedes crear tu perfil, guardar tus datos, y comenzar a registrar tus movimientos financieros de forma segura.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-medium text-green-600 mb-2">Objetivo del Sitio</h3>
              <p className="text-gray-600">
                Nuestro objetivo es ayudarte a tomar el control de tus finanzas personales. Simplificamos el proceso
                de seguimiento de tus gastos e ingresos para que puedas ahorrar e invertir de manera inteligente.
              </p>
            </div>
          </div>
        </section>
        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Registrarse
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
          >
            iniciar sesion
          </Link>
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-8 bg-gray-50 text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        <p className="text-xs">
          © {new Date().getFullYear()} FinanzasApp. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default HomePages;