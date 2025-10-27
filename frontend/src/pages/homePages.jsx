function HomePages() {
    return (
         <div className="min-h-screen bg-zinc-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          Administra tus <span className="text-emerald-400">finanzas</span> con facilidad
        </h1>
        <p className="text-zinc-400 max-w-2xl mb-10 text-lg">
          Controla tus ingresos, gastos y metas financieras desde una plataforma moderna,
          segura y fácil de usar. Diseñada para que tengas el control total de tu dinero.
        </p>
        <div className="space-x-4">
          <a
            href="/register"
            className="bg-emerald-500 hover:bg-emerald-600 transition px-6 py-3 rounded-lg font-medium text-white shadow-md"
          >
            Comienza ahora
          </a>
          <a
            href="/login"
            className="border border-emerald-400 text-emerald-400 hover:bg-emerald-500 hover:text-white transition px-6 py-3 rounded-lg font-medium"
          >
            Iniciar sesión
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-zinc-800">
        <h2 className="text-3xl font-semibold text-center mb-12">
          ¿Por qué usar <span className="text-emerald-400">FinanzasApp</span>?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl font-semibold mb-3 text-emerald-400">Control total</h3>
            <p className="text-zinc-400">
              Registra y visualiza tus ingresos y gastos para mantener tus finanzas en orden.
            </p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl font-semibold mb-3 text-emerald-400">Reportes inteligentes</h3>
            <p className="text-zinc-400">
              Obtén gráficos claros y reportes automáticos que te muestran tu progreso financiero.
            </p>
          </div>
          <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl font-semibold mb-3 text-emerald-400">Seguridad garantizada</h3>
            <p className="text-zinc-400">
              Tus datos están protegidos con encriptación avanzada y autenticación segura.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center px-6 bg-gradient-to-r from-emerald-600 to-emerald-400 text-zinc-900">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Empieza a cuidar tus finanzas hoy</h2>
        <p className="text-lg mb-8 text-zinc-800">
          Crea una cuenta gratuita y lleva el control de tu economía personal.
        </p>
        <a
          href="/register"
          className="bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition"
        >
          Crear mi cuenta
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-500 py-6 text-center text-sm">
        © {new Date().getFullYear()} FinanzasApp — Todos los derechos reservados.
      </footer>
    </div>
    )
}
export default HomePages