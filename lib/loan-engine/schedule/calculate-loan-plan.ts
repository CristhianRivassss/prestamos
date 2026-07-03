import { buildFixedSimpleSchedule } from "@/lib/loan-engine/formulas/fixed-simple";
import { buildFlatSchedule } from "@/lib/loan-engine/formulas/flat";
import { buildFrenchSchedule } from "@/lib/loan-engine/formulas/french";
import { buildInterestOnlySchedule } from "@/lib/loan-engine/formulas/interest-only";
import { monthlyPctToPeriodRate } from "@/lib/loan-engine/shared/rate";
import type { LoanInput, LoanSummary, PaymentRow } from "@/lib/loan-engine/types";

export interface LoanPlanResult {
  periodRate: number;
  rows: PaymentRow[];
  summary: LoanSummary;
}

export function calculateLoanPlan(input: LoanInput): LoanPlanResult {
  const periodRate = monthlyPctToPeriodRate(input.monthlyRatePct, input.frequency);

  const baseParams = {
    principal: input.principal,
    periodRate,
    installments: input.installments,
    firstPaymentDate: input.firstPaymentDate,
    frequency: input.frequency,
  };

  const rows =
    input.interestType === "cuota_fija"
      ? buildFrenchSchedule({ ...baseParams, extraPayment: input.extraPayment })
      : input.interestType === "interes_fijo"
        ? buildFixedSimpleSchedule(baseParams)
        : input.interestType === "solo_interes"
          ? buildInterestOnlySchedule(baseParams)
          : buildFlatSchedule(baseParams);

  const totalToPay = rows.reduce((acc, row) => acc + row.payment, 0);
  const totalInterest = rows.reduce((acc, row) => acc + row.interest, 0);
  const lastPaymentDate = rows.length > 0 ? rows[rows.length - 1].date : input.firstPaymentDate;

  return {
    periodRate,
    rows,
    summary: {
      totalToPay,
      totalInterest,
      lastPaymentDate,
    },
  };
}
