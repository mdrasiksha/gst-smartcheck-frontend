import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Invoice OCR SaaS Frontend</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Convert invoices to Excel using AI. Extract invoice data from PDF and images with high
        accuracy.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/dashboard"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go to Dashboard
        </Link>
        <Link
          to="/pricing"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          View Pricing
        </Link>
      </div>
    </section>
  );
}
