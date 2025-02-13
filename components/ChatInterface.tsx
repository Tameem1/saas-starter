// app/components/ChatInterface.tsx
"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/client-api/api";
import { parseJwt } from "@/lib/client-api/jwt";

type Props = {
  chatbotId: string;
};

export default function ChatInterface({ chatbotId }: Props) {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const claims = parseJwt(token);
      if (claims?.customer_id) {
        setCustomerId(claims.customer_id);
      }
    }
  }, []);

  async function handleSend() {
    if (!inputValue.trim()) return;
    if (!customerId) {
      alert("No customer ID available. Are you logged in?");
      return;
    }
    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await apiFetch(`/api/${customerId}/${chatbotId}/query`, {
        method: "POST",
        body: { question: userMessage.text },
      });
      const botMessage = {
        text: response.answer || "No answer found.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Query error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "Error retrieving answer", sender: "bot" },
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
            <strong>{msg.sender.toUpperCase()}: </strong>
            {msg.text}
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