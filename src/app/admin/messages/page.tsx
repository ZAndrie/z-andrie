import prisma from "@/lib/prisma";
import { Mail, CheckCircle } from "lucide-react";

export default async function MessagesAdminPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-serif text-[var(--color-text-dark)] uppercase mb-2">
          Inbox <span className="text-[var(--color-primary)] font-light italic">Messages</span>
        </h1>
        <p className="text-sm font-light text-gray-500 max-w-xl">
          View all messages submitted through the contact form on your portfolio.
        </p>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-md overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[var(--color-light-bg)] rounded-full flex items-center justify-center mb-4 text-[var(--color-primary)]">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-dark)] mb-2">No messages yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              When someone contacts you through your portfolio, their message will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-light-bg)] border-b border-[var(--color-border)]">
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Sender</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Message</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Date</th>
                  <th className="p-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id} className="border-b border-[var(--color-border)] hover:bg-gray-50 transition-colors">
                    <td className="p-4 min-w-[200px]">
                      <div className="font-bold text-[var(--color-text-dark)] mb-1">{msg.name}</div>
                      <a href={`mailto:${msg.email}`} className="text-xs text-[var(--color-primary)] hover:underline">
                        {msg.email}
                      </a>
                    </td>
                    <td className="p-4 min-w-[300px] max-w-[500px]">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</div>
                    </td>
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {msg.isRead ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle size={12} /> Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
