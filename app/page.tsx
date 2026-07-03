export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-6">
      <main className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
          Sistema de Prestamos
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Plantilla inicial lista para despliegue
        </h1>
        <p className="mt-4 text-slate-700">
          Esta base ya esta preparada con Next.js, TypeScript, Docker y Vitest para
          implementar la calculadora de prestamos en CRC.
        </p>

        <section className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Motor financiero</p>
            <p className="mt-1">Ubicado en lib/loan-engine como funciones puras.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Pruebas</p>
            <p className="mt-1">Casos numéricos base con Vitest en tests/loan-engine.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Docker</p>
            <p className="mt-1">Imagen optimizada para correr en producción.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">Moneda</p>
            <p className="mt-1">Formato base para colones costarricenses (CRC).</p>
          </div>
        </section>
      </main>
    </div>
  );
}
