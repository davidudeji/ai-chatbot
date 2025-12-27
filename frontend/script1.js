const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const handleOutgoingMessage = async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message) return;

  messageInput.value = "";

  // User message
  const outgoingMessageDiv = createMessageElement(
    `<div class="message-text">${message}</div>`,
    "user-message"
  );
  chatBody.appendChild(outgoingMessageDiv);

  // Bot thinking
  const incomingMessageDiv = createMessageElement(
    `<div class="message-text">Thinking...</div>`,
    "bot-message"
  );
  chatBody.appendChild(incomingMessageDiv);
  chatBody.scrollTo({top: chatBody.scrollHeight, behavior:"smooth"});

  // Send message to backend
  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  incomingMessageDiv.querySelector(".message-text").textContent = data.reply;
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior:"smooth"});
};

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleOutgoingMessage(e);
});

sendMessageButton.addEventListener("click", handleOutgoingMessage);
