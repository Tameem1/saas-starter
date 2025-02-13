// app/(chatbots)/model-selection/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ModelSelectionPage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState("");

  async function handleContinue() {
    if (!selectedModel) {
      alert("Please select a model first!");
      return;
    }
    // Possibly call your API to store the chosen model:
    // await apiFetch(`/api/chatbots/${chatbotId}/set-model`, { method: "PATCH", body: { model: selectedModel } });
    router.push("/chatbots/chat-demo");
  }

  return (
    <div>
      <h1>Model Selection</h1>
      <p>Select the model you want to use for your chatbot:</p>
      <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="">-- Select a Model --</option>
        <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
        <option value="bard">Google Bard</option>
        <option value="fireworks-32b-qwen">Fireworks 32B Qwen</option>
      </select>
      <br />
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
}