import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  MessageCircle,
  CreditCard,
  Plus,
  ShieldAlert,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { TagihanInvoice, PelangganPPPoE, PaketPPPoE, StatusTagihan } from '../types/rtrw';
import { formatRupiah, generateWhatsAppMessage } from '../utils/formatters';

interface BillingViewProps {
  tagihanList: TagihanInvoice[];
  pelangganList: PelangganPPPoE[];
  paketList: PaketPPPoE[];
  onBayarTagihan: (id: string, metode: 'Tunai' | 'Transfer BCA' | 'Transfer BRI' | 'QRIS' | 'DANA') => void;
  onGenerateBulkInvoice: (periode: string) => void;
  onOpenStruk: (tagihan: TagihanInvoice) => void;
  onAutoIsolir: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  tagihanList,
  pelangganList,
  paketList,
  onBayarTagihan,
  onGenerateBulkInvoice,
  onOpenStruk,
  onAutoIsolir
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [selectedTagihanForPayment, setSelectedTagihanForPayment] = useState<TagihanInvoice | null>(null);
  const [metodeBayar, setMetodeBayar] = useState<'Tunai' | 'Transfer BCA' | 'Transfer BRI' | 'QRIS' | 'DANA'>('Tunai');

  // New Invoice modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkPeriode, setBulkPeriode] = useState('November 2026');

  const totalInvoice = tagihanList.length;
  const totalNominal = tagihanList.reduce((acc, t) => acc + t.nominal, 0);
  const lunasNominal = tagihanList.filter((t) => t.status === 'lunas').reduce((acc, t) => acc + t.nominal, 0);
  const belumNominal = tagihanList.filter((t) => t.status !== 'lunas').reduce((acc, t) => acc + t.nominal, 0);

