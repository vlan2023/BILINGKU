import { PaketPPPoE, PelangganPPPoE, SesiOnlineRadius, TagihanInvoice, ODPItem, RadiusServerConfig } from '../types/rtrw';

export const initialPaketList: PaketPPPoE[] = [
  {
    id: 'pkt-1',
    nama: 'Paket Hemat 10M',
    kecepatan: '10 Mbps',
    rateLimit: '5M/10M',
    harga: 100000,
    poolName: 'pool-pppoe-reguler',
    deskripsi: 'Cocok untuk kebutuhan harian 1-3 perangkat, browsing & streaming standar.',
  },
  {
    id: 'pkt-2',
    nama: 'Paket Keluarga 20M',
    kecepatan: '20 Mbps',
    rateLimit: '10M/20M',
    harga: 150000,
    poolName: 'pool-pppoe-reguler',
    deskripsi: 'Pilihan terfavorit warga RT/RW, lancar YouTube FHD, Zoom, dan Smart TV.',
  },
  {
    id: 'pkt-3',
    nama: 'Paket Super 35M',
    kecepatan: '35 Mbps',
    rateLimit: '15M/35M',
    harga: 200000,
    poolName: 'pool-pppoe-reguler',
    deskripsi: 'Kecepatan tinggi untuk gaming rendah latensi, video 4K, dan unduhan cepat.',
  },
  {
    id: 'pkt-4',
    nama: 'Paket Bisnis UMKM 50M',
    kecepatan: '50 Mbps',
    rateLimit: '25M/50M',
    harga: 300000,
    poolName: 'pool-pppoe-prioritas',
    deskripsi: 'Alokasi bandwidth prioritas untuk warung kopi, toko kelontong, kantor RT/RW.',
  }
];

export const initialOdpList: ODPItem[] = [
  {
    id: 'odp-1',
    nama: 'ODP-RT01-A',
    lokasi: 'Tiang Listrik Depan Masjid Al-Ikhlas RT 01',
    totalPort: 8,
    portTerpakai: 7,
    oltPon: 'PON 1 / OLT-HUAWEI-MA5608T',
    status: 'normal'
  },
  {
    id: 'odp-2',
    nama: 'ODP-RT02-B',
    lokasi: 'Tiang Gerbang Masuk RT 02 / Pos Kamling',
    totalPort: 8,
    portTerpakai: 6,
    oltPon: 'PON 1 / OLT-HUAWEI-MA5608T',
    status: 'normal'
  },
  {
    id: 'odp-3',
    nama: 'ODP-RT03-C',
    lokasi: 'Pertigaan Warung Bu Sri RT 03',
    totalPort: 16,
    portTerpakai: 14,
    oltPon: 'PON 2 / OLT-HUAWEI-MA5608T',
    status: 'waspada'
  },
  {
    id: 'odp-4',
    nama: 'ODP-RT04-D',
    lokasi: 'Tiang Telkom Gang Flamboyan RT 04',
    totalPort: 8,
    portTerpakai: 3,
    oltPon: 'PON 2 / OLT-HUAWEI-MA5608T',
    status: 'normal'
  }
];

