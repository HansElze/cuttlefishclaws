// app/admin/vault/page.tsx  (Next.js App Router)
// or: pages/admin/vault.tsx (Pages Router)
//
// Quick setup:
// 1) Ensure TailwindCSS is enabled in your project (https://tailwindcss.com/docs/guides/nextjs)
// 2) Install icons:  npm i lucide-react
// 3) (Optional) Set passphrase:  NEXT_PUBLIC_CUTTLEFISH_ADMIN_PASSPHRASE="your-secret"
// 4) Drop this file at one of the paths above and navigate to /admin/vault
//
// Notes:
// - This is a mock-only scaffold: no blockchain or backend calls.
// - Includes simple passphrase auth OR MetaMask connect.
// - Buttons simulate actions and append to an on-page log + history.
// - Everything is local state; refresh will reset unless you wire storage.

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Wallet,
  ShieldCheck,
  PlusCircle,
  MinusCircle,
  Bot,
  Activity,
  LogOut,
  Lock,
  Sun,
  Moon,
} from "lucide-react";


// If using TypeScript, declare minimal window.ethereum type
declare global {
  interface Window {
    ethereum?: any;
 
 }
}



// ---------- Types ----------

type ActionType = "ADD_LIQUIDITY" | "WITHDRAW" | "AGENT_ASK";

type ActionRecord = {
  id: string;
  type: ActionType;
  details: string;
  token?: string;
  amount?: number;
  status: "proposed" | "confirmed" | "rejected";
  timestamp: number;
};

type LogLevel = "info" | "success" | "warn" | "error";

type AgentLog = {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
};

type VaultState = {
  balances: Record<string, number>; // tokenSymbol -> balance
  lpSharePct: number; // 0..100
  lastUpdated: number; // epoch ms
};

type Token = {
  symbol: string;
  name: string;
  decimals: number;
};

// ---------- Helpers ----------

const fmtAmount = (symbol: string, v: number, decimals = 4) =>
  `${v.toLocaleString(undefined, { maximumFractionDigits: decimals })} ${symbol}`;
const fmtNum = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmtTime = (t: number) => new Date(t).toLocaleString();
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const uid = () => Math.random().toString(36).slice(2, 10);

// Seed mock data
const TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", decimals: 4 },
  { symbol: "E2R", name: "E2R", decimals: 0 },
  { symbol: "USDC", name: "USD Coin", decimals: 2 },
  { symbol: "TRIB", name: "Tributary AI + $TRIB", decimals: 0 }

];

const initialVault: VaultState = {
  balances: {
    ETH: 128.5,
    E2R: 502_000,
    USDC: 25_000,
    TRIB: 0,
  },
  lpSharePct: 37.4,
  lastUpdated: Date.now(),
};

