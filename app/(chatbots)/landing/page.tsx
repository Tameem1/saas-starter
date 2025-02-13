// app/(chatbots)/landing/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api/api";

export default function LandingPage() {
  const router = useRouter();

  // For the new chatbot
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreateClick() {
    if (!name.trim()) {
      alert("Please provide a name for your chatbot.");
      return;
    }
    try {
      setCreating(true);
      const body = { name, description };
      const chatbot = await apiFetch("/api/chatbots", { method: "POST", body });
      // Suppose the server returns `{ id: "..." }`
      sessionStorage.setItem("chatbot_id", chatbot.id);
      router.push("/chatbots/upload-ingest");
    } catch (err) {
      console.error("Create chatbot error:", err);
      alert("Failed to create chatbot: " + err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1>Create a New Chatbot</h1>
      <p>Fill out the name and optional description for your chatbot.</p>

      <div style={{ margin: "20px 0" }}>
        <label>Chatbot Name:</label>
        <br />
        <input
          type="text"
          placeholder="e.g. My Customer Support Bot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={creating}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ margin: "20px 0" }}>
        <label>Description (optional):</label>
        <br />
        <textarea
          placeholder="Describe your chatbot's purpose..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={creating}
          style={{ width: "100%", padding: "8px", height: "80px" }}
        />
      </div>

      <button onClick={handleCreateClick} disabled={creating}>
        {creating ? "Creating..." : "Create Chatbot"}
      </button>
    </div>
  );
}