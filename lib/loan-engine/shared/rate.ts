import type { PaymentFrequency } from "@/lib/loan-engine/types";

export function getPeriodsPerMonth(frequency: PaymentFrequency): number {
  switch (frequency) {
    case "diario":
      return 30;
    case "semanal":
      return 4;
    case "quincenal":
      return 2;
    case "mensual":
      return 1;
    default:
      return 1;
  }
}

export function monthlyPctToPeriodRate(monthlyRatePct: number, frequency: PaymentFrequency): number {
  const periodsPerMonth = getPeriodsPerMonth(frequency);
  return monthlyRatePct / 100 / periodsPerMonth;
}
