"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateCertificateOnGitHub } from "../actions";
import { useRouter } from "next/navigation";

export default function EditCertificateForm({ certificate }: { certificate: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(certificate.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    setPreviewUrl(certificate.imageUrl || "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const title = (formData.get("title") as string).trim();
      const issuer = (formData.get("issuer") as string).trim();
      const date = (formData.get("date") as string).trim();

      // Build update params
      const updateParams: {
        id: string;
        title: string;
        issuer: string;
        date: string;
        fileName?: string;
        fileBase64?: string;
      } = { id: certificate.id, title, issuer, date };

      // If user picked a new file, convert to base64
      if (file) {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        updateParams.fileName = file.name;
        updateParams.fileBase64 = base64Data;
      }

      const res = await updateCertificateOnGitHub(updateParams);

      if (res.success) {
        setStatusMessage({
          type: "success",
          text: `Successfully updated "${title}" on GitHub!`,
        });
        setTimeout(() => router.push("/admin/certificates"), 1500);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to update certificate on GitHub.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 border border-[var(--color-border)] shadow-sm flex flex-col gap-4 max-w-2xl mx-auto rounded-lg">
      <div>
        <h3 className="font-serif text-lg text-[var(--color-text-dark)] uppercase">Edit Certificate</h3>
        <p className="text-xs text-gray-500 font-light mt-0.5">
          Updates metadata &amp; image on <strong className="text-[var(--color-primary)]">Portfolio-Content (certificates/)</strong> via GitHub.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-md text-xs leading-relaxed flex items-start gap-2.5 ${
            statusMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
          )}
          <div>{statusMessage.text}</div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
          Certificate Image
        </label>

        {previewUrl ? (
          <div className="relative h-60 w-full bg-gray-100 border border-[var(--color-border)] rounded overflow-hidden">
            {previewUrl.includes("type=pdf") || previewUrl.includes(".pdf") ? (
              <iframe src={previewUrl} className="w-full h-full object-cover" title="PDF Preview" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={previewUrl} alt="Certificate" className="w-full h-full object-contain p-2 bg-slate-900" />
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded shadow hover:bg-black transition-colors z-10"
            >
              {file ? "Remove New File" : "Change Image"}
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-300 hover:border-[var(--color-primary)] bg-gray-50 hover:bg-gray-100/80 rounded p-6 flex flex-col items-center justify-center cursor-pointer transition-all group">
            <UploadCloud size={28} className="text-gray-400 group-hover:text-[var(--color-primary)] mb-2 transition-colors" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-gray-700 group-hover:text-[var(--color-primary)] transition-colors">
              Choose a New Certificate File
            </span>
            <span className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP, or PDF</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
            Certificate Title
          </label>
          <input
            name="title"
            defaultValue={certificate.title}
            required
            placeholder="e.g. AWS Certified Cloud Practitioner"
            className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
            Issuer / Organization
          </label>
          <input
            name="issuer"
            defaultValue={certificate.issuer}
            required
            placeholder="e.g. Amazon Web Services, Meta, Coursera"
            className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
            Date Issued
          </label>
          <input
            name="date"
            defaultValue={certificate.date}
            required
            placeholder="e.g. 2024 or Oct 2024"
            className="w-full border border-[var(--color-border)] rounded p-3 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/certificates")}
          className="flex-1 bg-gray-100 text-[var(--color-text-dark)] p-4 font-bold uppercase tracking-[2px] text-[11px] rounded hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="flex-1 bg-[var(--color-primary)] text-white p-4 font-bold uppercase tracking-[2px] text-[11px] rounded hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Updating on GitHub...</span>
            </>
          ) : (
            "Update Certificate"
          )}
        </button>
      </div>
    </form>
  );
}
