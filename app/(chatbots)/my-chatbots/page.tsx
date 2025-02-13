// app/(chatbots)/my-chatbots/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api/api";
import { parseJwt } from "@/lib/client-api/jwt";

export default function MyChatbotsPage() {
  const router = useRouter();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      // For example, you might want to retrieve user token from cookies or client side
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found, user not logged in.");
      const claims = parseJwt(token);
      if (!claims?.customer_id) {
        throw new Error("No customer_id in token claims.");
      }
      const customerId = claims.customer_id;

      // 1) Fetch the user's chatbots
      const botsData = await apiFetch("/api/chatbots");
      setChatbots(botsData);

      // 2) Also fetch usage info
      const usageData = await apiFetch(`/api/${customerId}/usage`);
      setUsage(usageData);
    } catch (error) {
      console.error("Failed to load chatbots or usage:", error);
      alert("Failed to load chatbots or usage: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteChatbot(chatbotId: string) {
    if (!window.confirm("Are you sure you want to delete this chatbot?")) return;
    try {
      await apiFetch(`/api/chatbots/${chatbotId}`, { method: "DELETE" });
      alert("Chatbot deleted successfully!");
      fetchAllData();
    } catch (err) {
      console.error("Error deleting chatbot:", err);
      alert("Failed to delete chatbot: " + err.message);
    }
  }

  return (
    <div>
      <h1>My Chatbots</h1>

      {usage && (
        <div style={{ margin: "10px 0", textAlign: "left" }}>
          <p><strong>Total Tokens Used:</strong> {usage.tokens_used_total}</p>
          <p><strong>Tokens Remaining:</strong> {usage.tokens_remaining}</p>
          <p>
            Input Tokens: {usage.tokens_used_input}, 
            Output Tokens: {usage.tokens_used_output}
          </p>
        </div>
      )}

      <button onClick={() => router.push("/chatbots/create-chatbot")}>
        Create New Chatbot
      </button>

      {loading ? (
        <p>Loading chatbots...</p>
      ) : (
        <div>
          {chatbots.length === 0 ? (
            <p>No chatbots found. Create one!</p>
          ) : (
            chatbots.map((chatbot: any) => (
              <div key={chatbot.id} className="chatbot-item">
                <h3
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/chatbots/chatbots/${chatbot.id}`)}
                >
                  {chatbot.name}
                </h3>
                <p>{chatbot.description}</p>
                <button
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={() => handleDeleteChatbot(chatbot.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}