const workerUrl = "https://personalai.abdulmmm556.workers.dev/";

const messages = document.getElementById("messages");
const input = document.getElementById("input");
const fileInput = document.getElementById("file");
const imageInput = document.getElementById("image");
const sendBtn = document.getElementById("send");
const toggleBtn = document.getElementById("toggle");

let history = [];
let sending = false;

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.textContent = text;
  messages.appendChild(div);
  div.scrollIntoView({ behavior: "smooth" });
  return div;
}

async function send() {
  if (sending) return;

  let content = input.value.trim();
  const file = fileInput.files[0];
  const image = imageInput.files[0];

  if (!content && !file && !image) return;

  sending = true;

  if (file) {
    content += "\n\n[FILE]\n" + await file.text();
    fileInput.value = "";
  }

  addMessage(content || "[Image sent]", "user");
  history.push({ role: "user", content });

  const aiDiv = addMessage("", "ai");

  try {
    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history })
    });

    if (!res.body) {
      aiDiv.textContent = "⚠️ No response from server";
      sending = false;
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      aiDiv.textContent = text;
    }

    history.push({ role: "assistant", content: text });
  } catch (err) {
    aiDiv.textContent = "❌ Error connecting to AI service";
    console.error(err);
  }

  input.value = "";
  sending = false;
}

/* ✅ CLICK SEND */
sendBtn.addEventListener("click", send);

/* ✅ ENTER KEY SUPPORT */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

/* ✅ DARK MODE TOGGLE */
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
