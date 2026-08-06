export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-cyan-600 mb-8">
          Mundo Web
        </h1>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Correo electrónico
            </label>

            <input
              type="email"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Contraseña
            </label>

            <input
              type="password"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="********"
            />
          </div>

          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-bold"
          >
            Iniciar sesión
          </button>

        </form>

      </div>
    </main>
  );
}