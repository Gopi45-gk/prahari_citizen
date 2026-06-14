const CHAT_API_URL = "/api/chat";

export async function sendChatMessage(messages, language = "en") {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, language })
    });

    if (!response.ok) {
      let errorBody = "";
      try {
        const errJson = await response.json();
        errorBody = JSON.stringify(errJson);
      } catch (e) {
        errorBody = await response.text();
      }
      throw new Error(`Chat API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Chat service error:", error);
    throw error;
  }
}
