const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");

// Multi-turn conversation memory
const conversation = [];

// Temporary user input storage
const userData = {
  message: "",
  file: {
    data: null,
    mime_type: null
  }
};

// Utility to create chat bubbles
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// ================================
// HANDLE MESSAGE SEND
// ================================
const handleOutgoingMessage = async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message && !userData.file.data) return;

  messageInput.value = "";
  userData.message = message;

  // --------------------
  // Render USER message
  // --------------------
  const outgoingMessageDiv = createMessageElement(
    `<div class="message-text">${message}</div>
     ${
       userData.file.data
         ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>`
         : ""
     }`,
    "user-message"
  );
  chatBody.appendChild(outgoingMessageDiv);

  // --------------------
  // Render BOT thinking
  // --------------------
  const incomingMessageDiv = createMessageElement(
    `<div class="message-text">Thinking...</div>`,
    "bot-message"
  );
  chatBody.appendChild(incomingMessageDiv);

  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // --------------------
  // Build user parts
  // --------------------
  const userParts = [];
  if (message) {
    userParts.push({ text: message });
  }
  if (userData.file.data) {
    userParts.push({
      inline_data: {
        mime_type: userData.file.mime_type,
        data: userData.file.data
      }
    });
  }

  // --------------------
  // Save USER turn in conversation
  // --------------------
  conversation.push({
    role: "user",
    parts: userParts
  });

  // --------------------
  // Prepare conversation for Gemini
  // --------------------
  let contentsToSend = conversation;

  // Remove last model message (Gemini requires last role to be "user")
  if (
    conversation.length > 1 &&
    conversation[conversation.length - 1].role === "model"
  ) {
    contentsToSend = conversation.slice(0, -1);
  }

  // Ensure at least one user message is sent (first-turn safeguard)
  if (contentsToSend.length === 0) {
    contentsToSend = conversation.slice(-1);
  }

  // --------------------
  // Send request to backend
  // --------------------
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contentsToSend })
    });

    const data = await response.json();

    incomingMessageDiv.querySelector(".message-text").textContent =
      data.reply || "No response";

    // --------------------
    // Save MODEL turn in conversation
    // --------------------
    conversation.push({
      role: "model",
      parts: [{ text: data.reply }]
    });

    // --------------------
    // Limit memory for token safety
    // --------------------
    if (conversation.length > 20) {
      conversation.splice(0, conversation.length - 20);
    }

    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  } catch (err) {
    incomingMessageDiv.querySelector(".message-text").textContent =
      "Error connecting to server.";
    console.error(err);
  }

  // --------------------
  // Reset input state
  // --------------------
  userData.file = { data: null, mime_type: null };
  userData.message = "";
};

// ================================
// ENTER KEY SEND
// ================================
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleOutgoingMessage(e);
});

// ================================
// IMAGE UPLOAD
// ================================
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    let img = fileUploadWrapper.querySelector("img");
    if (!img) {
      img = document.createElement("img");
      fileUploadWrapper.appendChild(img);
    }
    img.src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");

    userData.file = {
      data: e.target.result.split(",")[1],
      mime_type: file.type
    };

    fileInput.value = "";
  };
  reader.readAsDataURL(file);
});

// ================================
// BUTTON HANDLERS
// ================================
sendMessageButton.addEventListener("click", handleOutgoingMessage);
document.querySelector("#file-upload").addEventListener("click", () =>
  fileInput.click()
);
