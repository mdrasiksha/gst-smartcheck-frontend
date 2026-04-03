import React, { useMemo, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import * as ToggleGroup from "https://esm.sh/@radix-ui/react-toggle-group@1.1.10";
import * as Dialog from "https://esm.sh/@radix-ui/react-dialog@1.1.14";
import {
  CheckCircle2,
  Download,
  FileText,
  History,
  KeyRound,
  LoaderCircle,
  Settings,
  Shield,
  Upload,
  Zap,
} from "https://esm.sh/lucide-react@0.511.0?deps=react@18.2.0";

const MAX_FILES = 50;
const ALLOWED_TYPES = ["application/pdf"];

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const nextStatus = (status) => {
  if (status === "queued") return "scanning";
  if (status === "scanning") return "converting";
  if (status === "converting") return "ready";
  return status;
};

const statusStyles = {
  queued: "text-slate-400 border-slate-700 bg-slate-800/60",
  scanning: "text-amber-300 border-amber-600/40 bg-amber-500/10",
  converting: "text-blue-300 border-blue-600/40 bg-blue-500/10",
  ready: "text-emerald-300 border-emerald-600/40 bg-emerald-500/10",
};

const navItems = [
  { label: "Upload", icon: Upload, active: true },
  { label: "History", icon: History },
  { label: "Settings", icon: Settings },
  { label: "API Keys", icon: KeyRound },
];

function App() {
  const [mode, setMode] = useState("batch");
  const [format, setFormat] = useState("xlsx");
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState([]);

  const completed = queue.filter((item) => item.status === "ready").length;
  const progress = queue.length ? Math.round((completed / queue.length) * 100) : 0;

  const activityText = useMemo(() => {
    if (!queue.length) return "Waiting for files";
    if (completed === queue.length) return "All queued files are ready";
    return `${queue.length - completed} file(s) still processing`;
  }, [queue, completed]);

  const enqueueFiles = (inputFiles) => {
    const incoming = Array.from(inputFiles)
      .filter((file) => ALLOWED_TYPES.includes(file.type) || file.name.toLowerCase().endsWith(".pdf"))
      .slice(0, MAX_FILES - queue.length)
      .map((file, index) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        status: "queued",
      }));

    if (!incoming.length) return;

    setQueue((prev) => [...prev, ...incoming]);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    enqueueFiles(event.dataTransfer.files);
  };

  const runQueue = () => {
    setQueue((prev) => prev.map((item) => ({ ...item, status: nextStatus(item.status) })));
  };

  const readyCount = queue.filter((item) => item.status === "ready").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-700/70 bg-slate-900/50 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col p-5">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-2">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">SmartCheck GST</p>
                <h1 className="text-base font-semibold">Invoice Workspace</h1>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                      item.active
                        ? "border-blue-500/30 bg-blue-600/15 text-blue-200"
                        : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">System Status</p>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <p>Free beta quota: <span className="mono text-slate-100">7 / 10 left</span></p>
                <p>GSTIN checksum: <span className="text-emerald-400">Mod-36 active</span></p>
                <p>Workspace capacity: <span className="mono text-slate-100">{MAX_FILES} files</span></p>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700/80">
                    Configure API Access
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-slate-950/70" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-700 bg-slate-900 p-5">
                    <Dialog.Title className="text-lg font-semibold">API Keys</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-slate-400">
                      Rotate keys, enforce scopes, and monitor API usage from the secure settings panel.
                    </Dialog.Description>
                    <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800 p-3 mono text-xs text-slate-300">
                      sk_live_************************
                    </div>
                    <Dialog.Close asChild>
                      <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
                        Done
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
        </aside>

        <main className="p-4 md:p-8">
          <section className="mx-auto max-w-6xl rounded-2xl border border-slate-700 bg-slate-900/50 p-6 md:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Convert Workspace</p>
                <h2 className="mt-1 text-2xl font-semibold">GST Invoice Converter</h2>
              </div>
              <button
                onClick={runQueue}
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                <Zap className="h-4 w-4" />
                Process Queue
              </button>
            </div>

            <div className="mb-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-slate-500">Processing Mode</p>
                <ToggleGroup.Root
                  type="single"
                  value={mode}
                  onValueChange={(value) => value && setMode(value)}
                  className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900"
                >
                  <ToggleGroup.Item value="single" className="px-3 py-2 text-sm text-slate-300 data-[state=on]:bg-slate-800 data-[state=on]:text-blue-300">
                    Single
                  </ToggleGroup.Item>
                  <ToggleGroup.Item value="batch" className="px-3 py-2 text-sm text-slate-300 data-[state=on]:bg-slate-800 data-[state=on]:text-blue-300">
                    Batch 50+
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-slate-500">Output Format</p>
                <ToggleGroup.Root
                  type="single"
                  value={format}
                  onValueChange={(value) => value && setFormat(value)}
                  className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-900"
                >
                  <ToggleGroup.Item title="Excel output for audit and analysis" value="xlsx" className="px-3 py-2 text-sm text-slate-300 data-[state=on]:bg-slate-800 data-[state=on]:text-blue-300">
                    Excel (.xlsx)
                  </ToggleGroup.Item>
                  <ToggleGroup.Item title="Tally XML for ERP 9 and Prime" value="xml" className="px-3 py-2 text-sm text-slate-300 data-[state=on]:bg-slate-800 data-[state=on]:text-blue-300">
                    Tally XML
                  </ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>
            </div>

            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`mb-5 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition ${
                dragging ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-900/60"
              }`}
            >
              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                className="hidden"
                onChange={(event) => enqueueFiles(event.target.files)}
              />
              <FileText className="mb-4 h-10 w-10 text-blue-400" />
              <p className="text-lg font-medium">Drag & Drop GST PDFs</p>
              <p className="mt-2 text-sm text-slate-400">Queue multiple files (PDF only, max {MAX_FILES} files per workspace).</p>
            </label>

            <div className="mb-5 rounded-xl border border-slate-700 bg-slate-900 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">Visual Progress</span>
                <span className="mono text-slate-400">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{activityText}</p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900/80">
              <div className="border-b border-slate-700 px-4 py-3 text-sm font-medium text-slate-200">Live Queue</div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Filename</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.length === 0 ? (
                      <tr>
                        <td className="px-4 py-5 text-slate-500" colSpan={4}>No files queued yet.</td>
                      </tr>
                    ) : (
                      queue.map((item) => (
                        <tr key={item.id} className="border-t border-slate-800">
                          <td className="px-4 py-3 mono text-xs text-slate-200">{item.name}</td>
                          <td className="px-4 py-3 text-slate-300">{formatBytes(item.size)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs ${statusStyles[item.status]}`}>
                              {item.status === "ready" ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                              )}
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              disabled={item.status !== "ready"}
                              className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <footer className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> SOC2 Type II</span>
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> AES-256 Encrypted</span>
              <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Mod-36 Validated</span>
              <span className="ml-auto mono text-slate-500">Ready files: {readyCount}</span>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
