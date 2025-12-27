const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const chatOutput = document.getElementById("chat-output");

const WORKER_URL = "https://personalai.abdulmmm556.workers.dev/"; // Your Worker URL

// Function to append messages to chat
function appendMessage(role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role}`;
  message.textContent = `${role}: ${text}`;
  chatOutput.appendChild(message);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Send message to Worker
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("User", message);
  chatInput.value = "";
  
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: [{ role: "user", content: message }] })
    });

    if (!response.ok) {
      appendMessage("Error", `Worker returned ${response.status}: ${response.statusText}`);
      return;
    }

    const text = await response.text();
    appendMessage("AI", text);
  } catch (err) {
    appendMessage("Error", "Failed to connect to AI service.");
    console.error(err);
  }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
