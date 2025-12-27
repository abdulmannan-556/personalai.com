document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const input = document.getElementById("message");
  const sendBtn = document.getElementById("send");

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage("You", text, "user");
    input.value = "";

    try {
      const res = await fetch("https://personalai.abdulmmm556.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      appendMessage("AI", data.choices[0].message.content, "ai");

    } catch {
      appendMessage("AI", "Error: Failed to connect.", "ai");
    }
  }

  function appendMessage(sender, text, cls) {
    const div = document.createElement("div");
    div.className = cls;
    div.textContent = `${sender}: ${text}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }
});
