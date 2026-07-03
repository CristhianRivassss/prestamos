import { describe, expect, it } from "vitest";

import {
  buildFrenchSchedule,
  calculateFrenchInstallment,
} from "@/lib/loan-engine/formulas/french";

describe("formula francesa", () => {
  it("calcula la cuota base con la formula estandar", () => {
    const installment = calculateFrenchInstallment(1_000_000, 0.05, 4);

    expect(Math.round(installment)).toBe(282_012);
  });

  it("cierra el saldo en cero y conserva el capital total", () => {
    const rows = buildFrenchSchedule({
      principal: 1_000_000,
      periodRate: 0.05,
      installments: 4,
      firstPaymentDate: new Date("2026-07-01T00:00:00.000Z"),
      frequency: "quincenal",
      extraPayment: 0,
    });

    const paidPrincipal = rows.reduce((acc, row) => acc + row.principalPayment, 0);
    const lastRow = rows.at(-1);

    expect(rows).toHaveLength(4);
    expect(rows[0].interest).toBe(50_000);
    expect(paidPrincipal).toBe(1_000_000);
    expect(lastRow?.balance).toBe(0);
  });
});
