// app/(chatbots)/chat-demo/page.tsx
"use client";

import DemoChatInterface from "@/components/DemoChatInterface";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatDemoPage() {
  const router = useRouter();
  const chatbotId = typeof window !== "undefined" ? sessionStorage.getItem("chatbot_id") : null;

  function handleIntegrateClick() {
    if (!chatbotId) {
      alert("No chatbot ID found. Please create a chatbot first.");
      return;
    }
    router.push("/chatbots/integration");
  }

  useEffect(() => {
    if (!chatbotId) {
      // If user navigates directly here without creating a chatbot
      alert("No chatbot_id in sessionStorage. Redirecting to My Chatbots.");
      router.push("/chatbots/my-chatbots");
    }
  }, [chatbotId, router]);

  return (
    <div>
      <h1>Chat Demo (10-message limit)</h1>
      <p>Test your chatbot in this limited demo environment (10 messages).</p>

      <DemoChatInterface chatbotId={chatbotId || ""} />

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleIntegrateClick}>Integrate with your website</button>
      </div>
    </div>
  );
}