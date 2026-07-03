import { addPaymentPeriod } from "@/lib/loan-engine/shared/dates";
import { roundColones } from "@/lib/loan-engine/shared/money";
import type { PaymentFrequency, PaymentRow } from "@/lib/loan-engine/types";

export function buildFixedSimpleSchedule(params: {
  principal: number;
  periodRate: number;
  installments: number;
  firstPaymentDate: Date;
  frequency: PaymentFrequency;
}): PaymentRow[] {
  const rows: PaymentRow[] = [];
  const initialPrincipal = roundColones(params.principal);
  const fixedInterest = roundColones(initialPrincipal * params.periodRate);
  const basePrincipal = roundColones(initialPrincipal / params.installments);

  let balance = initialPrincipal;
  let paymentDate = new Date(params.firstPaymentDate);

  for (let i = 1; i <= params.installments; i += 1) {
    const principalPayment = i === params.installments ? balance : Math.min(basePrincipal, balance);
    const payment = principalPayment + fixedInterest;

    balance = roundColones(balance - principalPayment);

    rows.push({
      installmentNumber: i,
      date: paymentDate,
      payment,
      interest: fixedInterest,
      principalPayment,
      balance,
    });

    paymentDate = addPaymentPeriod(paymentDate, params.frequency);
  }

  return rows;
}
