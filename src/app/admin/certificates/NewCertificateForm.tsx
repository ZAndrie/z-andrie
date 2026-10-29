"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, PlusCircle } from "lucide-react";
import { uploadCertificateToGitHub } from "./actions";

export default function NewCertificateForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setStatusMessage(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const title = (formData.get("title") as string).trim();
      const issuer = (formData.get("issuer") as string).trim();
      const date = (formData.get("date") as string).trim();

      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await uploadCertificateToGitHub({
        title,
        issuer,
        date,
        fileName: file.name,
        fileBase64: base64Data,
      });

      if (res.success) {
        setStatusMessage({
          type: "success",
          text: `Successfully committed "${title}" to GitHub!`,
        });
        handleRemoveFile();
        form.reset();
        router.refresh();
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to commit certificate to GitHub.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An unexpected error occurred during upload.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0e0e12]/95 border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-4 font-mono relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--color-primary)]/10 rounded-bl-2xl pointer-events-none" />

      <div>
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[2px] text-gray-500 mb-1">
          <PlusCircle size={13} className="text-[var(--color-primary)]" />
          <span>VAULT // ARCHIVE_CREDENTIAL</span>
        </div>
        <h3 className="font-stencil text-2xl text-white uppercase tracking-wider">
          REGISTER AWARD
        </h3>
        <p className="text-[11px] text-gray-400 font-light mt-1">
          Commits document directly to <code className="text-white bg-black/40 px-1 py-0.5 rounded">certificates/</code>.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-[11px] leading-relaxed flex items-start gap-2.5 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              : "bg-red-500/10 text-red-300 border border-red-500/30"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          )}
          <div>{statusMessage.text}</div>
        </div>
      )}

      {/* Upload Box */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400">
          Document Artwork (Image / PDF) *
        </label>

        {previewUrl ? (
          <div className="relative h-44 w-full bg-black border border-white/10 rounded-lg overflow-hidden">
            {file?.type === "application/pdf" || file?.name.toLowerCase().endsWith(".pdf") ? (
              <iframe src={previewUrl} className="w-full h-full object-cover" title="PDF Preview" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2 bg-black" />
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider rounded shadow transition-colors z-10"
            >
              Reset File
            </button>
          </div>
        ) : (
          <label className="border border-dashed border-white/15 hover:border-[var(--color-primary)]/50 bg-black/40 hover:bg-black/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
            <UploadCloud size={24} className="text-gray-500 group-hover:text-[var(--color-primary)] mb-2 transition-colors" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">
              Select Certificate File
            </span>
            <span className="text-[9px] text-gray-500 mt-1">PNG, JPG, WEBP, or PDF</span>
            <input
              ref={fileInputRef}
              type="file"
              required
              accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
            Certificate Designation / Title *
          </label>
          <input
            name="title"
            required
            placeholder="e.g. Cisco CyberOps Associate"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
            Issuing Entity / Organization *
          </label>
          <input
            name="issuer"
            required
            placeholder="e.g. Cisco, DICT, Cor Jesu College"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 block mb-1">
            Date Issued *
          </label>
          <input
            name="date"
            required
            placeholder="e.g. 2024 or Oct 2024"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      <button
        disabled={loading || !file}
        type="submit"
        className="mt-2 bg-[var(--color-primary)] hover:bg-[#d0350e] text-white p-3.5 font-bold uppercase tracking-[2px] text-[11px] rounded-lg shadow-lg shadow-[var(--color-primary)]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>COMMITTING TO GITHUB...</span>
          </>
        ) : (
          "COMMIT TO GITHUB"
        )}
      </button>
    </form>
  );
}
