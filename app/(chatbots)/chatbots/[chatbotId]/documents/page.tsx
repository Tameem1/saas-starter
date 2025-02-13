// app/(chatbots)/chatbots/[chatbotId]/documents/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api/api";
import { parseJwt } from "@/lib/client-api/jwt";

export default function DocumentManagementPage() {
  const router = useRouter();
  const params = useParams();
  const chatbotId = params.chatbotId;

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ingesting, setIngesting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [chatbotId]);

  async function fetchDocuments() {
    try {
      setLoadingDocs(true);
      const data = await apiFetch(`/api/chatbots/${chatbotId}/documents`);
      setDocuments(data);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      alert(`Failed to fetch documents: ${err.message}`);
    } finally {
      setLoadingDocs(false);
    }
  }

  async function handleDelete(docId: string) {
    try {
      await apiFetch(`/api/chatbots/${chatbotId}/documents/${docId}`, {
        method: "DELETE",
      });
      alert("Document deleted.");
      fetchDocuments();
    } catch (err: any) {
      console.error("Error deleting doc:", err);
      alert(`Failed: ${err.message}`);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleUpload() {
    if (!file) {
      alert("Select a file first!");
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
      alert("Upload success.");
      fetchDocuments();
    } catch (err: any) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleIngest() {
    try {
      setIngesting(true);
      const token = localStorage.getItem("token");
      const claims = parseJwt(token);
      const customerId = claims.customer_id;
      await apiFetch(`/api/${customerId}/${chatbotId}/ingest`, { method: "POST" });
      alert("Ingest success.");
    } catch (err: any) {
      console.error(err);
      alert("Ingest failed: " + err.message);
    } finally {
      setIngesting(false);
    }
  }

  return (
    <div>
      <h1>Manage Documents</h1>
      <button onClick={() => router.push(`/chatbots/chatbots/${chatbotId}`)}>
        Back to Chat History
      </button>
      <button onClick={() => router.push("/chatbots/my-chatbots")}>
        Back to My Chatbots
      </button>

      <h2>Existing Documents</h2>
      {loadingDocs ? (
        <p>Loading documents...</p>
      ) : (
        <ul>
          {documents.map((doc: any) => (
            <li key={doc.id}>
              {doc.filename}
              <button onClick={() => handleDelete(doc.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <hr />
      <h2>Upload a New Document</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <hr />
      <h2>Re-Ingest Documents</h2>
      <button onClick={handleIngest} disabled={ingesting}>
        {ingesting ? "Ingesting..." : "Ingest"}
      </button>
    </div>
  );
}