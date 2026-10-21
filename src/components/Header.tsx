import React from 'react';
import { Menu, Server, Radio, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { RadiusServerConfig } from '../types/rtrw';

interface HeaderProps {
  currentTab: string;
  onOpenMobileSidebar: () => void;
  radiusConfig: RadiusServerConfig;
  totalOnline: number;
  onSyncRadius: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  radiusConfig,
  totalOnline,
  onSyncRadius,
  isSyncing
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard NOC', subtitle: 'Monitoring performa jaringan & ringkasan operasional' };
      case 'pelanggan':
        return { title: 'Pelanggan PPPoE', subtitle: 'Daftar akun radcheck, binding MAC, dan alokasi ODP' };
      case 'sesi':
        return { title: 'Monitoring Sesi Online', subtitle: 'Live status koneksi radacct dari MikroTik NAS' };
      case 'paket':
        return { title: 'Paket & Bandwidth', subtitle: 'Konfigurasi Mikrotik-Rate-Limit & profil RADIUS' };
      case 'billing':
        return { title: 'Billing & Tagihan', subtitle: 'Manajemen invoice, pembayaran, struk, dan WhatsApp' };
      case 'odp':
        return { title: 'Peta ODP & Fiber Optik', subtitle: 'Visualisasi port splitter dropcore dan redaman dBm' };
      case 'radius':
        return { title: 'Konfigurasi RADIUS Server', subtitle: 'Pengaturan FreeRADIUS, uji radtest & script MikroTik' };
      default:
        return { title: 'V-LAN.net Core', subtitle: 'Sistem Manajemen PPPoE & RADIUS' };
    }
  };

  const { title, subtitle } = getTabTitle(currentTab);

  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block leading-none mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status Pills & Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* NAS Status */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <Server className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500">NAS:</span>
          <span className="text-cyan-400 font-semibold">{radiusConfig.nasIp}</span>
        </div>

        {/* Online Sessions Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">{totalOnline}</span>
          <span className="text-slate-500 hidden sm:inline">Online</span>
        </div>

        {/* Sync Button */}
        <button
          onClick={onSyncRadius}
          disabled={isSyncing}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          title="Sinkronisasi Server RADIUS"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync RADIUS'}</span>
        </button>
      </div>
    </header>
  );
};
