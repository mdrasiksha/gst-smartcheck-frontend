const steps = ["Upload invoice", "AI extracts data", "Download Excel"];

export default function HowItWorksPage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">How It Works</h1>
      <p className="mt-3 text-slate-600">
        Convert invoices to Excel using AI. Extract invoice data from PDF and images with high
        accuracy.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-blue-600">Step {index + 1}</p>
            <p className="mt-2 font-semibold text-slate-900">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
