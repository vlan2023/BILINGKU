import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Cpu,
  Users,
  Code
} from 'lucide-react';
import { PaketPPPoE, PelangganPPPoE } from '../types/rtrw';
import { formatRupiah } from '../utils/formatters';

interface PaketViewProps {
  paketList: PaketPPPoE[];
  pelangganList: PelangganPPPoE[];
  onAddPaket: (paket: Omit<PaketPPPoE, 'id'>) => void;
  onUpdatePaket: (paket: PaketPPPoE) => void;
  onDeletePaket: (id: string) => void;
}

export const PaketView: React.FC<PaketViewProps> = ({
  paketList,
  pelangganList,
  onAddPaket,
  onUpdatePaket,
  onDeletePaket
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaket, setEditingPaket] = useState<PaketPPPoE | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    kecepatan: '',
    rateLimit: '',
    harga: 150000,
    poolName: 'pool-pppoe-reguler',
    deskripsi: ''
  });

  const openAddModal = () => {
    setEditingPaket(null);
    setFormData({
      nama: '',
      kecepatan: '20 Mbps',
      rateLimit: '10M/20M',
      harga: 150000,
      poolName: 'pool-pppoe-reguler',
      deskripsi: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: PaketPPPoE) => {
    setEditingPaket(p);
    setFormData({
      nama: p.nama,
      kecepatan: p.kecepatan,
      rateLimit: p.rateLimit,
      harga: p.harga,
      poolName: p.poolName,
      deskripsi: p.deskripsi
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.rateLimit) {
      alert('Mohon isi nama paket dan rate-limit!');
      return;
    }

    if (editingPaket) {
      onUpdatePaket({
        ...editingPaket,
        ...formData
      });
    } else {
      onAddPaket(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Paket Kecepatan & Profil PPPoE (radgroupreply)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Konfigurasi atribut RADIUS (Mikrotik-Rate-Limit, Framed-Pool) untuk pembatasan bandwidth otomatis
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket Baru
        </button>
      </div>

      {/* Grid Paket */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paketList.map((pkt) => {
          const userCount = pelangganList.filter((p) => p.paketId === pkt.id).length;
          return (
            <div
              key={pkt.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                    {pkt.kecepatan}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(pkt)}
                      className="p-1 rounded text-slate-400 hover:text-white transition"
                      title="Edit Paket"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePaket(pkt.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">{pkt.nama}</h3>
                <div className="text-xl font-extrabold text-cyan-400 mt-1">
                  {formatRupiah(pkt.harga)}
                  <span className="text-xs font-normal text-slate-400"> / bulan</span>
                </div>

                <p className="text-xs text-slate-400 mt-3 leading-relaxed">{pkt.deskripsi}</p>

                {/* Technical RADIUS Attributes */}
                <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Rate-Limit:</span>
                    <span className="text-emerald-400 font-bold">{pkt.rateLimit}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Framed-Pool:</span>
                    <span className="text-indigo-400">{pkt.poolName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Users className="w-4 h-4 text-slate-500" />
                  {userCount} Pelanggan
                </span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> RADIUS Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Box: How RADIUS Mikrotik-Rate-Limit works */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-cyan-400" />
          Struktur Atribut RADIUS untuk PPPoE MikroTik
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Atribut <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">Mikrotik-Rate-Limit</code> dikirimkan
          oleh RADIUS Server kepada MikroTik saat klien melakukan dial-up (Access-Accept). MikroTik secara otomatis membuat
          dynamic Simple Queue dengan batasan upload (Rx) dan download (Tx).
        </p>
        <div className="mt-3 p-3 bg-slate-950 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto">
          <code>
            INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES<br />
            &nbsp; ('Paket_20M', 'Mikrotik-Rate-Limit', ':=', '10M/20M'),<br />
            &nbsp; ('Paket_20M', 'Framed-Pool', ':=', 'pool-pppoe-reguler');
          </code>
        </div>
      </div>

      {/* Modal Add / Edit Paket */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              {editingPaket ? 'Edit Paket PPPoE' : 'Tambah Paket PPPoE Baru'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Parameter ini menentukan batasan kecepatan yang disuntikkan ke Router MikroTik.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Paket *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="misal: Paket Gamers 50M"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Label Kecepatan</label>
                  <input
                    type="text"
                    required
                    value={formData.kecepatan}
                    onChange={(e) => setFormData({ ...formData, kecepatan: e.target.value })}
                    placeholder="20 Mbps"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mikrotik-Rate-Limit (Rx/Tx) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rateLimit}
                    onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                    placeholder="10M/20M"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Harga Bulanan (Rp) *</label>
                  <input
                    type="number"
                    required
                    step={10000}
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Framed-Pool IP</label>
                  <input
                    type="text"
                    value={formData.poolName}
                    onChange={(e) => setFormData({ ...formData, poolName: e.target.value })}
                    placeholder="pool-pppoe-reguler"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Paket</label>
                <textarea
                  rows={2}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Keterangan alokasi bandwidth atau peruntukan pelanggan..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
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
                  {editingPaket ? 'Simpan Perubahan' : 'Buat Paket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
