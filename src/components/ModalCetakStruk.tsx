import React from 'react';
import { Printer, X, CheckCircle, Wifi, Shield } from 'lucide-react';
import { TagihanInvoice, PelangganPPPoE, PaketPPPoE, ODPItem } from '../types/rtrw';
import { formatRupiah } from '../utils/formatters';

interface ModalCetakStrukProps {
  isOpen: boolean;
  onClose: () => void;
  tagihan?: TagihanInvoice | null;
  pelanggan?: PelangganPPPoE | null;
  mode: 'struk' | 'spk';
  paketList: PaketPPPoE[];
  odpList: ODPItem[];
}

export const ModalCetakStruk: React.FC<ModalCetakStrukProps> = ({
  isOpen,
  onClose,
  tagihan,
  pelanggan,
  mode,
  paketList,
  odpList
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getPaket = (id?: string) => paketList.find((p) => p.id === id);
  const getOdp = (id?: string) => odpList.find((o) => o.id === id);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative my-8 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Printer className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">
            {mode === 'struk' ? 'Bukti Pembayaran / Struk Kasir' : 'Form Pemasangan & SPK Teknisi'}
          </h3>
        </div>

        {/* Print Printable Paper Box */}
        <div
          id="printable-area"
          className="bg-white text-slate-900 rounded-2xl p-6 font-mono text-xs shadow-lg border border-slate-200"
        >
          {mode === 'struk' && tagihan && (
            <div className="space-y-4">
              <div className="text-center border-b border-dashed border-slate-400 pb-3">
                <div className="flex justify-center mb-1.5">
                  <div className="h-10 w-10 rounded-lg p-0.5 border border-red-200 overflow-hidden flex items-center justify-center bg-white">
                    <img
                      src="/assets/aistudio/LOGO_VLANNET_6adb5d8c.jpg"
                      alt="V-LAN.net"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-sm font-black tracking-wider uppercase text-red-600">V-LAN.net INTERNET SERVICE</div>
                <div className="text-[11px] text-slate-600">Layanan Internet Cepat & Stabil Khusus PPPoE</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Hotline/WA Support: 0812-3456-7890</div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>No. Tagihan:</span>
                  <span className="font-bold">{tagihan.noInvoice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal Bayar:</span>
                  <span>{tagihan.tanggalBayar || new Date().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold">{tagihan.namaPelanggan}</span>
                </div>
                <div className="flex justify-between">
                  <span>User PPPoE:</span>
                  <span className="font-bold">{tagihan.username}</span>
                </div>
                <div className="flex justify-between">
                  <span>Periode:</span>
                  <span>{tagihan.periodeBulan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode:</span>
                  <span>{tagihan.metodeBayar || 'Tunai'}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-slate-400 py-3 space-y-1">
                <div className="flex justify-between font-bold text-xs">
                  <span>LANGGANAN INTERNET PPPoE</span>
                  <span>{formatRupiah(tagihan.nominal)}</span>
                </div>
                <div className="text-[10px] text-slate-600">Koneksi Fiber Optik Unlimited</div>
              </div>

              <div className="flex justify-between text-sm font-black">
                <span>TOTAL DIBAYAR:</span>
                <span>{formatRupiah(tagihan.nominal)}</span>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500 leading-tight">
                <p>Status: LUNAS (TERVERIFIKASI RADIUS)</p>
                <p className="mt-1">Terima kasih atas pembayaran tepat waktu Anda!</p>
                <p>Simpan struk ini sebagai bukti pembayaran yang sah.</p>
              </div>
            </div>
          )}

          {mode === 'spk' && pelanggan && (
            <div className="space-y-3">
              <div className="text-center border-b border-dashed border-slate-400 pb-2">
                <div className="flex justify-center mb-1">
                  <div className="h-9 w-9 rounded-lg p-0.5 border border-red-200 overflow-hidden flex items-center justify-center bg-white">
                    <img
                      src="/assets/aistudio/LOGO_VLANNET_6adb5d8c.jpg"
                      alt="V-LAN.net"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="text-sm font-black uppercase text-red-600">V-LAN.net - FORM PEMASANGAN (SPK)</div>
                <div className="text-[11px] text-slate-600">Instalasi Baru Pelanggan PPPoE FTTH</div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Tgl Pasang:</span>
                  <span>{pelanggan.tanggalPasang}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold">{pelanggan.namaLengkap}</span>
                </div>
                <div className="flex justify-between">
                  <span>No. WhatsApp:</span>
                  <span>{pelanggan.noHp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Alamat:</span>
                  <span>{pelanggan.alamat} ({pelanggan.rtRw})</span>
                </div>
              </div>

              <div className="bg-slate-100 p-2.5 rounded-lg space-y-1 border border-slate-300">
                <div className="text-[10px] font-bold text-slate-700 uppercase">Parameter ONT / Modem:</div>
                <div className="flex justify-between">
                  <span>PPPoE User:</span>
                  <span className="font-bold text-indigo-700">{pelanggan.username}</span>
                </div>
                <div className="flex justify-between">
                  <span>PPPoE Pass:</span>
                  <span className="font-bold text-indigo-700">{pelanggan.password}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paket:</span>
                  <span>{getPaket(pelanggan.paketId)?.nama || '-'}</span>
                </div>
              </div>

              <div className="bg-slate-100 p-2.5 rounded-lg space-y-1 border border-slate-300">
                <div className="text-[10px] font-bold text-slate-700 uppercase">Distribusi Lapangan:</div>
                <div className="flex justify-between">
                  <span>Titik ODP:</span>
                  <span className="font-bold">{getOdp(pelanggan.odpId)?.nama || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Port ODP:</span>
                  <span className="font-bold">Port {pelanggan.odpPort}</span>
                </div>
                <div className="flex justify-between">
                  <span>Redaman dBm:</span>
                  <span className="font-bold">{pelanggan.redamanDbm} dBm (Target &lt; -23dBm)</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-600 flex justify-between border-t border-slate-300">
                <div className="text-center">
                  <p>Tanda Tangan Pelanggan</p>
                  <p className="mt-8">(.........................)</p>
                </div>
                <div className="text-center">
                  <p>Teknisi Lapangan</p>
                  <p className="mt-8">(.........................)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" />
            Cetak Dokumen
          </button>
        </div>
      </div>
    </div>
  );
};
