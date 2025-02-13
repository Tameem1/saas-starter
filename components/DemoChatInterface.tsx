// app/components/DemoChatInterface.tsx
"use client";

import React, { useState } from "react";
import { apiFetch } from "@/lib/client-api/api";

type Props = {
  chatbotId: string;
};

export default function DemoChatInterface({ chatbotId }: Props) {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!inputValue.trim()) return;
    if (!chatbotId) {
      alert("No chatbot ID provided.");
      return;
    }
    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await apiFetch(`/api/demo/query`, {
        method: "POST",
        body: {
          chatbot_id: chatbotId,
          question: userMessage.text,
        },
      });
      if (response.limit_reached) {
        setMessages((prev) => [
          ...prev,
          {
            text: response.answer || "Demo limit reached. Please create a full chatbot.",
            sender: "bot",
          },
        ]);
        return;
      }
      const botMessage = {
        text: response.answer || "No answer found.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Demo query error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Error during demo query: " + err.message, sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.sender}`}>
            <strong>{msg.sender.toUpperCase()}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={inputValue}
          placeholder="Ask a question..."
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}