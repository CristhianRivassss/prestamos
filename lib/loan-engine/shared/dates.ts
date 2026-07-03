import type { PaymentFrequency } from "@/lib/loan-engine/types";

export function addPaymentPeriod(date: Date, frequency: PaymentFrequency): Date {
  const result = new Date(date);

  if (frequency === "diario") {
    result.setDate(result.getDate() + 1);
    return result;
  }

  if (frequency === "semanal") {
    result.setDate(result.getDate() + 7);
    return result;
  }

  if (frequency === "quincenal") {
    result.setDate(result.getDate() + 15);
    return result;
  }

  const startDay = result.getDate();
  result.setMonth(result.getMonth() + 1);
  if (result.getDate() < startDay) {
    result.setDate(0);
  }

  return result;
}
