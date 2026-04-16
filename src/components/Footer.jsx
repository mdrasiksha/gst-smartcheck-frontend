export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 text-sm text-slate-600 md:grid-cols-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Online InvoiceConverter</h3>
          <p className="mt-3">
            Convert invoices to Excel using AI. Extract invoice data from PDF and images with high
            accuracy.
          </p>
          <ul className="mt-3 space-y-1 text-xs">
            <li>Files deleted after 24 hours</li>
            <li>SSL encrypted connections</li>
            <li>7-day money-back guarantee</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">Related Tools</h4>
          <ul className="mt-3 space-y-1">
            <li>PDF Invoice to Excel</li>
            <li>PNG Invoice to Excel</li>
            <li>JPG Invoice to Excel</li>
            <li>JPEG Invoice to Excel</li>
            <li>HEIC Invoice to Excel</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">Company</h4>
          <ul className="mt-3 space-y-1">
            <li>Invoice to Excel</li>
            <li>About Us</li>
            <li>Pricing</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900">Legal</h4>
          <ul className="mt-3 space-y-1">
            <li>Privacy Policy</li>
            <li>Terms &amp; Conditions</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © 2026 OnlineInvoiceConverter.com. All rights reserved.
      </p>
    </footer>
  );
}
