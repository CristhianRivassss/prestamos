export type PaymentFrequency = "diario" | "semanal" | "quincenal" | "mensual";

export type InterestType =
  | "interes_fijo"
  | "cuota_fija"
  | "solo_interes"
  | "interes_flat";

export interface LoanInput {
  principal: number;
  monthlyRatePct: number;
  frequency: PaymentFrequency;
  installments: number;
  firstPaymentDate: Date;
  disbursementDate: Date;
  interestType: InterestType;
  extraPayment: number;
}

export interface PaymentRow {
  installmentNumber: number;
  date: Date;
  payment: number;
  interest: number;
  principalPayment: number;
  balance: number;
}

export interface LoanSummary {
  totalToPay: number;
  totalInterest: number;
  lastPaymentDate: Date;
}
