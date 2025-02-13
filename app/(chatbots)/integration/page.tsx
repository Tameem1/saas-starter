// app/(chatbots)/integration/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api/api";

export default function IntegrationPage() {
  const router = useRouter();
  const [snippet, setSnippet] = useState("");
  const [loading, setLoading] = useState(false);
  const chatbotId = typeof window !== "undefined" ? sessionStorage.getItem("chatbot_id") : null;

  useEffect(() => {
    async function fetchSnippet() {
      if (!chatbotId) {
        alert("No chatbot ID found in session.");
        router.push("/chatbots/my-chatbots");
        return;
      }
      setLoading(true);
      try {
        const data = await apiFetch(`/api/chatbots/${chatbotId}/snippet`, { method: "GET" });
        setSnippet(data.snippet || "");
      } catch (err: any) {
        console.error("Error fetching snippet:", err);
        alert(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchSnippet();
  }, [chatbotId, router]);

  async function handleCopySnippet() {
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet);
      alert("Snippet copied to clipboard!");
    } catch (err: any) {
      alert("Failed to copy snippet: " + err.message);
    }
  }

  return (
    <div>
      <h1>Integration Snippet</h1>
      {loading ? (
        <p>Loading snippet...</p>
      ) : snippet ? (
        <>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f9f9f9",
              padding: "10px",
            }}
          >
            {snippet}
          </pre>
          <button onClick={handleCopySnippet}>Copy Snippet</button>
        </>
      ) : (
        <p>No snippet available.</p>
      )}

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => router.push("/chatbots/chat-demo")}>
          Back to Demo
        </button>
        <button onClick={() => router.push("/chatbots/my-chatbots")}>
          Back to My Chatbots
        </button>
      </div>
    </div>
  );
}