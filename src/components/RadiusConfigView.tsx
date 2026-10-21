import React, { useState } from 'react';
import {
  Settings,
  Server,
  ShieldCheck,
  Check,
  Copy,
  Terminal,
  Activity,
  Play,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { RadiusServerConfig, PaketPPPoE, PelangganPPPoE } from '../types/rtrw';

interface RadiusConfigViewProps {
  config: RadiusServerConfig;
  onUpdateConfig: (newConfig: RadiusServerConfig) => void;
  paketList: PaketPPPoE[];
  pelangganList: PelangganPPPoE[];
}

export const RadiusConfigView: React.FC<RadiusConfigViewProps> = ({
  config,
  onUpdateConfig,
  paketList,
  pelangganList
}) => {
  const [formData, setFormData] = useState<RadiusServerConfig>(config);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Radtest test state
  const [testUsername, setTestUsername] = useState('slamet_rt01');
  const [testPassword, setTestPassword] = useState('net123password');
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'failed' | 'running' | null;
    message: string;
    attributes?: Record<string, string>;
  }>({ status: null, message: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const runRadtest = () => {
    setTestResult({ status: 'running', message: 'Mengirim Access-Request ke ' + formData.serverHost + ':' + formData.authPort + '...' });

    setTimeout(() => {
      const match = pelangganList.find(
        (p) => p.username === testUsername && p.password === testPassword
      );

      if (match) {
        if (match.status === 'isolir') {
          setTestResult({
            status: 'success',
            message: 'Access-Accept Diterima (Dialihkan ke Pool ISOLIR)',
            attributes: {
              'Framed-Protocol': 'PPP',
              'Framed-Pool': 'pool-isolir',
              'Mikrotik-Rate-Limit': '512k/512k',
              'Session-Timeout': '86400'
            }
          });
        } else {
          const pkt = paketList.find((p) => p.id === match.paketId);
          setTestResult({
            status: 'success',
            message: 'Access-Accept Diterima (Otentikasi Berhasil)',
            attributes: {
              'Framed-Protocol': 'PPP',
              'Service-Type': 'Framed-User',
              'Framed-IP-Address': match.ipType === 'statis' ? match.staticIp || '10.20.1.25' : '255.255.255.254 (Dynamic Pool)',
              'Mikrotik-Rate-Limit': pkt?.rateLimit || '10M/20M',
              'Framed-Pool': pkt?.poolName || 'pool-pppoe-reguler'
            }
          });
        }
      } else {
        setTestResult({
          status: 'failed',
          message: 'Access-Reject: Username atau Password tidak cocok pada tabel radcheck!'
        });
      }
    }, 600);
  };

  // Generate MikroTik RouterOS Script
  const generateMikrotikScript = () => {
    return `# ==============================================================
# SCRIPT KONFIGURASI RADIUS & PPPOE SERVER MIKROTIK ROUTEROS
# V-LAN.net PPPoE Gateway - Generated secara otomatis
# ==============================================================

# 1. Tambahkan Konfigurasi RADIUS Client ke Server FreeRADIUS
/radius add service=ppp address=${formData.serverHost} secret="${formData.sharedSecret}" \\
  authentication-port=${formData.authPort} accounting-port=${formData.acctPort} timeout=3000ms comment="V-LAN.net FreeRADIUS Core"

# 2. Aktifkan Fitur RADIUS Incoming (RFC 3576 / CoA Disconnect untuk Auto-Isolir)
/radius incoming set accept=yes port=${formData.coaPort}

# 3. Konfigurasi Pool IP untuk Klien PPPoE
/ip pool add name=pool-pppoe-reguler ranges=10.20.0.2-10.20.0.254
/ip pool add name=pool-pppoe-prioritas ranges=10.20.1.2-10.20.1.254
/ip pool add name=pool-isolir ranges=10.20.99.2-10.20.99.254

# 4. Buat Profil PPPoE dengan Dukungan RADIUS
/ppp profile add name=profile-radius-pppoe local-address=10.20.0.1 remote-address=pool-pppoe-reguler \\
  use-encryption=yes only-one=yes change-tcp-mss=yes dns-server=1.1.1.1,8.8.8.8 comment="PPPoE RADIUS Profile"

/ppp profile add name=profile-isolir local-address=10.20.99.1 remote-address=pool-isolir \\
  rate-limit=512k/512k comment="Profil Pelanggan Terisolir"

# 5. Aktifkan PPPoE Server Authentication via RADIUS
/interface pppoe-server server add service-name=pppoe-rtrw-net interface=ether2-lan \\
  default-profile=profile-radius-pppoe authentication=pap,chap,mschap2 one-session-per-host=yes disabled=no

# 6. Aktifkan AAA Accounting PPPoE ke RADIUS
/ppp aaa set use-radius=yes accounting=yes interim-update=5m
`;
  };

  // Generate SQL Dump for FreeRADIUS
  const generateSqlDump = () => {
    let sql = `-- ============================================================\n`;
    sql += `-- FreeRADIUS Database Tables: radcheck, radreply, radusergroup\n`;
    sql += `-- ============================================================\n\n`;

    sql += `-- 1. Data Pelanggan PPPoE (radcheck)\n`;
    pelangganList.forEach((p) => {
      sql += `INSERT INTO radcheck (username, attribute, op, value) VALUES ('${p.username}', 'Cleartext-Password', ':=', '${p.password}');\n`;
      if (p.macAddress) {
        sql += `INSERT INTO radcheck (username, attribute, op, value) VALUES ('${p.username}', 'Calling-Station-Id', '==', '${p.macAddress}');\n`;
      }
    });

    sql += `\n-- 2. Paket Bandwidth (radgroupreply)\n`;
    paketList.forEach((pkt) => {
      sql += `INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES ('${pkt.nama.replace(/\s+/g, '_')}', 'Mikrotik-Rate-Limit', ':=', '${pkt.rateLimit}');\n`;
      sql += `INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES ('${pkt.nama.replace(/\s+/g, '_')}', 'Framed-Pool', ':=', '${pkt.poolName}');\n`;
    });

    return sql;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          Konfigurasi Koneksi RADIUS Server & MikroTik Gateway
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Sinkronisasi FreeRADIUS, port CoA (RFC 3576), dan export skrip otomatis RouterOS
        </p>
      </div>

      {/* Grid Konfigurasi & Test radtest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Parameter RADIUS */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Parameter Server FreeRADIUS / User Manager
            </h3>
            {isSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                <Check className="w-3.5 h-3.5" /> Konfigurasi Disimpan
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  RADIUS Host / IP Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.serverHost}
                  onChange={(e) => setFormData({ ...formData, serverHost: e.target.value })}
                  placeholder="10.10.10.1 atau radius.rtrw.net"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Database Type</label>
                <select
                  value={formData.dbType}
                  onChange={(e) => setFormData({ ...formData, dbType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="MySQL / MariaDB">MySQL / MariaDB</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="Direct radclient">Direct radclient</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Authentication Port
                </label>
                <input
                  type="number"
                  value={formData.authPort}
                  onChange={(e) => setFormData({ ...formData, authPort: parseInt(e.target.value) || 1812 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500">Standar: 1812 UDP</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Accounting Port</label>
                <input
                  type="number"
                  value={formData.acctPort}
                  onChange={(e) => setFormData({ ...formData, acctPort: parseInt(e.target.value) || 1813 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500">Standar: 1813 UDP</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CoA / Disconnect Port (RFC 3576)
                </label>
                <input
                  type="number"
                  value={formData.coaPort}
                  onChange={(e) => setFormData({ ...formData, coaPort: parseInt(e.target.value) || 3799 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-cyan-400">Untuk Auto-Kick Isolir (3799)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  RADIUS Shared Secret Key *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sharedSecret}
                  onChange={(e) => setFormData({ ...formData, sharedSecret: e.target.value })}
                  placeholder="radius_secret_key"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  IP NAS MikroTik (Gateway) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nasIp}
                  onChange={(e) => setFormData({ ...formData, nasIp: e.target.value })}
                  placeholder="192.168.88.1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-indigo-600/20"
              >
                Simpan Pengaturan RADIUS
              </button>
            </div>
          </form>
        </div>

        {/* Uji Otentikasi radtest */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Simulasi Tes radtest CLI
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Uji handshake otentikasi Access-Request & cek atribut yang dikembalikan RADIUS
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">PPPoE Username</label>
                <input
                  type="text"
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">PPPoE Password</label>
                <input
                  type="text"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={runRadtest}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Jalankan radtest
              </button>
            </div>

            {/* Test Output Console */}
            {testResult.status && (
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs">
                <div
                  className={`font-semibold mb-1 flex items-center gap-1.5 ${
                    testResult.status === 'success'
                      ? 'text-emerald-400'
                      : testResult.status === 'running'
                      ? 'text-cyan-400'
                      : 'text-rose-400'
                  }`}
                >
                  {testResult.status === 'success' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {testResult.status === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
                  {testResult.status === 'running' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{testResult.message}</span>
                </div>

                {testResult.attributes && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-300">
                    {Object.entries(testResult.attributes).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-cyan-400 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 text-[11px] text-slate-500 pt-3 border-t border-slate-800">
            Perintah asli: <code>radtest {testUsername} {testPassword} {formData.serverHost} 0 {formData.sharedSecret}</code>
          </div>
        </div>
      </div>

      {/* Script Generator MikroTik RouterOS & SQL Dump */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: MikroTik CLI */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Script MikroTik RouterOS (Siap Pakai)
              </h3>
              <button
                onClick={() => copyToClipboard(generateMikrotikScript(), 'mikrotik')}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedType === 'mikrotik' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Skrip
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Salin dan tempel di Terminal Winbox MikroTik untuk mengaktifkan klien RADIUS dan PPPoE Server.
            </p>
            <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-64 scrollbar-thin">
              {generateMikrotikScript()}
            </pre>
          </div>
        </div>

        {/* Box 2: SQL Dump FreeRADIUS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                FreeRADIUS SQL Schema & Seeds
              </h3>
              <button
                onClick={() => copyToClipboard(generateSqlDump(), 'sql')}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedType === 'sql' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin SQL
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Kueri INSERT untuk tabel MySQL/MariaDB database <code>radius</code> (radcheck & radgroupreply).
            </p>
            <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-purple-300/90 overflow-x-auto max-h-64 scrollbar-thin">
              {generateSqlDump()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
