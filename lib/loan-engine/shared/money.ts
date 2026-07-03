const crcFormatter = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function roundColones(value: number): number {
  return Math.round(value);
}

export function formatCRC(value: number): string {
  return crcFormatter.format(roundColones(value));
}