export default function VaultAdminPanel() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);
  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };
  // --- Auth ---
  const [authed, setAuthed] = useState(false);
  const [authMethod, setAuthMethod] = useState<"passphrase" | "wallet">("passphrase");
  const [pass, setPass] = useState("");
  const allowedPass =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_CUTTLEFISH_ADMIN_PASSPHRASE) ||
    (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_CUTTLEFISH_ADMIN_PASSPHRASE) ||
    "cuttlefish-admin";
  const [wallet, setWallet] = useState<string | null>(null);

  // --- Data ---
  const [vault, setVault] = useState<VaultState>(initialVault);
  const [actions, setActions] = useState<ActionRecord[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([
    { id: uid(), level: "info", message: "Vault admin panel booted.", timestamp: Date.now() },
  ]);

  // --- UI State ---
  const [showAdd, setShowAdd] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAsk, setShowAsk] = useState(false);

  // Forms
  const [addToken, setAddToken] = useState<string>(TOKENS[0].symbol);
  const [addAmount, setAddAmount] = useState<string>("");

  const [wdToken, setWdToken] = useState<string>(TOKENS[0].symbol);
  const [wdAmount, setWdAmount] = useState<string>("");
  const [askPrompt, setAskPrompt] = useState<string>("");

  const logEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // --- Auth methods ---
  const doPassAuth = () => {
    if (!pass.trim()) return pushLog("warn", "Enter passphrase to continue.");
    if (pass === allowedPass) {
      setAuthed(true);
      pushLog("success", "Passphrase accepted. Admin unlocked.");
    } else {
      pushLog("error", "Invalid passphrase.");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      pushLog("error", "MetaMask not detected in this browser.");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const acct = Array.isArray(accounts) ? accounts[0] : String(accounts);
      setWallet(acct);
      setAuthed(true);
      pushLog("success", `Wallet connected: ${acct}`);
    } catch (e: any) {
      pushLog("error", e?.message || "Wallet connection rejected.");
    }
  };

  const logout = () => {
    setAuthed(false);
    setWallet(null);
    setPass("");
  };

  // --- Logging ---
  const pushLog = (level: LogLevel, message: string) => {
    setLogs((prev) => [...prev, { id: uid(), level, message, timestamp: Date.now() }]);
  };

  // --- Actions ---
  const tokenMeta = (symbol: string) => TOKENS.find((t) => t.symbol === symbol) ?? TOKENS[0];

  const handleAddLiquidity = () => {
    const amount = Number(addAmount || 0);
    const token = addToken;
    if (isNaN(amount) || amount <= 0) return pushLog("warn", "Enter a positive amount to add.");

    const rec: ActionRecord = {
      id: uid(),
      type: "ADD_LIQUIDITY",
      details: `Add ${fmtAmount(token, amount, tokenMeta(token).decimals)}`,
      token,
      amount,
      status: "proposed",
      timestamp: Date.now(),
    };
    setActions((a) => [rec, ...a]);
    pushLog("info", `Proposed ADD_LIQUIDITY → ${rec.details}`);

    // Update mock vault instantly, then confirm shortly after
    setVault((v) => ({
      ...v,
      balances: { ...v.balances, [token]: (v.balances[token] || 0) + amount },
      lpSharePct: clamp(v.lpSharePct + amount * 0.05, 0, 100),
      lastUpdated: Date.now(),
    }));

    // confirm status after a tick
    setTimeout(() => {
      setActions((prev) => prev.map((r) => (r.id === rec.id ? { ...r, status: "confirmed" } : r)));
      pushLog("success", `ADD_LIQUIDITY confirmed. Vault balances updated.`);
    }, 600);

    setShowAdd(false);
    setAddAmount("");
  };

  const handleWithdraw = () => {
    const amount = Number(wdAmount || 0);
    const token = wdToken;
    if (isNaN(amount) || amount <= 0) return pushLog("warn", `Enter a positive ${token} amount to withdraw.`);
    const bal = vault.balances[token] || 0;
    if (amount > bal) return pushLog("error", `Withdrawal exceeds vault ${token} balance.`);

    const rec: ActionRecord = {
      id: uid(),
      type: "WITHDRAW",
      details: `Withdraw ${fmtAmount(token, amount, tokenMeta(token).decimals)}`,
      token,
      amount,
      status: "proposed",
      timestamp: Date.now(),
    };
    setActions((a) => [rec, ...a]);
    pushLog("info", `Proposed WITHDRAW → ${rec.details}`);

    setVault((v) => ({
      ...v,
      balances: { ...v.balances, [token]: Math.max(0, (v.balances[token] || 0) - amount) },
      lpSharePct: clamp(v.lpSharePct - amount * 0.05, 0, 100),
      lastUpdated: Date.now(),
    }));

    setTimeout(() => {
      setActions((prev) => prev.map((r) => (r.id === rec.id ? { ...r, status: "confirmed" } : r)));
      pushLog("success", `WITHDRAW confirmed.`);
    }, 600);

    setShowWithdraw(false);
    setWdAmount("");
  };

  const handleAgentAsk = () => {
    const q = askPrompt.trim();
    if (!q) return pushLog("warn", "Please enter a prompt for the Agent Ask().");

    const rec: ActionRecord = {
      id: uid(),
      type: "AGENT_ASK",
      details: q,
      status: "proposed",
      timestamp: Date.now(),
    };
    setActions((a) => [rec, ...a]);
    pushLog("info", `Agent Ask(): ${q}`);

    // Mock a response inline
    setTimeout(() => {
      const suggestion = `Agent suggests adding ${fmtAmount("ETH", 1.25, tokenMeta("ETH").decimals)} to maintain target LP ratio.`;
      pushLog("success", suggestion);
      setActions((prev) => prev.map((r) => (r.id === rec.id ? { ...r, status: "confirmed" } : r)));
    }, 800);

    setShowAsk(false);
    setAskPrompt("");
  };

  // ---------- UI ----------
  if (!authed) {
    return (
      <div className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8" />
              <h1 className="text-2xl font-semibold">Cuttlefish Vault Admin</h1>
            </div>
          </header>

          <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Lock className="h-5 w-5"/> Restricted Access</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passphrase auth */}
              <div className="rounded-xl border dark:border-gray-700 p-4 dark:bg-gray-800">
                <h3 className="font-semibold mb-2 dark:text-gray-100">Passphrase</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">For early scaffolding. Replace with role-based auth later.</p>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Enter passphrase"
                    className="flex-1 rounded-xl border dark:border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={doPassAuth}
                    className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition dark:bg-indigo-600 dark:hover:bg-indigo-700"
                  >
                    Unlock
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Default: <code>cuttlefish-admin</code></p>
              </div>

              {/* Wallet auth */}
              <div className="rounded-xl border dark:border-gray-700 p-4 dark:bg-gray-800">
                <h3 className="font-semibold mb-2 dark:text-gray-100">MetaMask</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Connect a wallet to unlock admin controls.</p>
                <button
                  onClick={connectWallet}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gray-900 text-white hover:bg-black transition dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Wallet className="h-5 w-5"/> Connect Wallet
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">No on-chain writes yet—this is mock UI only.</p>
              </div>
            </div>
          </div>

          {/* Log panel visible pre-auth too */}
          <div className="mt-8 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2 dark:text-gray-100"><Activity className="h-5 w-5"/> Event Log</h3>
            <div className="max-h-48 overflow-auto text-sm font-mono bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border dark:border-gray-700">
              {logs.map((l) => (
                <div key={l.id} className="py-0.5">
                  <span className={`inline-block w-16 text-xs uppercase tracking-wide ${
                    l.level === "success" ? "text-emerald-600" : l.level === "error" ? "text-red-600" : l.level === "warn" ? "text-amber-600" : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {l.level}
                  </span>
                  <span className="text-gray-800 dark:text-gray-100">{l.message}</span>
                  <span className="text-gray-400 dark:text-gray-400 text-xs ml-2">{fmtTime(l.timestamp)}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function labelForType(type: ActionType): React.ReactNode {
    switch (type) {
      case "ADD_LIQUIDITY":
        return "Add Liquidity";
      case "WITHDRAW":
        return "Withdraw";
      case "AGENT_ASK":
        return "Agent Ask()";
      default:
        return type;
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-700">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7" />
            <div>
              <h1 className="text-xl font-semibold leading-tight dark:text-gray-100">Cuttlefish Vault Admin Panel</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Scaffold for testing agent triggers & DAO-like actions</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {wallet ? (
              <span className="text-xs border dark:border-gray-700 rounded-lg px-2 py-1 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">{shortAddr(wallet)}</span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">Passphrase session</span>
            )}
            <button
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              {isDark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
              {isDark ? "Light" : "Dark"}
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100">
              <LogOut className="h-4 w-4"/> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {TOKENS.map((t) => (
            <StatCard
              key={t.symbol}
              title={`${t.symbol} Balance`}
              value={fmtAmount(t.symbol, vault.balances[t.symbol] || 0, t.decimals)}
              sub={`Updated ${timeAgo(vault.lastUpdated)}`}
            />
          ))}
          <StatCard title="LP Share" value={`${fmtNum(vault.lpSharePct)}%`} sub="Target 40–60%" />
        </section>

        {/* Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ActionCard
            icon={<PlusCircle className="h-6 w-6"/>}
            title="Propose Add Liquidity"
            desc="Increase a token balance in the vault"
            cta="Propose"
            onClick={() => setShowAdd(true)}
          />
          <ActionCard
            icon={<MinusCircle className="h-6 w-6"/>}
            title="Withdraw"
            desc="Remove a token from the vault"
            cta="Withdraw"
            onClick={() => setShowWithdraw(true)}
          />
          <ActionCard
            icon={<Bot className="h-6 w-6"/>}
            title="Simulate Agent Ask()"
            desc="Mock how an agent requests an action"
            cta="Simulate"
            onClick={() => setShowAsk(true)}
          />
        </section>

        {/* History & Logs */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action history */}
          <div className="rounded-2xl bg-white shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Recent Actions</h3>
              <span className="text-xs text-gray-500">{actions.length} entries</span>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Type</Th>
                    <Th>Details</Th>
                    <Th>Status</Th>
                    <Th>When</Th>
                  </tr>
                </thead>
                <tbody>
                  {actions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-8">No actions yet. Try proposing one above.</td>
                    </tr>
                  ) : (
                    actions.map((a) => (
                      <tr key={a.id} className="border-t">
                        <Td>{labelForType(a.type)}</Td>
                        <Td>{a.details}</Td>
                        <Td>
                          <StatusPill status={a.status} />
                        </Td>
                        <Td>{timeAgo(a.timestamp)}</Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agent log */}
          <div className="rounded-2xl bg-white shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"><Activity className="h-5 w-5"/> Agent Log Output (mock)</h3>
              <button
                onClick={() => setLogs([])}
                className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
            <div className="p-4">
              <div className="h-72 overflow-auto font-mono text-sm bg-gray-50 border rounded-xl p-3">
                {logs.length === 0 ? (
                  <div className="text-gray-500">Log is empty.</div>
                ) : (
                  logs.map((l) => (
                    <div key={l.id} className="py-0.5">
                      <span className={`inline-block w-16 text-xs uppercase tracking-wide ${
                        l.level === "success" ? "text-emerald-600" : l.level === "error" ? "text-red-600" : l.level === "warn" ? "text-amber-600" : "text-gray-600"
                      }`}>
                        {l.level}
                      </span>
                      <span className="text-gray-800">{l.message}</span>
                      <span className="text-gray-400 text-xs ml-2">{fmtTime(l.timestamp)}</span>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        </section>
        {/* Modals */}
        {showAdd && (
          <Modal onClose={() => setShowAdd(false)} title="Propose Add Liquidity">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Amount</label>
                  <input
                    type="number"
                    min={0}
                    step="0.0001"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="e.g., 5"
                    className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Token</label>
                  <select
                    value={addToken}
                    onChange={(e) => setAddToken(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                  >
                    {TOKENS.map((t) => (
                      <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAdd(false)} className="rounded-xl px-4 py-2 border hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddLiquidity} className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700">Propose</button>
              </div>
            </div>
          </Modal>
        )}

        {showWithdraw && (
          <Modal onClose={() => setShowWithdraw(false)} title="Withdraw">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Amount</label>
                  <input
                    type="number"
                    min={0}
                    step="0.0001"
                    value={wdAmount}
                    onChange={(e) => setWdAmount(e.target.value)}
                    placeholder="e.g., 2.5"
                    className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Token</label>
                  <select
                    value={wdToken}
                    onChange={(e) => setWdToken(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                  >
                    {TOKENS.map((t) => (
                      <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowWithdraw(false)} className="rounded-xl px-4 py-2 border hover:bg-gray-50">Cancel</button>
                <button onClick={handleWithdraw} className="rounded-xl px-4 py-2 bg-gray-900 text-white hover:bg-black">Withdraw</button>
              </div>
            </div>
          </Modal>
        )}

        {showAsk && (
          <Modal onClose={() => setShowAsk(false)} title="Simulate Agent Ask()">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Prompt</label>
                <textarea
                  value={askPrompt}
                  onChange={(e) => setAskPrompt(e.target.value)}
                  placeholder="e.g., Maintain 50% LP. Should we add liquidity now?"
                  rows={4}
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAsk(false)} className="rounded-xl px-4 py-2 border hover:bg-gray-50">Cancel</button>
                <button onClick={handleAgentAsk} className="rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700">Simulate</button>
              </div>
            </div>
          </Modal>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-xs text-gray-500">
        Mock UI for development only. Do not use with real funds.
      </footer>
    </div>
  );
}

// ---------- Small UI primitives ----------

function StatCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 p-5">
      <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
      <div className="text-2xl font-semibold mt-1 text-gray-800 dark:text-gray-100">{value}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-400 mt-2">{sub}</div>}
    </div>
  );
}

function ActionCard({ icon, title, desc, cta, onClick }: { icon: React.ReactNode; title: string; desc: string; cta: string; onClick: () => void }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700 p-5 flex flex-col">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-2">{icon}</div>
        <h3 className="font-semibold dark:text-gray-100">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex-1">{desc}</p>
      <div className="pt-3">
        <button onClick={onClick} className="rounded-xl px-4 py-2 bg-gray-900 text-white hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-700">{cta}</button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-xl border dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 border dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-100">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: ActionRecord["status"] }) {
  const styles =
    status === "confirmed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
      : status === "rejected"
      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
  return <span className={`inline-block text-xs px-2 py-1 rounded-lg border ${styles}`}>{status}</span>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 px-4 py-2">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{children}</td>;
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function shortAddr(a: string) {
  if (a.length <= 10) return a;
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
