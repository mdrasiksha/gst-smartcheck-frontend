export default function PricingPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-900">Pricing</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Free Plan</h2>
          <p className="mt-2 text-3xl font-bold">₹0</p>
          <p className="mt-1 text-slate-600">5 invoices</p>
        </article>

        <article className="rounded-2xl border-2 border-blue-500 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Pro Plan</h2>
          <p className="mt-2 text-3xl font-bold">₹299/month</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-600">
            <li>1000 invoices</li>
            <li>Faster processing</li>
            <li>Priority support</li>
          </ul>
          <button className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
            Upgrade
          </button>
        </article>
      </div>
    </section>
  );
}
