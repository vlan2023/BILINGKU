import React from 'react';
import {
  Activity,
  Users,
  Radio,
  Layers,
  Receipt,
  Network,
  Settings,
  RefreshCw,
  Server,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { RadiusServerConfig } from '../types/rtrw';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  radiusConfig: RadiusServerConfig;
  onSyncRadius: () => void;
  isSyncing: boolean;
  totalOnline: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  radiusConfig,
  onSyncRadius,
  isSyncing,
  totalOnline,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard NOC', icon: Activity, desc: 'Ringkasan performa' },
    { id: 'pelanggan', label: 'Pelanggan PPPoE', icon: Users, desc: 'Database & radcheck' },
    { id: 'sesi', label: 'Sesi Online', icon: Radio, desc: 'Live radacct session', count: totalOnline },
    { id: 'paket', label: 'Paket & Bandwidth', icon: Layers, desc: 'Rate-limit MikroTik' },
    { id: 'billing', label: 'Billing & Tagihan', icon: Receipt, desc: 'Invoice & WhatsApp' },
    { id: 'odp', label: 'Peta ODP & Fiber', icon: Network, desc: 'Splitter & redaman dBm' },
    { id: 'radius', label: 'Konfigurasi RADIUS', icon: Settings, desc: 'FreeRADIUS & CoA' }
  ];

  const handleSelectTab = (id: string) => {
    setCurrentTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-white p-1 shadow-md shadow-red-500/10 border border-red-500/30 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/assets/aistudio/LOGO_VLANNET_6adb5d8c.jpg"
                  alt="V-LAN.net Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-red-500 font-extrabold text-lg tracking-tight">V-LAN</span>
                  <span className="text-white font-bold text-lg">.net</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-red-400 font-mono font-semibold uppercase px-1.5 py-0.2 rounded bg-red-500/10 border border-red-500/20">
                    PPPoE CORE
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">ISP NOC</span>
                </div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
              Menu Operasional
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600/90 to-rose-600/90 text-white shadow-lg shadow-red-600/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-red-400 group-hover:bg-red-500/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium leading-none">{item.label}</div>
                      <div
                        className={`text-[10px] mt-1 transition ${
                          isActive ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.count !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isActive
                            ? 'bg-white text-red-600'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: RADIUS Server Status Panel */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 m-3 rounded-2xl border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold text-slate-200">FreeRADIUS Gateway</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {radiusConfig.latencyMs}ms
            </span>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Auth Host:</span>
              <span className="text-slate-300 font-medium">{radiusConfig.serverHost}:{radiusConfig.authPort}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NAS IP:</span>
              <span className="text-cyan-400">{radiusConfig.nasIp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CoA (RFC 3576):</span>
              <span className="text-red-400 font-semibold">Port {radiusConfig.coaPort}</span>
            </div>
          </div>

          <button
            onClick={onSyncRadius}
            disabled={isSyncing}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-red-400' : 'text-slate-400'}`} />
            <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkron RADIUS'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
