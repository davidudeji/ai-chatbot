const chatBody = document.querySelector(".chat-body")
const messageInput = document.querySelector(".message-input")
const sendMessageButton = document.querySelector("#send-message")

// Api setup
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;


const userData = {
    message: null
}
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Generate bot response using API
const generateBotResponse =  async (incomingMessageDiv) => {

const messageElement = incomingMessageDiv.querySelector(".message-text")
    // API request options
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
        contents: [{parts: [{text:userData.message }],
    },],}),
    };

    try{
        const response = await fetch(API_URL, requestOptions);
        const data  = await response.json(); 
        if(!response.ok) throw new Error(data.error.message);


       //  Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.trim();
        messageElement.innerText = apiResponseText;
    } catch(error){
      console.error(error.message);
    }
}

// Handle outgoing user message
const handleOutgoingMessage = (e) => {
    e.preventDefault();

    userData.message = messageInput.value.trim();
    messageInput.value = ""

        // Create and display user message
    const messageContent = `<div class="message-text"></div>`;
    
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);


    // Simulate bot response with thinking indicator after a delay
    setTimeout(()=>{
           // Create and display user message
    const messageContent = `<div class="message bot-message">
     <img src="./images/chatbot.png" alt="chatbot-image" width="50px" height="50px" class="bot-avatar">
    <div class="message-text">
    <div class="thinking-indicator">
      <div class="dot">.</div>
      <div class="dot">.</div>
      <div class="dot">.</div>
    </div>
    </div>
  </div>`;
    
    const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    generateBotResponse(incomingMessageDiv);
    }, 600)
}

//Handle enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {

    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage){
        handleOutgoingMessage(e);
    }
})
  
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e))