import { useMemo, useState } from "react";
import { uploadInvoice } from "../api";

const USED = 3;
const TOTAL = 5;

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const usagePercent = useMemo(() => Math.min(100, Math.round((USED / TOTAL) * 100)), []);

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Please choose a file first.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const payload = await uploadInvoice(selectedFile);

      if (payload.upgrade_required) {
        setShowUpgradeModal(true);
        return;
      }

      setMessage("Upload complete.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

      <div className="mt-6 rounded-xl border border-slate-200 p-5">
        <p className="text-sm font-semibold text-slate-700">Usage</p>
        <p className="mt-1 text-slate-600">3 / 5 used</p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${usagePercent}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
        />
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}

      {showUpgradeModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">Upgrade Required</h2>
            <p className="mt-2 text-slate-600">Upgrade to Pro (₹299/month) to continue</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
              >
                Close
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
