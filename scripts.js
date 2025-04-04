const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");

// State variables
let userMessage = null;
let isResponseGenerating = false;

// API configuration - Use a secure method to store API keys (Backend)
const API_KEY = "AIzaSyBJJREk4EK-rKEbU4LTDjHY4k2BgvleTh8";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

// Load chat history and theme from local storage
const loadDataFromLocalStorage = () => {
    const savedChats = localStorage.getItem("saved-chats");
    const isLightMode = (localStorage.getItem("themeColor") === "light_mode");

    document.body.classList.toggle("light_mode", isLightMode);
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

    chatContainer.innerHTML = savedChats || '';
    document.body.classList.toggle("hide-header", savedChats);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

// Create a new message element
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// Typing effect
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
    const words = text.split(' ');
    let currentWordIndex = 0;

    const typingInterval = setInterval(() => {
        textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
        incomingMessageDiv.querySelector(".icon").classList.add("hide");

        if (currentWordIndex === words.length) {
            clearInterval(typingInterval);
            isResponseGenerating = false;
            incomingMessageDiv.querySelector(".icon").classList.remove("hide");
            localStorage.setItem("saved-chats", chatContainer.innerHTML);
        }
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    }, 75);
}

// Fetch API response
const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: userMessage }] }]
            }),
        });

        if (!response.ok) throw new Error("Failed to fetch response from API");

        const data = await response.json();
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, '$1') || "No response received.";
        
        showTypingEffect(apiResponse, textElement, incomingMessageDiv);
    } catch (error) {
        isResponseGenerating = false;
        textElement.innerText = "Error: " + error.message;
        incomingMessageDiv.classList.add("error");
    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
}

// Show loading animation
const showLoadingAnimation = () => {
    const html = `
        <div class="message-content">
            <img class="avatar" src="/downloads.png" alt="Gemini avatar">
            <p class="text"></p>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        </div>
        <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>
    `;

    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatContainer.appendChild(incomingMessageDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    generateAPIResponse(incomingMessageDiv);
}

// Copy message to clipboard
const copyMessage = (copyButton) => {
    const messageText = copyButton.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    copyButton.innerText = "done";
    setTimeout(() => copyButton.innerText = "content_copy", 1000);
}

// Handle sending user messages
const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if (!userMessage || isResponseGenerating) return;

    isResponseGenerating = true;

    const html = `
        <div class="message-content">
            <img class="avatar" src="/download.png" alt="User avatar">
            <p class="text">${userMessage}</p>
        </div>
    `;

    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    chatContainer.appendChild(outgoingMessageDiv);

    typingForm.reset();
    document.body.classList.add("hide-header");
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showLoadingAnimation, 500);
}

// Theme Toggle
toggleThemeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light_mode");
    localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

// Delete all chats
deleteChatButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all chats?")) {
        localStorage.removeItem("saved-chats");
        loadDataFromLocalStorage();
    }
});

// Handle suggestions
suggestions.forEach(suggestion => {
    suggestion.addEventListener("click", () => {
        userMessage = suggestion.querySelector(".text").innerText;
        handleOutgoingChat();
    });
});

// Prevent form submission
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutgoingChat();
});

// Load data on page load
loadDataFromLocalStorage();
