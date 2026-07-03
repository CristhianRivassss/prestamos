import { addPaymentPeriod } from "@/lib/loan-engine/shared/dates";
import { roundColones } from "@/lib/loan-engine/shared/money";
import type { PaymentFrequency, PaymentRow } from "@/lib/loan-engine/types";

export function calculateFrenchInstallment(
  principal: number,
  periodRate: number,
  installments: number,
): number {
  if (periodRate === 0) {
    return principal / installments;
  }

  const numerator = principal * periodRate;
  const denominator = 1 - (1 + periodRate) ** -installments;
  return numerator / denominator;
}

export function buildFrenchSchedule(params: {
  principal: number;
  periodRate: number;
  installments: number;
  firstPaymentDate: Date;
  frequency: PaymentFrequency;
  extraPayment?: number;
}): PaymentRow[] {
  const rows: PaymentRow[] = [];
  let balance = roundColones(params.principal);
  let paymentDate = new Date(params.firstPaymentDate);
  const baseInstallment = calculateFrenchInstallment(
    params.principal,
    params.periodRate,
    params.installments,
  );
  const extra = Math.max(0, roundColones(params.extraPayment ?? 0));

  for (let i = 1; i <= params.installments; i += 1) {
    const interest = roundColones(balance * params.periodRate);

    let payment = roundColones(baseInstallment) + extra;
    let principalPayment = payment - interest;

    if (i === params.installments || principalPayment > balance) {
      principalPayment = balance;
      payment = principalPayment + interest;
    }

    balance = roundColones(balance - principalPayment);

    rows.push({
      installmentNumber: i,
      date: paymentDate,
      payment,
      interest,
      principalPayment,
      balance,
    });

    paymentDate = addPaymentPeriod(paymentDate, params.frequency);
  }

  return rows;
}
