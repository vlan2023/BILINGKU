import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PelangganView } from './components/PelangganView';
import { SesiRadiusView } from './components/SesiRadiusView';
import { PaketView } from './components/PaketView';
import { BillingView } from './components/BillingView';
import { OdpView } from './components/OdpView';
import { RadiusConfigView } from './components/RadiusConfigView';
import { ModalCetakStruk } from './components/ModalCetakStruk';

import {
  initialPaketList,
  initialPelangganList,
  initialSesiOnlineList,
  initialTagihanList,
  initialOdpList,
  initialRadiusConfig
} from './data/mockData';
import {
  PelangganPPPoE,
  PaketPPPoE,
  SesiOnlineRadius,
  TagihanInvoice,
  ODPItem,
  RadiusServerConfig
} from './types/rtrw';
import { CheckCircle2, ShieldAlert, Wifi, Info } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Persistence State
  const [pelangganList, setPelangganList] = useState<PelangganPPPoE[]>(() => {
    const saved = localStorage.getItem('rtrw_pelanggan');
    return saved ? JSON.parse(saved) : initialPelangganList;
  });

  const [paketList, setPaketList] = useState<PaketPPPoE[]>(() => {
    const saved = localStorage.getItem('rtrw_paket');
    return saved ? JSON.parse(saved) : initialPaketList;
  });

  const [sesiOnlineList, setSesiOnlineList] = useState<SesiOnlineRadius[]>(() => {
    const saved = localStorage.getItem('rtrw_sesi');
    return saved ? JSON.parse(saved) : initialSesiOnlineList;
  });

  const [tagihanList, setTagihanList] = useState<TagihanInvoice[]>(() => {
    const saved = localStorage.getItem('rtrw_tagihan');
    return saved ? JSON.parse(saved) : initialTagihanList;
  });

  const [odpList, setOdpList] = useState<ODPItem[]>(() => {
    const saved = localStorage.getItem('rtrw_odp');
    return saved ? JSON.parse(saved) : initialOdpList;
  });

  const [radiusConfig, setRadiusConfig] = useState<RadiusServerConfig>(() => {
    const saved = localStorage.getItem('rtrw_radius_config');
    return saved ? JSON.parse(saved) : initialRadiusConfig;
  });

  // Action status / Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Syncing Animation
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshingSesi, setIsRefreshingSesi] = useState(false);

  // Modal Cetak State
  const [modalCetakOpen, setModalCetakOpen] = useState(false);
  const [selectedTagihanForStruk, setSelectedTagihanForStruk] = useState<TagihanInvoice | null>(null);
  const [selectedPelangganForSpk, setSelectedPelangganForSpk] = useState<PelangganPPPoE | null>(null);
  const [modalMode, setModalMode] = useState<'struk' | 'spk'>('struk');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rtrw_pelanggan', JSON.stringify(pelangganList));
  }, [pelangganList]);

  useEffect(() => {
    localStorage.setItem('rtrw_paket', JSON.stringify(paketList));
  }, [paketList]);

  useEffect(() => {
    localStorage.setItem('rtrw_sesi', JSON.stringify(sesiOnlineList));
  }, [sesiOnlineList]);

  useEffect(() => {
    localStorage.setItem('rtrw_tagihan', JSON.stringify(tagihanList));
  }, [tagihanList]);

  useEffect(() => {
    localStorage.setItem('rtrw_odp', JSON.stringify(odpList));
  }, [odpList]);

  useEffect(() => {
    localStorage.setItem('rtrw_radius_config', JSON.stringify(radiusConfig));
  }, [radiusConfig]);

  // RADIUS Sync Handler
  const handleSyncRadius = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setRadiusConfig((prev) => ({
        ...prev,
        terakhirSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
        latencyMs: parseFloat((1.2 + Math.random() * 0.9).toFixed(1))
      }));
      showToast('Sinkronisasi database FreeRADIUS dan NAS MikroTik berhasil dilakukan!', 'success');
    }, 800);
  };

  // Refresh Sesi Handler
  const handleRefreshSesi = () => {
    setIsRefreshingSesi(true);
    setTimeout(() => {
      setIsRefreshingSesi(false);
      // Increment traffic slightly to simulate real traffic
      setSesiOnlineList((prev) =>
        prev.map((s) => ({
          ...s,
          durasiDetik: s.durasiDetik + 60,
          downloadBytes: s.downloadBytes + Math.floor(Math.random() * 5000000),
          uploadBytes: s.uploadBytes + Math.floor(Math.random() * 800000)
        }))
      );
      showToast('Sesi radacct diperbarui langsung dari server RADIUS.', 'info');
    }, 500);
  };

  // Kick Sesi via CoA Disconnect
  const handleKickSesi = (id: string, username: string) => {
    setSesiOnlineList((prev) => prev.filter((s) => s.id !== id));
    showToast(
      `RADIUS CoA Packet of Disconnect terkirim ke MikroTik! Sesi ${username} diputus.`,
      'warning'
    );
  };

  // Simulasi Login Dial-Up PPPoE
  const handleSimulateLogin = (pelanggan: PelangganPPPoE) => {
    const pkt = paketList.find((p) => p.id === pelanggan.paketId);
    const odp = odpList.find((o) => o.id === pelanggan.odpId);

    const newSesi: SesiOnlineRadius = {
      id: 'sesi-' + Date.now(),
      username: pelanggan.username,
      namaLengkap: pelanggan.namaLengkap,
      ipAddress: pelanggan.ipType === 'statis' ? pelanggan.staticIp || '10.20.1.50' : `10.20.0.${Math.floor(20 + Math.random() * 80)}`,
      macAddress: pelanggan.macAddress || `D8:50:E6:${Math.floor(10 + Math.random() * 89)}:22:AA`,
      nasIp: radiusConfig.nasIp,
      waktuMulai: 'Baru saja',
      durasiDetik: 60,
      uploadBytes: 2500000,
      downloadBytes: 15400000,
      paketNama: pkt?.nama || 'Paket PPPoE',
      odpName: odp ? `${odp.nama} (Port ${pelanggan.odpPort})` : 'ODP-RT01'
    };

    setSesiOnlineList([newSesi, ...sesiOnlineList]);
    showToast(`Pelanggan '${pelanggan.username}' sukses dial-up PPPoE & terotentikasi RADIUS!`, 'success');
  };

  // Pelanggan Actions
  const handleAddPelanggan = (newPlg: Omit<PelangganPPPoE, 'id'>) => {
    const id = 'plg-' + Date.now();
    const created: PelangganPPPoE = { id, ...newPlg };
    setPelangganList([created, ...pelangganList]);

    // Update ODP count
    setOdpList((prev) =>
      prev.map((o) => (o.id === newPlg.odpId ? { ...o, portTerpakai: o.portTerpakai + 1 } : o))
    );

    showToast(`Akun PPPoE '${created.username}' berhasil didaftarkan ke RADIUS radcheck.`, 'success');
  };

  const handleUpdatePelanggan = (updated: PelangganPPPoE) => {
    setPelangganList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Data pelanggan '${updated.namaLengkap}' berhasil diperbarui.`, 'success');
  };

  const handleDeletePelanggan = (id: string, username: string) => {
    if (!confirm(`Hapus pelanggan ${username} dari database RADIUS?`)) return;
    setPelangganList((prev) => prev.filter((p) => p.id !== id));
    setSesiOnlineList((prev) => prev.filter((s) => s.username !== username));
    showToast(`Akun ${username} telah dihapus dari radcheck dan radreply.`, 'info');
  };

  // Toggle Isolir Pelanggan
  const handleToggleIsolir = (pelanggan: PelangganPPPoE) => {
    const isNowIsolir = pelanggan.status !== 'isolir';
    const newStatus = isNowIsolir ? 'isolir' : 'aktif';

    setPelangganList((prev) =>
      prev.map((p) => (p.id === pelanggan.id ? { ...p, status: newStatus } : p))
    );

    if (isNowIsolir) {
      // Disconnect current session if online
      setSesiOnlineList((prev) => prev.filter((s) => s.username !== pelanggan.username));
      showToast(
        `Pelanggan ${pelanggan.username} di-ISOLIR. CoA Disconnect dikirim ke MikroTik untuk putus sesi.`,
        'warning'
      );
    } else {
      showToast(`Status pelanggan ${pelanggan.username} dipulihkan menjadi AKTIF normal.`, 'success');
    }
  };

  // Auto Isolir Massal Tagihan Tertunggak
  const handleAutoIsolir = () => {
    const lewatTempo = tagihanList.filter((t) => t.status === 'lewat_tempo');
    if (lewatTempo.length === 0) {
      showToast('Tidak ada pelanggan yang lewat jatuh tempo saat ini.', 'info');
      return;
    }

    const usernamesToIsolir = lewatTempo.map((t) => t.username);

    setPelangganList((prev) =>
      prev.map((p) => (usernamesToIsolir.includes(p.username) ? { ...p, status: 'isolir' } : p))
    );

    // Kick online sessions
    setSesiOnlineList((prev) => prev.filter((s) => !usernamesToIsolir.includes(s.username)));

    showToast(
      `Auto-Isolir Berhasil: ${usernamesToIsolir.length} pelanggan menunggak telah dialihkan ke Pool Isolir via CoA Disconnect!`,
      'warning'
    );
  };

  // Pembayaran Tagihan
  const handleBayarTagihan = (
    id: string,
    metode: 'Tunai' | 'Transfer BCA' | 'Transfer BRI' | 'QRIS' | 'DANA'
  ) => {
    const nowStr = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const targetTagihan = tagihanList.find((t) => t.id === id);

    setTagihanList((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'lunas',
              tanggalBayar: nowStr,
              metodeBayar: metode
            }
          : t
      )
    );

    // Otomatis buka isolir jika pelanggan sedang terisolir
    if (targetTagihan) {
      setPelangganList((prev) =>
        prev.map((p) =>
          p.id === targetTagihan.pelangganId && p.status === 'isolir'
            ? { ...p, status: 'aktif' }
            : p
        )
      );
    }

    showToast(
      `Pembayaran tagihan ${targetTagihan?.noInvoice} sebesar Rp ${targetTagihan?.nominal.toLocaleString('id-ID')} (${metode}) LUNAS. Akses otomatis dibuka kembali!`,
      'success'
    );
  };

  // Generate Bulk Invoice
  const handleGenerateBulkInvoice = (periode: string) => {
    const newInvoices: TagihanInvoice[] = [];
    const dateStr = new Date().toISOString().split('T')[0];

    pelangganList.forEach((p, idx) => {
      const pkt = paketList.find((pk) => pk.id === p.paketId);
      const invoiceNum = `INV/NET/${Date.now().toString().slice(-6)}/${String(idx + 1).padStart(3, '0')}`;

      newInvoices.push({
        id: 'inv-' + Date.now() + '-' + idx,
        noInvoice: invoiceNum,
        pelangganId: p.id,
        username: p.username,
        namaPelanggan: p.namaLengkap,
        noHp: p.noHp,
        periodeBulan: periode,
        nominal: pkt?.harga || 150000,
        status: 'belum_bayar',
        tanggalTerbit: dateStr,
        tanggalJatuhTempo: `${dateStr.slice(0, 8)}${String(p.jatuhTempoHari).padStart(2, '0')}`
      });
    });

    setTagihanList([...newInvoices, ...tagihanList]);
    showToast(`Berhasil membuat ${newInvoices.length} invoice tagihan untuk periode ${periode}!`, 'success');
  };

  // Paket Actions
  const handleAddPaket = (newPkt: Omit<PaketPPPoE, 'id'>) => {
    const id = 'pkt-' + Date.now();
    setPaketList([...paketList, { id, ...newPkt }]);
    showToast(`Paket '${newPkt.nama}' dengan rate-limit ${newPkt.rateLimit} ditambahkan ke radgroupreply.`, 'success');
  };

  const handleUpdatePaket = (updated: PaketPPPoE) => {
    setPaketList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Paket '${updated.nama}' berhasil diupdate.`, 'success');
  };

  const handleDeletePaket = (id: string) => {
    setPaketList((prev) => prev.filter((p) => p.id !== id));
    showToast('Paket berhasil dihapus.', 'info');
  };

  // ODP Actions
  const handleAddOdp = (newOdp: Omit<ODPItem, 'id'>) => {
    const id = 'odp-' + Date.now();
    setOdpList([...odpList, { id, ...newOdp }]);
    showToast(`Titik ODP '${newOdp.nama}' berhasil didaftarkan.`, 'success');
  };

  // Cetak Actions
  const handleOpenStruk = (tagihan: TagihanInvoice) => {
    setSelectedTagihanForStruk(tagihan);
    setSelectedPelangganForSpk(null);
    setModalMode('struk');
    setModalCetakOpen(true);
  };

  const handlePrintSpk = (pelanggan: PelangganPPPoE) => {
    setSelectedPelangganForSpk(pelanggan);
    setSelectedTagihanForStruk(null);
    setModalMode('spk');
    setModalCetakOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-red-500/30">
      {/* Sidebar Navigasi Samping */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        radiusConfig={radiusConfig}
        onSyncRadius={handleSyncRadius}
        isSyncing={isSyncing}
        totalOnline={sesiOnlineList.length}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          radiusConfig={radiusConfig}
          totalOnline={sesiOnlineList.length}
          onSyncRadius={handleSyncRadius}
          isSyncing={isSyncing}
        />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-medium ${
                toastMessage.type === 'success'
                  ? 'bg-slate-900 border-emerald-500 text-emerald-300'
                  : toastMessage.type === 'warning'
                  ? 'bg-slate-900 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-cyan-500 text-cyan-300'
              }`}
            >
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toastMessage.type === 'warning' && <ShieldAlert className="w-4 h-4 text-amber-400" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              pelangganList={pelangganList}
              sesiOnlineList={sesiOnlineList}
              tagihanList={tagihanList}
              paketList={paketList}
              radiusConfig={radiusConfig}
              onNavigate={setCurrentTab}
              onAutoIsolir={handleAutoIsolir}
              onKickSesi={handleKickSesi}
            />
          )}

          {currentTab === 'pelanggan' && (
            <PelangganView
              pelangganList={pelangganList}
              paketList={paketList}
              odpList={odpList}
              onAddPelanggan={handleAddPelanggan}
              onUpdatePelanggan={handleUpdatePelanggan}
              onDeletePelanggan={handleDeletePelanggan}
              onToggleIsolir={handleToggleIsolir}
              onPrintSpk={handlePrintSpk}
            />
          )}

          {currentTab === 'sesi' && (
            <SesiRadiusView
              sesiList={sesiOnlineList}
              radiusConfig={radiusConfig}
              pelangganList={pelangganList}
              onKickSesi={handleKickSesi}
              onRefreshSesi={handleRefreshSesi}
              onSimulateLogin={handleSimulateLogin}
              isRefreshing={isRefreshingSesi}
            />
          )}

          {currentTab === 'paket' && (
            <PaketView
              paketList={paketList}
              pelangganList={pelangganList}
              onAddPaket={handleAddPaket}
              onUpdatePaket={handleUpdatePaket}
              onDeletePaket={handleDeletePaket}
            />
          )}

          {currentTab === 'billing' && (
            <BillingView
              tagihanList={tagihanList}
              pelangganList={pelangganList}
              paketList={paketList}
              onBayarTagihan={handleBayarTagihan}
              onGenerateBulkInvoice={handleGenerateBulkInvoice}
              onOpenStruk={handleOpenStruk}
              onAutoIsolir={handleAutoIsolir}
            />
          )}

          {currentTab === 'odp' && (
            <OdpView
              odpList={odpList}
              pelangganList={pelangganList}
              onAddOdp={handleAddOdp}
            />
          )}

          {currentTab === 'radius' && (
            <RadiusConfigView
              config={radiusConfig}
              onUpdateConfig={setRadiusConfig}
              paketList={paketList}
              pelangganList={pelangganList}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded bg-white p-0.5 border border-red-500/30 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/LOGO_VLANNET_6adb5d8c.jpg"
                  alt="V-LAN.net Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-semibold text-slate-400">
                <strong className="text-red-500">V-LAN.net</strong> PPPoE CORE © {new Date().getFullYear()} — RADIUS Integrated Gateway
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>FreeRADIUS v3.x Compatible</span>
              <span>•</span>
              <span>RFC 2865 / RFC 2866</span>
              <span>•</span>
              <span className="text-red-400 font-mono">RFC 3576 CoA Ready</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modal Cetak Struk & SPK */}
      <ModalCetakStruk
        isOpen={modalCetakOpen}
        onClose={() => setModalCetakOpen(false)}
        tagihan={selectedTagihanForStruk}
        pelanggan={selectedPelangganForSpk}
        mode={modalMode}
        paketList={paketList}
        odpList={odpList}
      />
    </div>
  );
}
