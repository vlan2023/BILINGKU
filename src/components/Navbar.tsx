import React from 'react';
import {
  Wifi,
  Server,
  Activity,
  Users,
  Radio,
  Layers,
  Receipt,
  Network,
  Settings,
  RefreshCw
} from 'lucide-react';
import { RadiusServerConfig } from '../types/rtrw';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  radiusConfig: RadiusServerConfig;
  onSyncRadius: () => void;
  isSyncing: boolean;
  totalOnline: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  radiusConfig,
  onSyncRadius,
  isSyncing,
  totalOnline
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard NOC', icon: Activity },
    { id: 'pelanggan', label: 'Pelanggan PPPoE', icon: Users },
    { id: 'sesi', label: 'Sesi Online', icon: Radio, count: totalOnline },
    { id: 'paket', label: 'Paket & Bandwidth', icon: Layers },
    { id: 'billing', label: 'Billing & Tagihan', icon: Receipt },
    { id: 'odp', label: 'Peta ODP & Fiber', icon: Network },
    { id: 'radius', label: 'Konfigurasi RADIUS', icon: Settings }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      {/* Top Bar Status Info */}
      <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800/60 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* RADIUS Connection Status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 font-mono">
                RADIUS: <strong className="text-emerald-400">{radiusConfig.serverHost}:{radiusConfig.authPort}</strong>
              </span>
              <span className="text-slate-500">({radiusConfig.latencyMs}ms)</span>
            </div>

            {/* NAS MikroTik */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400 font-mono">
                NAS MikroTik: <strong className="text-cyan-400">{radiusConfig.nasIp}</strong>
              </span>
            </div>

            {/* RFC 3576 CoA */}
            <div className="hidden md:flex items-center gap-1.5 border-l border-slate-800 pl-4 text-slate-400">
              <span className="bg-indigo-900/60 text-indigo-300 px-1.5 py-0.5 rounded text-[11px] font-mono">
                CoA Port: {radiusConfig.coaPort}
              </span>
              <span>(Auto-Disconnect Aktif)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[11px] hidden lg:inline">
              Sync: {radiusConfig.terakhirSync}
            </span>
            <button
              onClick={onSyncRadius}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-medium border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              {isSyncing ? 'Menyinkronkan...' : 'Sinkron RADIUS'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white p-1 shadow-lg shadow-red-500/10 border border-red-500/30 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/LOGO_VLANNET_6adb5d8c.jpg"
                alt="V-LAN.net Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                  <span className="text-red-500 font-extrabold tracking-tight">V-LAN</span>
                  <span className="text-slate-100">.net</span>
                  <span className="text-red-400 font-mono text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 ml-1">
                    PPPoE CORE
                  </span>
                </h1>
                <span className="hidden sm:inline-block bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase font-semibold">
                  ISP & RT/RW NET
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Sistem Manajemen PPPoE & RADIUS Gateway</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Nav */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="bg-slate-900 px-1.5 rounded-full text-[10px] text-emerald-400">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
