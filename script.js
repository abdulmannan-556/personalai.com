const workerUrl = "https://personalai.abdulmmm556.workers.dev/";

const messages = document.getElementById("messages");
const input = document.getElementById("input");
const fileInput = document.getElementById("file");
const imageInput = document.getElementById("image");

let history = [];

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.textContent = text;
  messages.appendChild(div);
  div.scrollIntoView();
}

async function send() {
  let content = input.value.trim();

  if (!content && !fileInput.files[0] && !imageInput.files[0]) return;

  if (fileInput.files[0]) {
    content += "\n\n[FILE]\n" + await fileInput.files[0].text();
    fileInput.value = "";
  }

  addMessage(content || "[Image sent]", "user");
  history.push({ role: "user", content });

  const aiDiv = document.createElement("div");
  aiDiv.className = "msg ai";
  messages.appendChild(aiDiv);

  const res = await fetch(workerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value);
    aiDiv.textContent = text;
  }

  history.push({ role: "assistant", content: text });
  input.value = "";
}

document.getElementById("send").addEventListener("click", send);

document.getElementById("toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
