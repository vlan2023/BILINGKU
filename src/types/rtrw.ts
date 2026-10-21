export type StatusPelanggan = 'aktif' | 'isolir' | 'suspend' | 'menunggu';

export type StatusTagihan = 'lunas' | 'belum_bayar' | 'lewat_tempo';

export interface PaketPPPoE {
  id: string;
  nama: string;
  kecepatan: string; // e.g. "20 Mbps"
  rateLimit: string; // MikroTik Rate Limit string: "10M/20M" (upload/download)
  harga: number; // e.g. 150000
  poolName: string; // e.g. "pool-pppoe-reguler"
  deskripsi: string;
  jumlahPelanggan?: number;
}

export interface PelangganPPPoE {
  id: string;
  username: string; // PPPoE Username di radcheck
  password: string; // Cleartext / MD5
  namaLengkap: string;
  noHp: string; // Format 08...
  alamat: string;
  rtRw: string;
  odpId: string; // ID ODP
  odpPort: number; // Port di ODP (1-8 / 1-16)
  redamanDbm: number; // e.g. -21.4 dBm
  paketId: string;
  ipType: 'dinamis' | 'statis';
  staticIp?: string;
  macAddress?: string; // Calling-Station-Id lock
  status: StatusPelanggan;
  tanggalPasang: string;
  jatuhTempoHari: number; // Tanggal tagihan bulanan (1-28)
  catatan?: string;
}

export interface SesiOnlineRadius {
  id: string;
  username: string;
  namaLengkap: string;
  ipAddress: string;
  macAddress: string;
  nasIp: string;
  waktuMulai: string;
  durasiDetik: number;
  uploadBytes: number;
  downloadBytes: number;
  paketNama: string;
  odpName: string;
}

export interface TagihanInvoice {
  id: string;
  noInvoice: string;
  pelangganId: string;
  username: string;
  namaPelanggan: string;
  noHp: string;
  periodeBulan: string; // e.g. "Oktober 2026"
  nominal: number;
  status: StatusTagihan;
  tanggalTerbit: string;
  tanggalJatuhTempo: string;
  tanggalBayar?: string;
  metodeBayar?: 'Tunai' | 'Transfer BCA' | 'Transfer BRI' | 'QRIS' | 'DANA';
}

export interface ODPItem {
  id: string;
  nama: string; // e.g. "ODP-RT02-01"
  lokasi: string; // e.g. "Tiang Depan Pos Ronda RT 02"
  totalPort: number; // 8 / 16
  portTerpakai: number;
  oltPon: string; // e.g. "PON 1 / OLT-ZTE-C320"
  status: 'normal' | 'waspada' | 'kritis';
}

export interface RadiusServerConfig {
  serverHost: string;
  authPort: number;
  acctPort: number;
  sharedSecret: string;
  coaPort: number; // Default 3799 RFC 3576
  nasIp: string;
  nasIdentifier: string;
  nasSecret: string;
  dbType: 'MySQL / MariaDB' | 'PostgreSQL' | 'Direct radclient';
  statusKoneksi: 'terhubung' | 'terputus' | 'sinkronisasi';
  terakhirSync: string;
  latencyMs: number;
}
