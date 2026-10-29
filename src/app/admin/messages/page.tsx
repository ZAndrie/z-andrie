import { Mail, ExternalLink, ShieldCheck, Phone, Inbox, Radio } from "lucide-react";

export default function MessagesAdminPage() {
  return (
    <div className="flex flex-col gap-8 pb-20 font-mono">
      {/* Header Deck */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          SECTOR // SEC-06 // COMMS_DISPATCH
        </div>
        <h1 className="font-stencil text-4xl text-white uppercase tracking-wider mb-2">
          INBOX &amp; <span className="text-[var(--color-primary)]">SIGNAL RELAY</span>
        </h1>
        <p className="text-gray-400 font-mono text-[13px] leading-relaxed max-w-2xl font-light">
          Real-time inquiries and contact transmissions from Stage 07 Co-Op Lobby. All submissions route instantly through Web3Forms straight to your verified email.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0e0e12]/95 border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[2px] text-gray-500">RELAY STATUS</div>
              <div className="text-sm font-stencil text-emerald-400 uppercase tracking-wide">100% OPERATIONAL</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed font-light">
            Transmissions are protected with automated anti-spam screening and forwarded with 0s latency.
          </p>
        </div>

        <div className="bg-[#0e0e12]/95 border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[2px] text-gray-500">TARGET INBOX</div>
              <div className="text-xs font-bold text-white truncate max-w-[190px]">zandriebarraba.1305@gmail.com</div>
            </div>
          </div>
          <a
            href="https://mail.google.com/mail/u/0/#search/Z+Andrie+Portfolio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-primary)] hover:text-white uppercase tracking-wider transition-colors"
          >
            Open in Gmail <ExternalLink size={12} />
          </a>
        </div>

        <div className="bg-[#0e0e12]/95 border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[2px] text-gray-500">SECURE COMMS</div>
              <div className="text-sm font-stencil text-white tracking-wider">+63 928 589 3984</div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed font-light">
            Primary direct voice/SMS uplink broadcasted in Stage 07 and encoded in portfolio telemetry.
          </p>
        </div>
      </div>

      {/* Main Signal Relay Box */}
      <div className="bg-[#0e0e12]/95 border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/10 rounded-bl-full pointer-events-none" />

        <div className="w-16 h-16 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center mb-5 text-[var(--color-primary)] shadow-lg">
          <Inbox size={28} />
        </div>
        <h3 className="text-2xl font-stencil text-white mb-2 uppercase tracking-wider">
          LIVE DISPATCH RELAY ACTIVE
        </h3>
        <p className="text-xs text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed font-light">
          When clients, developers, or scouts initiate contact through your portfolio form, the message payload is dispatched directly to <strong className="text-white">zandriebarraba.1305@gmail.com</strong>.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://mail.google.com/"
            target="_blank"
            rel="noreferrer"
            className="bg-[var(--color-primary)] hover:bg-[#d0350e] text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[2px] transition-all inline-flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/25"
          >
            <Mail size={15} />
            <span>OPEN GMAIL INBOX</span>
          </a>
          <a
            href="/#contact"
            target="_blank"
            rel="noreferrer"
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[2px] transition-all inline-flex items-center gap-2"
          >
            <Radio size={15} className="text-[var(--color-primary)]" />
            <span>TEST CO-OP FORM</span>
          </a>
        </div>
      </div>
    </div>
  );
}
