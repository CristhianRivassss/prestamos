import { addPaymentPeriod } from "@/lib/loan-engine/shared/dates";
import { roundColones } from "@/lib/loan-engine/shared/money";
import type { PaymentFrequency, PaymentRow } from "@/lib/loan-engine/types";

export function buildFlatSchedule(params: {
  principal: number;
  periodRate: number;
  installments: number;
  firstPaymentDate: Date;
  frequency: PaymentFrequency;
}): PaymentRow[] {
  const rows: PaymentRow[] = [];
  const initialPrincipal = roundColones(params.principal);
  const totalInterest = roundColones(initialPrincipal * params.periodRate * params.installments);
  const totalToPay = initialPrincipal + totalInterest;

  const basePayment = roundColones(totalToPay / params.installments);
  const baseInterest = roundColones(totalInterest / params.installments);

  let balance = initialPrincipal;
  let remainingInterest = totalInterest;
  let paymentDate = new Date(params.firstPaymentDate);

  for (let i = 1; i <= params.installments; i += 1) {
    const isLast = i === params.installments;
    const interest = isLast ? remainingInterest : Math.min(baseInterest, remainingInterest);
    const principalPayment = isLast ? balance : Math.min(basePayment - interest, balance);
    const payment = interest + principalPayment;

    remainingInterest = roundColones(remainingInterest - interest);
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