export const initialPelangganList: PelangganPPPoE[] = [
  {
    id: 'plg-01',
    username: 'slamet_rt01',
    password: 'net123password',
    namaLengkap: 'Slamet Riyadi',
    noHp: '081234567890',
    alamat: 'Jl. Melati No. 12',
    rtRw: 'RT 01 / RW 03',
    odpId: 'odp-1',
    odpPort: 1,
    redamanDbm: -19.4,
    paketId: 'pkt-2',
    ipType: 'dinamis',
    macAddress: '48:8F:5A:21:4B:01',
    status: 'aktif',
    tanggalPasang: '2025-01-10',
    jatuhTempoHari: 10,
    catatan: 'Modem Fiberhome HG6243C - Lantai 1'
  },
  {
    id: 'plg-02',
    username: 'dimas_rt01',
    password: 'dimasnet2026',
    namaLengkap: 'Dimas Prasetyo',
    noHp: '081398765432',
    alamat: 'Jl. Melati No. 18B',
    rtRw: 'RT 01 / RW 03',
    odpId: 'odp-1',
    odpPort: 2,
    redamanDbm: -18.8,
    paketId: 'pkt-3',
    ipType: 'dinamis',
    macAddress: 'D4:6E:0E:87:62:C3',
    status: 'aktif',
    tanggalPasang: '2025-03-15',
    jatuhTempoHari: 15,
    catatan: 'Modem ZTE F609 - Kabel hitam dropcore 85m'
  },
  {
    id: 'plg-03',
    username: 'warung_busri',
    password: 'warungberkah99',
    namaLengkap: 'Bu Hj. Sri Wahyuni',
    noHp: '085711223344',
    alamat: 'Pertigaan Pasar RT 03',
    rtRw: 'RT 03 / RW 03',
    odpId: 'odp-3',
    odpPort: 4,
    redamanDbm: -21.2,
    paketId: 'pkt-4',
    ipType: 'statis',
    staticIp: '10.20.1.25',
    macAddress: 'CC:2D:E0:11:90:5A',
    status: 'aktif',
    tanggalPasang: '2024-11-05',
    jatuhTempoHari: 5,
    catatan: 'Prioritas, untuk CCTV warung dan transaksi kasir QRIS'
  },
  {
    id: 'plg-04',
    username: 'pak_joko_rt02',
    password: 'jokopppoenet',
    namaLengkap: 'Drs. Joko Susilo (Ketua RT)',
    noHp: '082144556677',
    alamat: 'Jl. Kenanga Blok C No. 5',
    rtRw: 'RT 02 / RW 03',
    odpId: 'odp-2',
    odpPort: 1,
    redamanDbm: -17.5,
    paketId: 'pkt-2',
    ipType: 'dinamis',
    macAddress: 'E8:65:D4:F2:77:99',
    status: 'aktif',
    tanggalPasang: '2024-09-01',
    jatuhTempoHari: 1,
    catatan: 'Router bridge Mikrotik hAP ac2 di rumah'
  },
  {
    id: 'plg-05',
    username: 'hendra_rt02',
    password: 'hendra987net',
    namaLengkap: 'Hendra Gunawan',
    noHp: '087812348901',
    alamat: 'Jl. Kenanga Blok C No. 14',
    rtRw: 'RT 02 / RW 03',
    odpId: 'odp-2',
    odpPort: 3,
    redamanDbm: -23.8,
    paketId: 'pkt-1',
    ipType: 'dinamis',
    macAddress: '70:4F:57:33:12:0A',
    status: 'isolir',
    tanggalPasang: '2025-06-20',
    jatuhTempoHari: 5,
    catatan: 'Terisolir otomatis (Belum bayar tagihan H+5). Dialihkan ke IP Pool Isolir.'
  },
  {
    id: 'plg-06',
    username: 'anita_rt03',
    password: 'anitapassword',
    namaLengkap: 'Anita Rahmawati',
    noHp: '089677889900',
    alamat: 'Gang Anggrek No. 04',
    rtRw: 'RT 03 / RW 03',
    odpId: 'odp-3',
    odpPort: 6,
    redamanDbm: -20.1,
    paketId: 'pkt-2',
    ipType: 'dinamis',
    macAddress: 'BC:A5:11:44:EE:31',
    status: 'aktif',
    tanggalPasang: '2025-08-12',
    jatuhTempoHari: 12,
    catatan: 'Perangkat Huawei HG8245H5'
  },
  {
    id: 'plg-07',
    username: 'budi_santoso_rt04',
    password: 'budirtrwnet',
    namaLengkap: 'Budi Santoso',
    noHp: '085233445566',
    alamat: 'Jl. Flamboyan No. 7',
    rtRw: 'RT 04 / RW 03',
    odpId: 'odp-4',
    odpPort: 2,
    redamanDbm: -19.9,
    paketId: 'pkt-1',
    ipType: 'dinamis',
    status: 'menunggu',
    tanggalPasang: '2026-10-18',
    jatuhTempoHari: 20,
    catatan: 'Menunggu penarikan kabel dropcore oleh teknisi'
  }
];

export const initialSesiOnlineList: SesiOnlineRadius[] = [
  {
    id: 'sesi-1',
    username: 'slamet_rt01',
    namaLengkap: 'Slamet Riyadi',
    ipAddress: '10.20.0.14',
    macAddress: '48:8F:5A:21:4B:01',
    nasIp: '192.168.88.1',
    waktuMulai: 'Hari ini, 06:14 WIB',
    durasiDetik: 54620,
    uploadBytes: 1450200000, // ~1.45 GB
    downloadBytes: 14200000000, // ~14.2 GB
    paketNama: 'Paket Keluarga 20M',
    odpName: 'ODP-RT01-A (Port 1)'
  },
  {
    id: 'sesi-2',
    username: 'dimas_rt01',
    namaLengkap: 'Dimas Prasetyo',
    ipAddress: '10.20.0.19',
    macAddress: 'D4:6E:0E:87:62:C3',
    nasIp: '192.168.88.1',
    waktuMulai: 'Hari ini, 08:30 WIB',
    durasiDetik: 46200,
    uploadBytes: 3100000000, // ~3.1 GB
    downloadBytes: 38400000000, // ~38.4 GB
    paketNama: 'Paket Super 35M',
    odpName: 'ODP-RT01-A (Port 2)'
  },
  {
    id: 'sesi-3',
    username: 'warung_busri',
    namaLengkap: 'Bu Hj. Sri Wahyuni',
    ipAddress: '10.20.1.25',
    macAddress: 'CC:2D:E0:11:90:5A',
    nasIp: '192.168.88.1',
    waktuMulai: 'Kemarin, 21:00 WIB',
    durasiDetik: 87600,
    uploadBytes: 8900000000, // ~8.9 GB
    downloadBytes: 62100000000, // ~62.1 GB
    paketNama: 'Paket Bisnis UMKM 50M',
    odpName: 'ODP-RT03-C (Port 4)'
  },
  {
    id: 'sesi-4',
    username: 'pak_joko_rt02',
    namaLengkap: 'Drs. Joko Susilo',
    ipAddress: '10.20.0.12',
    macAddress: 'E8:65:D4:F2:77:99',
    nasIp: '192.168.88.1',
    waktuMulai: 'Hari ini, 05:45 WIB',
    durasiDetik: 56250,
    uploadBytes: 980000000,
    downloadBytes: 9400000000,
    paketNama: 'Paket Keluarga 20M',
    odpName: 'ODP-RT02-B (Port 1)'
  },
  {
    id: 'sesi-5',
    username: 'anita_rt03',
    namaLengkap: 'Anita Rahmawati',
    ipAddress: '10.20.0.33',
    macAddress: 'BC:A5:11:44:EE:31',
    nasIp: '192.168.88.1',
    waktuMulai: 'Hari ini, 11:20 WIB',
    durasiDetik: 36000,
    uploadBytes: 640000000,
    downloadBytes: 7800000000,
    paketNama: 'Paket Keluarga 20M',
    odpName: 'ODP-RT03-C (Port 6)'
  }
];