  const filteredTagihan = tagihanList.filter((t) => {
    const matchSearch =
      t.namaPelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.noInvoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.noHp.includes(searchTerm);

    const matchStatus = filterStatus === 'semua' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleConfirmPayment = () => {
    if (!selectedTagihanForPayment) return;
    onBayarTagihan(selectedTagihanForPayment.id, metodeBayar);
    setSelectedTagihanForPayment(null);
  };

  const handleGenerateBulk = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateBulkInvoice(bulkPeriode);
    setIsBulkModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-400" />
            Billing & Manajemen Tagihan Internet
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Pencatatan invoice bulanan, status pembayaran, cetak bukti struk kasir, dan integrasi WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Generate Tagihan Bulanan
          </button>
          <button
            onClick={onAutoIsolir}
            className="px-3.5 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Auto-Isolir Penunggak
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Tagihan ({totalInvoice} Invoice)</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{formatRupiah(totalNominal)}</div>
          <div className="text-xs text-slate-500 mt-1">Periode aktif seluruh klien</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tagihan Sudah Terbayar (Lunas)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{formatRupiah(lunasNominal)}</div>
          <div className="text-xs text-slate-400 mt-1">
            {Math.round((lunasNominal / (totalNominal || 1)) * 100)}% dari target penerimaan
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Belum Bayar / Tertunggak</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{formatRupiah(belumNominal)}</div>
          <div className="text-xs text-slate-400 mt-1">Perlu pengingat tagihan WhatsApp</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari no invoice, nama pelanggan, username PPPoE, atau no HP..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="semua">Semua Status Tagihan</option>
          <option value="lunas">Status: Lunas</option>
          <option value="belum_bayar">Status: Belum Bayar</option>
          <option value="lewat_tempo">Status: Lewat Jatuh Tempo</option>
        </select>
      </div>

      {/* Invoice Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">No. Invoice & Periode</th>
                <th className="py-3.5 px-4 font-semibold">Pelanggan & Username</th>
                <th className="py-3.5 px-4 font-semibold">Nominal</th>
                <th className="py-3.5 px-4 font-semibold">Jatuh Tempo</th>
                <th className="py-3.5 px-4 font-semibold">Status Tagihan</th>
                <th className="py-3.5 px-4 font-semibold">Waktu / Metode Bayar</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTagihan.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Tidak ada tagihan yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredTagihan.map((t) => {
                  const waUrl = `https://wa.me/62${t.noHp.replace(/^0/, '')}?text=${generateWhatsAppMessage(
                    t.namaPelanggan,
                    t.noInvoice,
                    t.nominal,
                    t.periodeBulan,
                    t.tanggalJatuhTempo,
                    t.status === 'lunas' ? 'LUNAS (Terima Kasih)' : 'BELUM DIBAYAR'
                  )}`;

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-200">{t.noInvoice}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{t.periodeBulan}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{t.namaPelanggan}</div>
                        <div className="font-mono text-[11px] text-cyan-400 mt-0.5">{t.username}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-white text-sm">
                        {formatRupiah(t.nominal)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-medium">{t.tanggalJatuhTempo}</div>
                        <div className="text-[10px] text-slate-500">Terbit: {t.tanggalTerbit}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {t.status === 'lunas' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Lunas
                          </span>
                        )}
                        {t.status === 'belum_bayar' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" /> Belum Bayar
                          </span>
                        )}
                        {t.status === 'lewat_tempo' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <AlertTriangle className="w-3 h-3" /> Lewat Tempo
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {t.status === 'lunas' ? (
                          <div>
                            <span className="text-slate-300 font-medium">{t.metodeBayar || 'Tunai'}</span>
                            <div className="text-[10px] text-slate-500">{t.tanggalBayar || '-'}</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Bayar button if not lunas */}
                          {t.status !== 'lunas' ? (
                            <button
                              onClick={() => setSelectedTagihanForPayment(t)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                            >
                              <CreditCard className="w-3.5 h-3.5" /> Bayar
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenStruk(t)}
                              title="Cetak Tanda Terima / Nota Kasir"
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                            >
                              <Printer className="w-3.5 h-3.5" /> Struk
                            </button>
                          )}

                          {/* WhatsApp Reminder */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Kirim Nota / Tagihan via WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/40 transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
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

      {/* Modal Bayar Tagihan */}
      {selectedTagihanForPayment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Konfirmasi Pembayaran Tagihan</h3>
            <p className="text-xs text-slate-400 mb-4">
              Setelah pembayaran berhasil, status pelanggan akan dipulihkan dari isolir secara otomatis.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 mb-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">No. Invoice:</span>
                <span className="font-mono text-white font-medium">{selectedTagihanForPayment.noInvoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pelanggan:</span>
                <span className="text-white font-medium">{selectedTagihanForPayment.namaPelanggan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PPPoE User:</span>
                <span className="font-mono text-cyan-400 font-medium">{selectedTagihanForPayment.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Periode:</span>
                <span className="text-white font-medium">{selectedTagihanForPayment.periodeBulan}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                <span className="text-slate-300 font-semibold">Total Tagihan:</span>
                <span className="text-emerald-400 font-bold">{formatRupiah(selectedTagihanForPayment.nominal)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Tunai', 'Transfer BCA', 'Transfer BRI', 'QRIS', 'DANA'] as const).map((metode) => (
                  <button
                    key={metode}
                    type="button"
                    onClick={() => setMetodeBayar(metode)}
                    className={`p-2.5 rounded-xl text-xs font-medium border text-left transition ${
                      metodeBayar === metode
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {metode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTagihanForPayment(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20"
              >
                Simpan & Tandai Lunas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generate Bulk Invoice */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Generate Tagihan Bulanan Massal</h3>
            <p className="text-xs text-slate-400 mb-4">
              Sistem akan membuat tagihan baru untuk semua pelanggan aktif PPPoE sesuai paket masing-masing.
            </p>

            <form onSubmit={handleGenerateBulk} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Periode Tagihan</label>
                <input
                  type="text"
                  required
                  value={bulkPeriode}
                  onChange={(e) => setBulkPeriode(e.target.value)}
                  placeholder="November 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-400 border border-slate-800">
                Akan dibuat tagihan untuk <strong>{pelangganList.filter((p) => p.status !== 'suspend').length}</strong>{' '}
                pelanggan terdaftar.
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  Buat Tagihan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
