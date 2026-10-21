import React, { useState } from 'react';
import {
  Network,
  Plus,
  Server,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  HardDrive
} from 'lucide-react';
import { ODPItem, PelangganPPPoE } from '../types/rtrw';

interface OdpViewProps {
  odpList: ODPItem[];
  pelangganList: PelangganPPPoE[];
  onAddOdp: (odp: Omit<ODPItem, 'id'>) => void;
}

export const OdpView: React.FC<OdpViewProps> = ({
  odpList,
  pelangganList,
  onAddOdp
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    lokasi: '',
    totalPort: 8,
    portTerpakai: 0,
    oltPon: 'PON 1 / OLT-HUAWEI-MA5608T',
    status: 'normal' as 'normal' | 'waspada' | 'kritis'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.lokasi) {
      alert('Mohon isi nama ODP dan lokasi tiang!');
      return;
    }
    onAddOdp(formData);
    setIsModalOpen(false);
  };

  const totalCapacity = odpList.reduce((acc, o) => acc + o.totalPort, 0);
  const totalUsed = pelangganList.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            Peta Distribusi ODP (Optical Distribution Point) & Fiber Optik
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Manajemen alokasi port splitter dropcore, pemantauan redaman optik (dBm), dan jalur OLT
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Pasang ODP Baru
        </button>
      </div>

      {/* Overview Stat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Total Box ODP Terpasang</span>
            <div className="text-xl font-bold text-white mt-0.5">{odpList.length} Titik Tiang</div>
            <span className="text-[11px] text-emerald-400">Jalur FTTH RT/RW Net</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Kapasitas Port Splitter</span>
            <div className="text-xl font-bold text-white mt-0.5">
              {totalUsed} / {totalCapacity} Port
            </div>
            <span className="text-[11px] text-slate-400">
              {totalCapacity - totalUsed} port siap sambung
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Uplink OLT Core</span>
            <div className="text-xl font-bold text-white mt-0.5">EPON / GPON OLT</div>
            <span className="text-[11px] text-cyan-400">2 Port PON Aktif</span>
          </div>
        </div>
      </div>

      {/* Cards of ODP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {odpList.map((odp) => {
          const clientsInThisOdp = pelangganList.filter((p) => p.odpId === odp.id);
          const portCount = odp.totalPort;
          const ports = Array.from({ length: portCount }, (_, i) => i + 1);

          return (
            <div
              key={odp.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                    <h3 className="text-lg font-bold text-white">{odp.nama}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                    {clientsInThisOdp.length} / {odp.totalPort} Port
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{odp.lokasi}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono mb-4">
                  <Server className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{odp.oltPon}</span>
                </div>

                {/* Port Visualizer Grid */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-4">
                  <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                    <span>Visualisasi Port Splitter (1:{odp.totalPort})</span>
                    <span className="text-[10px] text-slate-500">Klik port untuk info pelanggan</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ports.map((portNum) => {
                      const client = clientsInThisOdp.find((p) => p.odpPort === portNum);
                      const isUsed = Boolean(client);
                      const isIsolir = client?.status === 'isolir';

                      let bgColor = 'bg-slate-800/50 text-slate-500 border-slate-700/50';
                      if (isUsed) {
                        bgColor = isIsolir
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                      }

                      return (
                        <div
                          key={portNum}
                          title={
                            client
                              ? `Port ${portNum}: ${client.namaLengkap} (${client.username}) - ${client.redamanDbm} dBm`
                              : `Port ${portNum}: Kosong (Tersedia)`
                          }
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition ${bgColor}`}
                        >
                          <span className="text-[10px] font-mono font-bold">P{portNum}</span>
                          <span className="text-[9px] truncate max-w-full font-mono mt-0.5">
                            {client ? `${client.redamanDbm}dB` : 'OFF'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-emerald-500"></span> Terhubung Aktif
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-rose-500"></span> Terisolir
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-slate-700"></span> Port Kosong
                    </span>
                  </div>
                </div>

                {/* Pelanggan terhubung di ODP ini */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300">Daftar Klien Terhubung:</span>
                  {clientsInThisOdp.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Belum ada pelanggan terpasang di ODP ini.</p>
                  ) : (
                    clientsInThisOdp.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-medium">P{c.odpPort}</span>
                          <span className="text-slate-200">{c.namaLengkap}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span
                            className={
                              c.redamanDbm >= -22
                                ? 'text-emerald-400'
                                : c.redamanDbm >= -25
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }
                          >
                            {c.redamanDbm} dBm
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Pasang ODP Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Tambah Box ODP Baru</h3>
            <p className="text-xs text-slate-400 mb-4">
              Daftarkan titik tiang ODP baru untuk pemetaan jalur fiber dropcore.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama / Kode ODP *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="ODP-RT05-E"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lokasi Tiang / Patokan *</label>
                <input
                  type="text"
                  required
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  placeholder="Tiang PLN Depan Musholla RT 05"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jumlah Port Splitter</label>
                  <select
                    value={formData.totalPort}
                    onChange={(e) => setFormData({ ...formData, totalPort: parseInt(e.target.value) || 8 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={8}>8 Port (1:8)</option>
                    <option value={16}>16 Port (1:16)</option>
                    <option value={24}>24 Port (1:24)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Uplink OLT PON</label>
                  <input
                    type="text"
                    value={formData.oltPon}
                    onChange={(e) => setFormData({ ...formData, oltPon: e.target.value })}
                    placeholder="PON 1 / OLT-CORE"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Simpan ODP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
