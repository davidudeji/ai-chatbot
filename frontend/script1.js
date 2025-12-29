const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");



const userData = {
  message: "",
  file:{
    data: null,
    mime_type: null
  }
}
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const handleOutgoingMessage = async (e) => {
  e.preventDefault();

   const message = messageInput.value.trim();
  if (!message && !userData.file.data) return;

  messageInput.value = "";
  userData.message = message;

  // User message
  const outgoingMessageDiv = createMessageElement(
    `<div class="message-text">${message}</div>
 ${userData.file.data ? ` <img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>` : ""}`, "user-message"
  );
  chatBody.appendChild(outgoingMessageDiv);

  // Bot thinking
  const incomingMessageDiv = createMessageElement(
    `<div class="message-text">Thinking...</div>`,
    "bot-message"
  );
  chatBody.appendChild(incomingMessageDiv);
  chatBody.scrollTo({top: chatBody.scrollHeight, behavior:"smooth"});


  if (fileInput.files.length && !userData.file.data) {
  alert("Please wait for file to finish loading");
  return;
}

  // Send message to backend
  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData )
    
  });

  const data = await response.json();
  incomingMessageDiv.querySelector(".message-text").textContent = data.reply;
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior:"smooth"});
    // Clear file after send
  userData.file = { data: null, mime_type: null };
  userData.message = "";
  console.log(userData)

};

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleOutgoingMessage(e);
  
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if(!file) return;


  const reader = new FileReader();
  reader.onload = (e) => {
  const base64String = e.target.result.split(",")[1];

  // store file data in userData
  userData.file = {
    data: base64String,
    mime_type: file.type,
  }
    fileInput.value = "";
  }
 reader.readAsDataURL(file)
 
})

sendMessageButton.addEventListener("click", handleOutgoingMessage);
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());