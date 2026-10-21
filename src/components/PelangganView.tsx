import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Phone,
  MapPin,
  Wifi,
  Trash2,
  Edit2,
  ExternalLink,
  Lock,
  Radio,
  FileText
} from 'lucide-react';
import { PelangganPPPoE, PaketPPPoE, ODPItem, StatusPelanggan } from '../types/rtrw';
import { formatRupiah } from '../utils/formatters';

interface PelangganViewProps {
  pelangganList: PelangganPPPoE[];
  paketList: PaketPPPoE[];
  odpList: ODPItem[];
  onAddPelanggan: (pelanggan: Omit<PelangganPPPoE, 'id'>) => void;
  onUpdatePelanggan: (pelanggan: PelangganPPPoE) => void;
  onDeletePelanggan: (id: string, username: string) => void;
  onToggleIsolir: (pelanggan: PelangganPPPoE) => void;
  onPrintSpk: (pelanggan: PelangganPPPoE) => void;
}

export const PelangganView: React.FC<PelangganViewProps> = ({
  pelangganList,
  paketList,
  odpList,
  onAddPelanggan,
  onUpdatePelanggan,
  onDeletePelanggan,
  onToggleIsolir,
  onPrintSpk
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [filterOdp, setFilterOdp] = useState<string>('semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPelanggan, setEditingPelanggan] = useState<PelangganPPPoE | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    namaLengkap: '',
    noHp: '',
    alamat: '',
    rtRw: 'RT 01 / RW 03',
    odpId: odpList[0]?.id || '',
    odpPort: 1,
    redamanDbm: -19.5,
    paketId: paketList[0]?.id || '',
    ipType: 'dinamis' as 'dinamis' | 'statis',
    staticIp: '',
    macAddress: '',
    status: 'aktif' as StatusPelanggan,
    tanggalPasang: new Date().toISOString().split('T')[0],
    jatuhTempoHari: 10,
    catatan: ''
  });

  const openAddModal = () => {
    setEditingPelanggan(null);
    setFormData({
      username: '',
      password: 'net' + Math.floor(1000 + Math.random() * 9000),
      namaLengkap: '',
      noHp: '',
      alamat: '',
      rtRw: 'RT 01 / RW 03',
      odpId: odpList[0]?.id || '',
      odpPort: 1,
      redamanDbm: -19.5,
      paketId: paketList[0]?.id || '',
      ipType: 'dinamis',
      staticIp: '',
      macAddress: '',
      status: 'aktif',
      tanggalPasang: new Date().toISOString().split('T')[0],
      jatuhTempoHari: 10,
      catatan: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: PelangganPPPoE) => {
    setEditingPelanggan(p);
    setFormData({
      username: p.username,
      password: p.password,
      namaLengkap: p.namaLengkap,
      noHp: p.noHp,
      alamat: p.alamat,
      rtRw: p.rtRw,
      odpId: p.odpId,
      odpPort: p.odpPort,
      redamanDbm: p.redamanDbm,
      paketId: p.paketId,
      ipType: p.ipType,
      staticIp: p.staticIp || '',
      macAddress: p.macAddress || '',
      status: p.status,
      tanggalPasang: p.tanggalPasang,
      jatuhTempoHari: p.jatuhTempoHari,
      catatan: p.catatan || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.namaLengkap || !formData.password) {
      alert('Mohon isi username, password, dan nama lengkap pelanggan!');
      return;
    }

    if (editingPelanggan) {
      onUpdatePelanggan({
        ...editingPelanggan,
        ...formData
      });
    } else {
      onAddPelanggan(formData);
    }
    setIsModalOpen(false);
  };

  const filteredPelanggan = pelangganList.filter((p) => {
    const matchSearch =
      p.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noHp.includes(searchTerm) ||
      p.alamat.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'semua' || p.status === filterStatus;
    const matchOdp = filterOdp === 'semua' || p.odpId === filterOdp;

    return matchSearch && matchStatus && matchOdp;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Manajemen Pelanggan PPPoE
          </h2>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrasi Pelanggan Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, PPPoE username, No HP, atau alamat..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Status: Aktif</option>
            <option value="isolir">Status: Terisolir</option>
            <option value="menunggu">Status: Menunggu</option>
          </select>

          <select
            value={filterOdp}
            onChange={(e) => setFilterOdp(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="semua">Semua ODP</option>
            {odpList.map((odp) => (
              <option key={odp.id} value={odp.id}>
                {odp.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Daftar Pelanggan */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Pelanggan & Username PPPoE</th>
                <th className="py-3.5 px-4 font-semibold">Paket & IP Binding</th>
                <th className="py-3.5 px-4 font-semibold">ODP & Redaman</th>
                <th className="py-3.5 px-4 font-semibold">Kontak & Lokasi</th>
                <th className="py-3.5 px-4 font-semibold">Jatuh Tempo</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPelanggan.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Tidak ada data pelanggan yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredPelanggan.map((p) => {
                  const paket = paketList.find((pk) => pk.id === p.paketId);
                  const odp = odpList.find((o) => o.id === p.odpId);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      {/* Pelanggan & Akun */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">{p.namaLengkap}</div>
                        <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px] text-cyan-400">
                          <Radio className="w-3 h-3 text-cyan-500" />
                          <span>{p.username}</span>
                          <span className="text-slate-600">/</span>
                          <span className="text-slate-500 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> {p.password}
                          </span>
                        </div>
                      </td>

                      {/* Paket & IP */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/20 text-[11px]">
                          {paket ? `${paket.nama} (${paket.rateLimit})` : 'Paket Standar'}
                        </span>
                        <div className="font-mono text-[11px] text-slate-400 mt-1">
                          {p.ipType === 'statis' ? (
                            <span className="text-amber-400">IP: {p.staticIp} (Statis)</span>
                          ) : (
                            <span className="text-slate-400">IP: Dinamis Pool</span>
                          )}
                        </div>
                        {p.macAddress && (
                          <div className="text-[10px] font-mono text-slate-500">MAC: {p.macAddress}</div>
                        )}
                      </td>

                      {/* ODP & Redaman */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-300">
                          {odp ? odp.nama : 'ODP-?'} (Port {p.odpPort})
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className={`text-[11px] font-mono font-medium ${
                              p.redamanDbm >= -22
                                ? 'text-emerald-400'
                                : p.redamanDbm >= -25
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {p.redamanDbm} dBm
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {p.redamanDbm >= -22 ? '(Bagus)' : '(Waspada)'}
                          </span>
                        </div>
                      </td>

                      {/* Kontak & Alamat */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{p.alamat}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.rtRw}</div>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-cyan-400">
                          <Phone className="w-3 h-3" />
                          <a
                            href={`https://wa.me/62${p.noHp.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline flex items-center gap-0.5"
                          >
                            {p.noHp}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>

                      {/* Jatuh Tempo */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-300">Tgl {p.jatuhTempoHari}</span>
                        <div className="text-[11px] text-slate-500">Tiap bulan</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {p.status === 'aktif' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> Aktif
                          </span>
                        )}
                        {p.status === 'isolir' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ShieldAlert className="w-3 h-3" /> Isolir (CoA)
                          </span>
                        )}
                        {p.status === 'menunggu' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Menunggu
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Isolir */}
                          <button
                            onClick={() => onToggleIsolir(p)}
                            title={p.status === 'isolir' ? 'Buka Isolir Pelanggan' : 'Isolir Pelanggan (Putus Sesi CoA)'}
                            className={`p-1.5 rounded-lg border transition ${
                              p.status === 'isolir'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                            }`}
                          >
                            {p.status === 'isolir' ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldAlert className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* SPK Pemasangan */}
                          <button
                            onClick={() => onPrintSpk(p)}
                            title="Cetak Form Pemasangan / SPK"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Data Pelanggan"
                            className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700 hover:text-indigo-300 hover:bg-slate-700 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeletePelanggan(p.id, p.username)}
                            title="Hapus dari RADIUS"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-500 border border-slate-700 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <h3 className="text-lg font-bold text-white mb-1">
              {editingPelanggan ? 'Edit Pelanggan PPPoE' : 'Registrasi Pelanggan PPPoE Baru'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Data akan disinkronkan langsung ke tabel FreeRADIUS (radcheck, radusergroup, radreply).
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Akun PPPoE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username PPPoE (radcheck) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="misal: slamet_rt01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password PPPoE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Kata sandi rahasia"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2: Nama & HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap Pelanggan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    placeholder="Nama kepala keluarga / pemilik"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    placeholder="081234567890"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 3: Alamat & RT/RW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alamat / No. Rumah
                  </label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Jl. Melati No. 12"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Wilayah RT / RW
                  </label>
                  <input
                    type="text"
                    value={formData.rtRw}
                    onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                    placeholder="RT 01 / RW 03"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 4: Paket & Alokasi IP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pilihan Paket PPPoE (radusergroup)
                  </label>
                  <select
                    value={formData.paketId}
                    onChange={(e) => setFormData({ ...formData, paketId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {paketList.map((pkt) => (
                      <option key={pkt.id} value={pkt.id}>
                        {pkt.nama} ({pkt.rateLimit}) - {formatRupiah(pkt.harga)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipe Alokasi IP
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ipType: 'dinamis' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                        formData.ipType === 'dinamis'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      Dinamis Pool
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ipType: 'statis' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border ${
                        formData.ipType === 'statis'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      IP Statis
                    </button>
                  </div>
                </div>
              </div>

              {formData.ipType === 'statis' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Framed-IP-Address (Statis)
                  </label>
                  <input
                    type="text"
                    value={formData.staticIp}
                    onChange={(e) => setFormData({ ...formData, staticIp: e.target.value })}
                    placeholder="10.20.1.25"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Row 5: ODP, Port & Redaman */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ODP (Optical Box)
                  </label>
                  <select
                    value={formData.odpId}
                    onChange={(e) => setFormData({ ...formData, odpId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {odpList.map((odp) => (
                      <option key={odp.id} value={odp.id}>
                        {odp.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor Port ODP
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={formData.odpPort}
                    onChange={(e) => setFormData({ ...formData, odpPort: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Redaman Optik (dBm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.redamanDbm}
                    onChange={(e) => setFormData({ ...formData, redamanDbm: parseFloat(e.target.value) || -20 })}
                    placeholder="-19.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 6: Binding MAC & Jatuh Tempo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Lock MAC Address (Calling-Station-Id)
                  </label>
                  <input
                    type="text"
                    value={formData.macAddress}
                    onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                    placeholder="48:8F:5A:21:4B:01 (Opsional)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500">Mencegah akun dipindah ke router lain</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tanggal Jatuh Tempo Bulanan
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={formData.jatuhTempoHari}
                    onChange={(e) => setFormData({ ...formData, jatuhTempoHari: parseInt(e.target.value) || 10 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
                >
                  {editingPelanggan ? 'Simpan Perubahan' : 'Daftarkan ke RADIUS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
