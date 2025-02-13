// app/(chatbots)/upload-ingest/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api/api";
import { parseJwt } from "@/lib/client-api/jwt";

export default function UploadIngestPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ingesting, setIngesting] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const chatbotId = typeof window !== "undefined" ? sessionStorage.getItem("chatbot_id") : null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const claims = parseJwt(token);
      if (claims?.customer_id) setCustomerId(claims.customer_id);
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleUploadClick() {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await apiFetch(`/api/upload/${chatbotId}`, {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      alert("Upload success!");
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleIngestClick() {
    if (!customerId) {
      alert("No customer ID found. Are you logged in?");
      return;
    }
    try {
      setIngesting(true);
      const res = await apiFetch(`/api/${customerId}/${chatbotId}/ingest`, {
        method: "POST",
      });
      alert("Ingest success: " + res.message);
    } catch (err: any) {
      console.error(err);
      alert("Ingest failed: " + err.message);
    } finally {
      setIngesting(false);
    }
  }

  function handleNextPage() {
    router.push("/chatbots/model-selection");
  }

  return (
    <div>
      <h1>Upload & Ingest</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUploadClick} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Documents"}
      </button>

      <br />
      <button onClick={handleIngestClick} disabled={ingesting}>
        {ingesting ? "Ingesting..." : "Ingest"}
      </button>

      <br />
      <button onClick={handleNextPage}>Next</button>
    </div>
  );
}