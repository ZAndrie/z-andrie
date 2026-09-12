import { Mail, ExternalLink, ShieldCheck, Phone, Inbox } from "lucide-react";

export default function MessagesAdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">
          Inbox &amp; <span className="text-[var(--color-primary)] font-light italic">Inquiries</span>
        </h1>
        <p className="text-sm font-light text-gray-500 max-w-xl">
          Contact submissions from your portfolio are delivered directly to your verified email via Web3Forms.
        </p>
      </div>

      {/* Integration Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Delivery Status</div>
              <div className="text-sm font-bold text-green-700">Active &amp; Verified</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Form submissions are protected with spam filtering and forwarded instantly.
          </p>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-light-bg)] text-[var(--color-primary)] flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Destination Inbox</div>
              <div className="text-xs font-bold text-[var(--color-text-dark)] truncate max-w-[180px]">zandriebarraba.1305@gmail.com</div>
            </div>
          </div>
          <a
            href="https://mail.google.com/mail/u/0/#search/Z+Andrie+Portfolio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline uppercase tracking-wider"
          >
            Open in Gmail <ExternalLink size={12} />
          </a>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Direct Phone</div>
              <div className="text-sm font-bold text-[var(--color-text-dark)]">+63 928 589 3984</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Displayed on your public contact section and encoded in your portfolio QR code.
          </p>
        </div>
      </div>

      {/* Main Info Box */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-10 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-[var(--color-light-bg)] rounded-full flex items-center justify-center mb-4 text-[var(--color-primary)]">
          <Inbox size={28} />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-2 font-serif uppercase">
          Direct Email Dispatch Active
        </h3>
        <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6 leading-relaxed">
          Whenever a visitor submits the contact form on your portfolio, Web3Forms automatically delivers their name, email, and message directly to <strong className="text-[var(--color-text-dark)]">zandriebarraba.1305@gmail.com</strong>.
        </p>
        <div className="flex gap-4">
          <a
            href="https://mail.google.com/"
            target="_blank"
            rel="noreferrer"
            className="bg-[var(--color-text-dark)] hover:bg-[var(--color-primary)] text-white px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2"
          >
            <Mail size={14} /> Check Gmail Inbox
          </a>
          <a
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded text-[11px] font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-2"
          >
            <ExternalLink size={14} /> Test Contact Form
          </a>
        </div>
      </div>
    </div>
  );
}
