import React, { useState } from 'react';
import {
  Radio,
  Search,
  Zap,
  Server,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  PowerOff,
  UserCheck
} from 'lucide-react';
import { SesiOnlineRadius, RadiusServerConfig, PelangganPPPoE } from '../types/rtrw';
import { formatBytes, formatDuration } from '../utils/formatters';

interface SesiRadiusViewProps {
  sesiList: SesiOnlineRadius[];
  radiusConfig: RadiusServerConfig;
  pelangganList: PelangganPPPoE[];
  onKickSesi: (id: string, username: string) => void;
  onRefreshSesi: () => void;
  onSimulateLogin: (pelanggan: PelangganPPPoE) => void;
  isRefreshing: boolean;
}

export const SesiRadiusView: React.FC<SesiRadiusViewProps> = ({
  sesiList,
  radiusConfig,
  pelangganList,
  onKickSesi,
  onRefreshSesi,
  onSimulateLogin,
  isRefreshing
}) => {
  const [search, setSearch] = useState('');
  const [selectedPelangganId, setSelectedPelangganId] = useState('');

  const filteredSesi = sesiList.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
      s.ipAddress.includes(search) ||
      s.macAddress.toLowerCase().includes(search.toLowerCase())
  );

  const totalDown = sesiList.reduce((acc, s) => acc + s.downloadBytes, 0);
  const totalUp = sesiList.reduce((acc, s) => acc + s.uploadBytes, 0);

  // Pelanggan yang sedang offline dan aktif
  const offlinePelanggan = pelangganList.filter(
    (p) => p.status === 'aktif' && !sesiList.some((s) => s.username === p.username)
  );

  const handleSimulate = () => {
    if (!selectedPelangganId) return;
    const p = pelangganList.find((item) => item.id === selectedPelangganId);
    if (p) {
      onSimulateLogin(p);
      setSelectedPelangganId('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            Monitoring Sesi PPPoE Online (radacct)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Daftar pengguna yang sedang login & aktif dial-up melalui NAS MikroTik ({radiusConfig.nasIp})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshSesi}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            {isRefreshing ? 'Polling radacct...' : 'Refresh Sesi'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Sesi Aktif Online</span>
            <div className="text-xl font-bold text-white mt-0.5">{sesiList.length} User</div>
            <span className="text-[11px] text-emerald-400 font-mono">Status: Connected</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Total Akumulasi Download</span>
            <div className="text-xl font-bold text-white mt-0.5">{formatBytes(totalDown)}</div>
            <span className="text-[11px] text-slate-400">Acct-Input-Octets</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Total Akumulasi Upload</span>
            <div className="text-xl font-bold text-white mt-0.5">{formatBytes(totalUp)}</div>
            <span className="text-[11px] text-slate-400">Acct-Output-Octets</span>
          </div>
        </div>
      </div>

      {/* Simulasi Login Pelanggan PPPoE (radtest / Access-Request) */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Uji Dial-Up Login PPPoE (Simulasi RADIUS)</div>
            <div className="text-[11px] text-slate-400">
              Pilih klien yang sedang offline untuk menguji proses otentikasi RADIUS dan pembentukan sesi
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPelangganId}
            onChange={(e) => setSelectedPelangganId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 max-w-xs"
          >
            <option value="">-- Pilih Pelanggan Offline --</option>
            {offlinePelanggan.map((p) => (
              <option key={p.id} value={p.id}>
                {p.username} ({p.namaLengkap})
              </option>
            ))}
          </select>
          <button
            onClick={handleSimulate}
            disabled={!selectedPelangganId}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" /> Dial PPPoE
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan PPPoE username, nama, IP Address, atau MAC..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Table of Active Sessions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">User & Profil</th>
                <th className="py-3.5 px-4 font-semibold">Framed IP Address</th>
                <th className="py-3.5 px-4 font-semibold">Calling Station (MAC)</th>
                <th className="py-3.5 px-4 font-semibold">NAS Gateway</th>
                <th className="py-3.5 px-4 font-semibold">Waktu & Uptime</th>
                <th className="py-3.5 px-4 font-semibold">Penggunaan Trafik</th>
                <th className="py-3.5 px-4 font-semibold text-right">RADIUS CoA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSesi.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Tidak ada sesi PPPoE yang aktif sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredSesi.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-mono font-bold text-cyan-300 text-sm">{s.username}</span>
                      </div>
                      <div className="text-slate-300 text-[11px] mt-0.5">{s.namaLengkap}</div>
                      <div className="text-[10px] text-indigo-400">{s.paketNama}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200">
                        {s.ipAddress}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-1">{s.odpName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {s.macAddress}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-mono text-slate-300 text-[11px]">
                        <Server className="w-3 h-3 text-cyan-400" />
                        {s.nasIp}
                      </div>
                      <span className="text-[10px] text-slate-500">Port: pppoe-in</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-200 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatDuration(s.durasiDetik)}
                      </div>
                      <div className="text-[10px] text-slate-500">{s.waktuMulai}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-emerald-400 font-medium">↓ {formatBytes(s.downloadBytes)}</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-indigo-400 font-medium">↑ {formatBytes(s.uploadBytes)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Total: {formatBytes(s.downloadBytes + s.uploadBytes)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onKickSesi(s.id, s.username)}
                        className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition"
                        title="Kirim Disconnect-Request (RFC 3576 / PoD)"
                      >
                        <PowerOff className="w-3 h-3" />
                        Kick (CoA)
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
