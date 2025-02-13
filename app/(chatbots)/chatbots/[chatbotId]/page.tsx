// app/(chatbots)/chatbots/[chatbotId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api/api";
import { parseJwt } from "@/lib/client-api/jwt";

export default function ChatHistoryPage() {
  const router = useRouter();
  // In Next 13, useParams() returns an object with your route segments
  const params = useParams(); 
  const chatbotId = params.chatbotId;

  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [snippetLoading, setSnippetLoading] = useState(false);
  const [snippet, setSnippet] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbotId]);

  async function fetchHistory() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token in localStorage.");
      const claims = parseJwt(token);
      if (!claims?.customer_id) throw new Error("No customer_id in token.");
      const customerId = claims.customer_id;

      const data = await apiFetch(`/api/${customerId}/${chatbotId}/history`);
      setChatHistory(data.chat_history || []);
    } catch (err: any) {
      console.error("Error fetching chat history:", err);
      alert(`Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleShowSnippet() {
    try {
      setSnippetLoading(true);
      const data = await apiFetch(`/api/chatbots/${chatbotId}/snippet`);
      if (!data.snippet) {
        alert("No snippet returned.");
        return;
      }
      setSnippet(data.snippet);
      setIsModalOpen(true);
    } catch (err: any) {
      console.error("Error fetching snippet:", err);
      alert("Snippet error: " + err.message);
    } finally {
      setSnippetLoading(false);
    }
  }

  async function handleCopySnippet() {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      alert("Snippet copied!");
    } catch (err: any) {
      alert("Failed to copy snippet: " + err.message);
    }
  }

  async function handleClearHistory() {
    try {
      const token = localStorage.getItem("token");
      const claims = parseJwt(token);
      const customerId = claims.customer_id;
      await apiFetch(`/api/${customerId}/${chatbotId}/history`, { method: "DELETE" });
      setChatHistory([]);
      alert("History cleared.");
    } catch (error: any) {
      console.error("Error clearing chat history:", error);
      alert("Failed to clear: " + error.message);
    }
  }

  function handleModifyDocuments() {
    router.push(`/chatbots/chatbots/${chatbotId}/documents`);
  }

  return (
    <div>
      <h1>Chat History</h1>
      {loading ? (
        <p>Loading chat history...</p>
      ) : (
        <div className="chat-history">
          {chatHistory.map((entry: any) => (
            <div key={entry.id} className="chat-message">
              <p><strong>User:</strong> {entry.question}</p>
              <p><strong>Bot:</strong> {entry.answer}</p>
              <small>{entry.timestamp}</small>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleClearHistory}>Clear Chat History</button>
      <button onClick={handleShowSnippet} disabled={snippetLoading}>
        {snippetLoading ? "Loading Snippet..." : "Show Snippet"}
      </button>
      <button onClick={handleModifyDocuments}>Modify Documents</button>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "600px",
              position: "relative"
            }}
          >
            <h2>Integration Snippet</h2>
            <pre style={{ background: "#f9f9f9", padding: "10px", marginBottom: "10px" }}>
              {snippet}
            </pre>
            <button onClick={handleCopySnippet} style={{ marginRight: "10px" }}>
              Copy Snippet
            </button>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}