// app/(chatbots)/create-chatbot/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api/api";

export default function CreateChatbotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreateClick() {
    if (!name.trim()) {
      alert("Please provide a name.");
      return;
    }
    try {
      setCreating(true);
      const chatbot = await apiFetch("/api/chatbots", {
        method: "POST",
        body: { name, description },
      });
      sessionStorage.setItem("chatbot_id", chatbot.id);
      router.push("/chatbots/upload-ingest");
    } catch (err) {
      console.error(err);
      alert("Failed to create chatbot: " + err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1>Create a New Chatbot</h1>
      <input
        placeholder="Chatbot Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={creating}
      />
      <br />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={creating}
      />
      <br />
      <button onClick={handleCreateClick} disabled={creating}>
        {creating ? "Creating..." : "Create Chatbot"}
      </button>
    </div>
  );
}