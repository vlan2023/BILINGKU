import React, { useState } from 'react';
import {
  Users,
  Radio,
  CreditCard,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  Activity,
  ArrowRight,
  X
} from 'lucide-react';
import { PelangganPPPoE, SesiOnlineRadius, TagihanInvoice, RadiusServerConfig, PaketPPPoE } from '../types/rtrw';
import { formatRupiah, formatBytes, formatDuration } from '../utils/formatters';

interface DashboardViewProps {
  pelangganList: PelangganPPPoE[];
  sesiOnlineList: SesiOnlineRadius[];
  tagihanList: TagihanInvoice[];
  paketList: PaketPPPoE[];
  radiusConfig: RadiusServerConfig;
  onNavigate: (tab: string) => void;
  onAutoIsolir: () => void;
  onKickSesi: (id: string, username: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  pelangganList,
  sesiOnlineList,
  tagihanList,
  paketList,
  radiusConfig,
  onNavigate,
  onAutoIsolir,
  onKickSesi
}) => {
  const totalPelanggan = pelangganList.length;
  const pelangganAktif = pelangganList.filter((p) => p.status === 'aktif').length;
  const pelangganIsolir = pelangganList.filter((p) => p.status === 'isolir').length;
  const pelangganMenunggu = pelangganList.filter((p) => p.status === 'menunggu').length;

  const totalTagihanBulanIni = tagihanList.reduce((acc, curr) => acc + curr.nominal, 0);
  const tagihanLunas = tagihanList
    .filter((t) => t.status === 'lunas')
    .reduce((acc, curr) => acc + curr.nominal, 0);
  const tagihanTertunggak = tagihanList
    .filter((t) => t.status === 'lewat_tempo' || t.status === 'belum_bayar')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalDownloadBytes = sesiOnlineList.reduce((acc, s) => acc + s.downloadBytes, 0);
  const totalUploadBytes = sesiOnlineList.reduce((acc, s) => acc + s.uploadBytes, 0);

  const tagihanLewatTempoList = tagihanList.filter((t) => t.status === 'lewat_tempo');

  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Alert Banner jika ada tagihan jatuh tempo / isolir */}
      {!isAlertDismissed && tagihanLewatTempoList.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                Terdapat {tagihanLewatTempoList.length} Tagihan Lewat Jatuh Tempo
              </h4>
              <p className="text-xs text-amber-300/80">
                Total tunggakan: {formatRupiah(tagihanTertunggak)}. Anda dapat menjalankan pemutusan sesi otomatis (RADIUS CoA) dan alihkan ke profil isolir.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAutoIsolir}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              Eksekusi Isolir (CoA Disconnect)
            </button>
            <button
              onClick={() => onNavigate('billing')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700"
            >
              Lihat Tagihan
            </button>
            <button
              onClick={() => setIsAlertDismissed(true)}
              className="p-1.5 rounded-lg text-amber-400 hover:text-white hover:bg-amber-900/40 transition"
              title="Tutup Peringatan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid 4 Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Pelanggan PPPoE */}
        <div
          onClick={() => onNavigate('pelanggan')}
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 p-5 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pelanggan PPPoE</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">{totalPelanggan} Klien</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-medium">{pelangganAktif} Aktif</span>
              <span className="text-slate-600">•</span>
              <span className="text-rose-400 font-medium">{pelangganIsolir} Isolir</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-medium">{pelangganMenunggu} Antre</span>
            </div>
          </div>
        </div>

        {/* Card 2: Sesi Online RADIUS (radacct) */}
        <div
          onClick={() => onNavigate('sesi')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Sesi Online (radacct)</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-cyan-300 tracking-tight flex items-center gap-2">
              {sesiOnlineList.length}
              <span className="text-xs font-normal text-slate-400">/ {pelangganAktif} aktif</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Koneksi Real-time NAS {radiusConfig.nasIp}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Keuangan & Pendapatan */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Omzet Bulan Ini</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">{formatRupiah(tagihanLunas)}</div>
            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
              <span>Target: {formatRupiah(totalTagihanBulanIni)}</span>
              <span className="text-emerald-400 font-semibold">
                {Math.round((tagihanLunas / (totalTagihanBulanIni || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: RADIUS Gateway & Latency */}
        <div
          onClick={() => onNavigate('radius')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-5 rounded-2xl transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Server RADIUS</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
              <span>Port: 1812/1813</span>
              <span className="text-purple-300 font-mono">{radiusConfig.latencyMs} ms latensi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Throughput & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bandwidth Monitor Box */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Akumulasi Bandwidth & Trafik PPPoE Hari Ini
              </h3>
              <p className="text-xs text-slate-400">Total data transfer pengguna aktif terdaftar di radacct</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Interface: pppoe-in
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Total Download (In)</span>
                <div className="text-xl font-bold text-white mt-0.5">{formatBytes(totalDownloadBytes)}</div>
                <span className="text-[11px] text-cyan-400">Akumulasi seluruh sesi</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Total Upload (Out)</span>
                <div className="text-xl font-bold text-white mt-0.5">{formatBytes(totalUploadBytes)}</div>
                <span className="text-[11px] text-indigo-400">Akumulasi seluruh sesi</span>
              </div>
            </div>
          </div>

          {/* Distribusi Paket Langganan */}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-3">Distribusi Paket PPPoE Pelanggan</h4>
            <div className="space-y-2.5">
              {paketList.map((pkt) => {
                const count = pelangganList.filter((p) => p.paketId === pkt.id).length;
                const percentage = Math.round((count / (totalPelanggan || 1)) * 100);
                return (
                  <div key={pkt.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        {pkt.nama} ({pkt.rateLimit})
                      </span>
                      <span className="text-slate-400">
                        {count} pelanggan ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Operations & Shortcuts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              Operasional Cepat NOC
            </h3>
            <p className="text-xs text-slate-400 mb-4">Aksi otomatisasi router & manajemen RT/RW</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('pelanggan')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Registrasi Pelanggan PPPoE Baru</div>
                  <div className="text-[11px] text-slate-400">Input akun radcheck, password & ODP port</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onAutoIsolir}
                className="w-full p-3 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-rose-300">Isolir Otomatis Pelanggan Menunggak</div>
                  <div className="text-[11px] text-rose-400/80">Kirim CoA disconnect ke MikroTik (RFC 3576)</div>
                </div>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </button>

              <button
                onClick={() => onNavigate('billing')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Buat Tagihan Periode Baru</div>
                  <div className="text-[11px] text-slate-400">Generate invoice massal & link WhatsApp</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('radius')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">Generator Script MikroTik RouterOS</div>
                  <div className="text-[11px] text-slate-400">Salin skrip konfigurasi /radius & /ppp</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Protokol: PAP / CHAP / MS-CHAPv2</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> RADIUS Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sesi Online Terkini (Preview Tabel) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Sesi PPPoE Online Terkini ({sesiOnlineList.length} Pengguna)
            </h3>
            <p className="text-xs text-slate-400">Pantauan langsung dari tabel radacct RADIUS Server</p>
          </div>
          <button
            onClick={() => onNavigate('sesi')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            Lihat Sesi Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">PPPoE User</th>
                <th className="pb-3 font-semibold">Nama Pelanggan</th>
                <th className="pb-3 font-semibold">IP Assigned</th>
                <th className="pb-3 font-semibold">Calling Station (MAC)</th>
                <th className="pb-3 font-semibold">Uptime</th>
                <th className="pb-3 font-semibold">Trafik (DL / UL)</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sesiOnlineList.slice(0, 5).map((sesi) => (
                <tr key={sesi.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-medium text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {sesi.username}
                  </td>
                  <td className="py-3 text-slate-200">{sesi.namaLengkap}</td>
                  <td className="py-3 font-mono text-slate-300">{sesi.ipAddress}</td>
                  <td className="py-3 font-mono text-slate-400">{sesi.macAddress}</td>
                  <td className="py-3 text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {formatDuration(sesi.durasiDetik)}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">
                    <span className="text-emerald-400 font-medium">↓ {formatBytes(sesi.downloadBytes)}</span>
                    <span className="mx-1 text-slate-600">/</span>
                    <span className="text-indigo-400 font-medium">↑ {formatBytes(sesi.uploadBytes)}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onKickSesi(sesi.id, sesi.username)}
                      className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded font-medium text-[11px] transition"
                      title="Kirim RADIUS Packet of Disconnect (PoD / CoA)"
                    >
                      Kick (CoA)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
