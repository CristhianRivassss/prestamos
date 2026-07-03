"use client";

import { useMemo, useState } from "react";

import { addPaymentPeriod } from "@/lib/loan-engine/shared/dates";
import { formatCRC } from "@/lib/loan-engine/shared/money";
import { calculateLoanPlan, type InterestType, type PaymentFrequency } from "@/lib/loan-engine";

function toInputDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function frequencyLabel(frequency: PaymentFrequency): string {
  if (frequency === "diario") return "Diario";
  if (frequency === "semanal") return "Semanal";
  if (frequency === "quincenal") return "Quincenal";
  return "Mensual";
}

function interestLabel(type: InterestType): string {
  if (type === "interes_fijo") return "Interes fijo simple";
  if (type === "cuota_fija") return "Cuota fija (frances)";
  if (type === "solo_interes") return "Solo interes, capital al final";
  return "Interes total repartido (flat)";
}

export function LoanCalculator() {
  const today = new Date();
  const defaultFrequency: PaymentFrequency = "quincenal";

  const [principal, setPrincipal] = useState(1_000_000);
  const [monthlyRatePct, setMonthlyRatePct] = useState(10);
  const [interestType, setInterestType] = useState<InterestType>("cuota_fija");
  const [frequency, setFrequency] = useState<PaymentFrequency>(defaultFrequency);
  const [installments, setInstallments] = useState(8);
  const [disbursementDate, setDisbursementDate] = useState(toInputDate(today));
  const [firstPaymentDate, setFirstPaymentDate] = useState(
    toInputDate(addPaymentPeriod(today, defaultFrequency)),
  );
  const [extraPayment, setExtraPayment] = useState(0);

  const result = useMemo(() => {
    if (principal <= 0 || monthlyRatePct < 0 || installments <= 0) {
      return null;
    }

    return calculateLoanPlan({
      principal,
      monthlyRatePct,
      interestType,
      frequency,
      installments,
      disbursementDate: new Date(disbursementDate),
      firstPaymentDate: new Date(firstPaymentDate),
      extraPayment,
    });
  }, [
    principal,
    monthlyRatePct,
    interestType,
    frequency,
    installments,
    disbursementDate,
    firstPaymentDate,
    extraPayment,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Sistema de Prestamos</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Calculadora de planilla</h1>
        <p className="mt-2 text-sm text-slate-600">
          Completa el formulario y la tabla se recalcula automaticamente en colones costarricenses.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm text-slate-700">
            Monto prestado (CRC)
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              type="number"
              min={0}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
            />
          </label>

          <label className="text-sm text-slate-700">
            Tasa mensual (%)
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              type="number"
              min={0}
              step="0.01"
              value={monthlyRatePct}
              onChange={(e) => setMonthlyRatePct(Number(e.target.value))}
            />
          </label>

          <label className="text-sm text-slate-700">
            Tipo de interes
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={interestType}
              onChange={(e) => setInterestType(e.target.value as InterestType)}
            >
              <option value="interes_fijo">Interes fijo simple</option>
              <option value="cuota_fija">Cuota fija (frances)</option>
              <option value="solo_interes">Solo interes, capital al final</option>
              <option value="interes_flat">Interes total repartido (flat)</option>
            </select>
          </label>

          <label className="text-sm text-slate-700">
            Frecuencia de pago
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as PaymentFrequency)}
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
            </select>
          </label>

          <label className="text-sm text-slate-700">
            Numero de cuotas
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              type="number"
              min={1}
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
            />
          </label>

          <label className="text-sm text-slate-700">
            Fecha desembolso
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              type="date"
              value={disbursementDate}
              onChange={(e) => setDisbursementDate(e.target.value)}
            />
          </label>

          <label className="text-sm text-slate-700">
            Fecha primer pago
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              type="date"
              value={firstPaymentDate}
              onChange={(e) => setFirstPaymentDate(e.target.value)}
            />
          </label>

          <label className="text-sm text-slate-700">
            Abono extra por cuota (CRC)
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              type="number"
              min={0}
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
            />
          </label>
        </div>

        {result ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Tasa por periodo: {(result.periodRate * 100).toFixed(3)}%
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Frecuencia: {frequencyLabel(frequency)}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Tipo: {interestLabel(interestType)}</span>
            <button
              className="rounded-lg bg-teal-700 px-3 py-2 text-white hover:bg-teal-800"
              type="button"
              onClick={() => window.print()}
            >
              Imprimir
            </button>
          </div>
        ) : null}
      </section>

      {result ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Total a pagar</p>
                <p className="font-semibold text-slate-900">{formatCRC(result.summary.totalToPay)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Total intereses</p>
                <p className="font-semibold text-slate-900">{formatCRC(result.summary.totalInterest)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Tasa efectiva del prestamo</p>
                <p className="font-semibold text-slate-900">
                  {principal > 0 ? ((result.summary.totalInterest / principal) * 100).toFixed(2) : "0.00"}%
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-slate-500">Ultimo pago</p>
                <p className="font-semibold text-slate-900">{formatDate(result.summary.lastPaymentDate)}</p>
              </div>
            </div>
          </section>

          <section className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left"># Cuota</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-right">Cuota total</th>
                  <th className="px-3 py-2 text-right">Interes</th>
                  <th className="px-3 py-2 text-right">Abono capital</th>
                  <th className="px-3 py-2 text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.installmentNumber} className="border-t border-slate-200">
                    <td className="px-3 py-2">{row.installmentNumber}</td>
                    <td className="px-3 py-2">{formatDate(row.date)}</td>
                    <td className="px-3 py-2 text-right">{formatCRC(row.payment)}</td>
                    <td className="px-3 py-2 text-right">{formatCRC(row.interest)}</td>
                    <td className="px-3 py-2 text-right">{formatCRC(row.principalPayment)}</td>
                    <td className="px-3 py-2 text-right">{formatCRC(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Revisa los valores del formulario. Debe haber monto y cuotas validas para calcular.
        </section>
      )}
    </div>
  );
}
