export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return `${h}j ${m}m`;
  }
  return `${m}m`;
}

export function generateWhatsAppMessage(
  nama: string,
  noInvoice: string,
  nominal: number,
  periode: string,
  jatuhTempo: string,
  status: string
): string {
  const greeting = `Halo Bpk/Ibu *${nama}*,\n\n`;
  const info =
    `Pemberitahuan tagihan internet *V-LAN.net* PPPoE Anda:\n` +
    `• *No. Tagihan*: ${noInvoice}\n` +
    `• *Periode*: ${periode}\n` +
    `• *Total Tagihan*: ${formatRupiah(nominal)}\n` +
    `• *Jatuh Tempo*: ${jatuhTempo}\n` +
    `• *Status*: ${status.toUpperCase()}\n\n`;

  const footer =
    `Pembayaran dapat ditransfer via:\n` +
    `• BCA: 123-456-7890 (a.n V-LAN.net Mandiri)\n` +
    `• BRI: 0987-01-023456-53-1\n` +
    `• QRIS / Tunai ke kantor operasional V-LAN.net.\n\n` +
    `Mohon kirimkan bukti transfer setelah pembayaran. Terima kasih! 🙏`;

  return encodeURIComponent(greeting + info + footer);
}