export const initialTagihanList: TagihanInvoice[] = [
  {
    id: 'inv-01',
    noInvoice: 'INV/NET/202610/001',
    pelangganId: 'plg-04',
    username: 'pak_joko_rt02',
    namaPelanggan: 'Drs. Joko Susilo',
    noHp: '082144556677',
    periodeBulan: 'Oktober 2026',
    nominal: 150000,
    status: 'lunas',
    tanggalTerbit: '2026-10-01',
    tanggalJatuhTempo: '2026-10-01',
    tanggalBayar: '2026-10-01 09:15',
    metodeBayar: 'Transfer BCA'
  },
  {
    id: 'inv-02',
    noInvoice: 'INV/NET/202610/002',
    pelangganId: 'plg-03',
    username: 'warung_busri',
    namaPelanggan: 'Bu Hj. Sri Wahyuni',
    noHp: '085711223344',
    periodeBulan: 'Oktober 2026',
    nominal: 300000,
    status: 'lunas',
    tanggalTerbit: '2026-10-01',
    tanggalJatuhTempo: '2026-10-05',
    tanggalBayar: '2026-10-04 14:30',
    metodeBayar: 'QRIS'
  },
  {
    id: 'inv-03',
    noInvoice: 'INV/NET/202610/003',
    pelangganId: 'plg-01',
    username: 'slamet_rt01',
    namaPelanggan: 'Slamet Riyadi',
    noHp: '081234567890',
    periodeBulan: 'Oktober 2026',
    nominal: 150000,
    status: 'lunas',
    tanggalTerbit: '2026-10-01',
    tanggalJatuhTempo: '2026-10-10',
    tanggalBayar: '2026-10-09 19:40',
    metodeBayar: 'Tunai'
  },
  {
    id: 'inv-04',
    noInvoice: 'INV/NET/202610/004',
    pelangganId: 'plg-06',
    username: 'anita_rt03',
    namaPelanggan: 'Anita Rahmawati',
    noHp: '089677889900',
    periodeBulan: 'Oktober 2026',
    nominal: 150000,
    status: 'lunas',
    tanggalTerbit: '2026-10-01',
    tanggalJatuhTempo: '2026-10-12',
    tanggalBayar: '2026-10-12 10:00',
    metodeBayar: 'Transfer BRI'
  },
  {
    id: 'inv-05',
    noInvoice: 'INV/NET/202610/005',
    pelangganId: 'plg-02',
    username: 'dimas_rt01',
    namaPelanggan: 'Dimas Prasetyo',
    noHp: '081398765432',
    periodeBulan: 'Oktober 2026',
    nominal: 200000,
    status: 'belum_bayar',
    tanggalTerbit: '2026-10-01',
    tanggalJatuhTempo: '2026-10-15'
  },
  {
    id: 'inv-06',
    noInvoice: 'INV/NET/202610/006',
    pelangganId: 'plg-05',
    username: 'hendra_rt02',
    namaPelanggan: 'Hendra Gunawan',
    noHp: '087812348901',
    periodeBulan: 'Oktober 2026',
    nominal: 100000,
    status: 'lewat_tempo',
    tanggalTerbit: '2026-10-01',
    tanggalJatuhTempo: '2026-10-05'
  }
];

export const initialRadiusConfig: RadiusServerConfig = {
  serverHost: '10.10.10.1',
  authPort: 1812,
  acctPort: 1813,
  sharedSecret: 'radius_rtrwnet_secret_2026',
  coaPort: 3799,
  nasIp: '192.168.88.1',
  nasIdentifier: 'MikroTik-CCR1009-Core',
  nasSecret: 'radius_rtrwnet_secret_2026',
  dbType: 'MySQL / MariaDB',
  statusKoneksi: 'terhubung',
  terakhirSync: 'Baru saja (Real-time)',
  latencyMs: 1.8
};
