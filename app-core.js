let chatEnded = false;
let freeTextMode = false;

// ─── Knowledge & Config ──────────────────────────────────────────────────────
const btKnowledgeBase = {
  sliWhat: `The Secure Laptops Initiative (SLI) is a multi-year journey to manage admin rights on laptops through BeyondTrust. This solution helps people run safe applications, improves laptop security, and prevents admin rights from being misused by attackers. SLI makes our laptops more secure by managing privilege escalations and providing all people the right level of permissions we need to get our work done.`,
  sliWhy: `Currently, all people have local administrative rights on our laptops. This means unnecessary, high-risk access to our IT systems is available not only to people, but also to cyber attackers who can leverage administrative privileges to initiate a serious security event.

Safeguarding local administrative rights protects our consultants from serious risks, enables us to work with clients operating under industry security standards, and is an industry and security best practice.`,
  sliSupport: `SLI is the implementation of a privilege access management (PAM) solution called BeyondTrust. BeyondTrust is designed to enforce least privilege access on Windows and macOS. It helps protect endpoints by preventing the execution of unknown or malicious software and reducing the risk of privilege escalation attacks. It achieves this by removing local admin rights while allowing users to perform necessary tasks securely.

Over a multi-year timeline, BeyondTrust will be deployed to people laptops in a deliberate, detailed fashion to ensure maximum security and productivity for all people. SLI is closely aligned with the larger security strategy, "Secure the appplications".`,
  sliContact: `Email the team at securelaptops@example.com with any questions.`,
  additional: `So far BeyondTrust is deployed to 400 Windows users and 700 Mac users. We have 3 workstyles available - High Flex, Mid Flex, Low Flex. People can request an exception to access any application/software/program by reaching out to the ISRM team. Abhay Zutshi is the PO of the PP-Sec team which serves as a custodian of BeyondTrust.`,
  btWhat: `BeyondTrust is a privilege access management (PAM) solution designed to enforce least privilege access on Windows and macOS. It helps protect endpoints by removing local admin rights while still allowing users to perform necessary tasks securely.`
};

const customResponses = {
  "1": `What is BeyondTrust?
  BeyondTrust is a security solution designed to enforce least privilege access on Windows and macOS. It helps protect endpoints by preventing the execution of unknown or malicious software and reducing the risk of privilege escalation attacks. It achieves this by removing local admin rights while allowing users to perform necessary tasks securely.

What is the Secure Laptops Initiative?
The Secure Laptops Initiative (SLI) is a multi-year journey to manage admin rights on laptops through a solution called BeyondTrust. SLI makes our laptops more secure by managing privilege escalations and providing all people the right level of permissions we need to get our work done.

Why is SLI needed at our organization?
Currently, all people have local administrative rights on our laptops. This means unnecessary, high-risk access to our IT systems is available not only to people, but also to cyber attackers who can leverage administrative privileges to initiate a serious security event. Safeguarding local administrative rights protects our end-users from serious risks, enables us to work with clients operating under industry security standards, and is an industry and security best practice.`,
  
  "6": `Custom text for option 6 here.`,
  "8": `Custom text for option 8 here.`,
  "8": `Custom text for option 9 here.`
  
};


const optionsList = [
  { text: "1. Everything about BeyondTrust (Win & Mac)", value: "1" },
  { text: "2. Need help with BeyondTrust Installation", value: "2" },
  { text: "3. BeyondTrust UI Prompts and Messages", value: "3" },
  { text: "4. Understand the Workstyles", value: "4" },
  { text: "5. Request for change", value: "5" },
  { text: "6. Temporary BT Disable/ Removal", value: "6" },
  { text: "7. Report an issue", value: "7" },
  { text: "8. Escalation Matrix", value: "8" },
  { text: "9. Frequently asked questions", value: "9" }
];
const nestedOptions = {};

// ─── Initialization ───────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setupTeamPanelToggle();
  greetUser();
  appendBotMessage("I can help you find the right support resources based on your chosen topic.");
  appendContinueButton();
  insertFixedTypeBox();  // persistent free-text input at bottom
});

// ─── Setup Helpers ────────────────────────────────────────────────────────────
function setupTeamPanelToggle() {
  document.getElementById("team-button").addEventListener("click", () => {
    document.getElementById("team-panel").classList.toggle("active");
  });
}

function greetUser() {
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? "Good Morning"
    : hour < 18
      ? "Good Afternoon"
      : "Good Evening";
  appendBotMessage(`${greeting}! I'm PP-Sec virtual agent.`);
}

// ─── DOM Helpers ─────────────────────────────────────────────────────────────
function getChatBox() {
  return document.getElementById("chat-box");
}

function scrollChatToBottom() {
  const box = getChatBox();
  box.scrollTop = box.scrollHeight;
}

function appendMessage(html, className) {
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.innerHTML = html;
  getChatBox().appendChild(msg);
  scrollChatToBottom();
}

function appendBotMessage(text) {
  playBeep();
  appendMessage(`
    <img src="https://cdn-icons-png.flaticon.com/512/306/306047.png" alt="Shield Icon" />
    ${text}
  `, "bot-message");
}

function appendContinueButton() {
  appendMessage(`
    <div style="text-align:center;">
      <button class="common-green-button" onclick="continueChat()">Continue</button>
    </div>
  `, "bot-message");
}

// ─── Persistent Email & Free-Text Box ─────────────────────────────────────────
function showWriteBox() {
  removeIfExists("activeEmailForm");
  const form = document.createElement("div");
  form.id = "activeEmailForm";
  form.className = "message user-message";
  form.innerHTML = `
    <div style="display:flex; flex-direction:column;">
      <textarea id="userEmailMessage" rows="4" placeholder="✉️ Type your message here..."
        style="width:100%; padding:5px; border:1px solid #ccc; border-radius:6px; box-sizing:border-box;"></textarea>
      <button class="send-button-custom-width" onclick="sendEmail()">Send</button>
    </div>
  `;
  getChatBox().appendChild(form);
}

function sendEmail() {
  const msg = document.getElementById("userEmailMessage").value.trim();
  if (!msg) return;
  window.location.href = `mailto:securelaptops@example.com?subject=PP-Sec%20Chat%20Support&body=${encodeURIComponent(msg)}`;
}



// ─── Main Flow ────────────────────────────────────────────────────────────────
function continueChat() {
  renderOptions(optionsList);
}

 function renderOptions(options, isSubmenu = false) {
  const container = document.createElement("div");
  container.className = "option-buttons";
  Object.assign(container.style, {
    border: "2px solid yellow",
    padding: "10px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
	
  });
  const headerText = isSubmenu
    ? "Choose a sub-topic from the list below:"
    : "Choose a topic from the list below:";
  container.innerHTML = `<div style="font-weight:bold; margin-bottom:10px; color:#006400;">
    ${headerText}
  </div>`;
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt.text;
    btn.className = "common-green-button";
    btn.style.margin = "5px 0";
    btn.onclick = () => { if (!chatEnded) sendChoice(opt.value); };
    container.appendChild(btn);
  });

  getChatBox().appendChild(container);
  scrollChatToBottom();
}




// ─── Free-Text Query Box ─────────────────────────────────────────────────────
function showTypeBox() {
  removeIfExists("activeTextBox");
  const form = document.createElement("div");
  form.id = "activeTextBox";
  form.className = "message user-message";
  form.innerHTML = `
    <div style="display:flex; flex-direction:column;">
      <textarea id="userTextInput" rows="3" placeholder="Type your query…"
        style="width:100%; padding:5px; border:1px solid #ccc; border-radius:6px; box-sizing:border-box;"></textarea>
      <button class="send-button-custom-width" onclick="submitTextQuery()">Send</button>
    </div>
  `;
  getChatBox().appendChild(form);
}

function submitTextQuery() {
  const el = document.getElementById("userTextInput");
  const text = el.value.trim();
  if (!text) return;
  appendMessage(text, "user-message");
  removeIfExists("activeTextBox");
  const resp = getBtResponse(text);
  appendBotMessagesSequentially(resp, () => {
    freeTextMode ? showAdditionalPromptForText() : showExploreOption();
  });
}

function submitFixedTextQuery() {
  const inp = document.getElementById("fixedUserTextInput");
  const text = inp.value.trim();
  if (!text) return;
  appendMessage(text, "user-message");
  inp.value = "";
  const resp = getBtResponse(text);
  appendBotMessagesSequentially(resp, () => {
    freeTextMode ? showAdditionalPromptForText() : showExploreOption();
  });
}

// ─── Follow-up Prompts ───────────────────────────────────────────────────────
function showAdditionalPromptForText() {
  appendMessage(`
    <div style="font-size:14px;">
      Have anything else in mind?<br>
      <button class="common-yellow-button" onclick="handleAdditionalYes()">Yes</button>
      <button class="common-yellow-button" onclick="handleAdditionalNo()">No</button>
    </div>
  `, "bot-message");

  appendMessage(`
    <button class="common-green-button" onclick="showExploreOption()">Explore More</button>
  `, "bot-message");
}

function handleAdditionalYes() {
  freeTextMode = true;
  showTypeBox();
}

function handleAdditionalNo() {
  freeTextMode = false;
  showExploreOption();
}

// ─── Sequential Bot Messaging ────────────────────────────────────────────────
function appendBotMessagesSequentially(fullText, onComplete) {
  const parts = fullText.split('\n').filter(Boolean);
  let i = 0;
  function next() {
    if (i < parts.length) {
      typewriterRevealHTML(parts[i++], () => setTimeout(next, 500));
    } else if (onComplete) {
      onComplete();
    }
  }
  next();
}



// ─── Exploration & Restart ───────────────────────────────────────────────────
function showExploreOption() {
  appendMessage(`
    <img src="https://cdn-icons-png.flaticon.com/512/306/306047.png" alt="Shield Icon" />
    <button class="common-green-button" onclick="showAllOptions()">Explore More..</button>
  `, "bot-message");
}

function showAllOptions() {
  if (chatEnded) return;
  appendMessage("Yes", "user-message");
  appendMessage(`
    <img src="https://cdn-icons-png.flaticon.com/512/306/306047.png" alt="Shield Icon" />
    Please select a topic from the list below for assistance.
  `, "bot-message");
  renderOptions(optionsList);
}

function endChat() {
  chatEnded = true;
  disableInteractiveElements();
  appendBotMessagesSequentially("Previous chat session has been ended", showStartNewConversationButton);
}

function showStartNewConversationButton() {
  appendMessage(`
    <img src="https://cdn-icons-png.flaticon.com/512/306/306047.png" alt="Shield Icon" />
    <button class="common-green-button" onclick="startNewConversation()">Start New Conversation</button>
  `, "bot-message");
}

function startNewConversation() {
  chatEnded = false;
  document.getElementById("end-button").style.display = "inline-block";
  appendBotMessage("New conversation started. Please choose a topic below:");
  renderOptions(optionsList);
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function removeIfExists(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function disableInteractiveElements() {
  getChatBox().querySelectorAll('a, button, textarea').forEach(el => {
    el.disabled = true;
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.5';
  });
}

function playBeep() {
  new Audio("https://www.fesliyanstudios.com/play-mp3/4382").play();
}

// ─── BT Response Logic ───────────────────────────────────────────────────────
function getBtResponse(text) {
  const t = text.trim().toLowerCase();
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(t)) {
    return "Hi! How may I help?";
  }
  if ((t.includes("what") && t.includes("secure laptop")) || (t.includes("what") && t.includes("sli"))) {
    return btKnowledgeBase.sliWhat;
  }
  if (t.includes("why") && t.includes("sli")) {
    return btKnowledgeBase.sliWhy;
  }
  if ((t.includes("how") && t.includes("beyondtrust")) || t.includes("support")) {
    return btKnowledgeBase.sliSupport;
  }
  if (t.includes("what") && t.includes("beyondtrust")) {
    return btKnowledgeBase.btWhat;
  }
  if (t.includes("contact") || t.includes("email") || t.includes("more information")) {
    return btKnowledgeBase.sliContact;
  }
  if (["windows","mac","workstyles","exception","abhay"].some(k => t.includes(k))) {
    return btKnowledgeBase.additional;
  }
  return `I'm sorry, I don't have information on that topic. Please try rephrasing your question or contact securelaptops@example.com for further assistance.`;
}

// ─── Copy-to-Clipboard Utility ───────────────────────────────────────────────
function copyEmail(evt, email) {
  evt.stopPropagation();               // don’t let the click bubble up
  // If Clipboard API is available & we’re on HTTPS/localhost
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email)
      .then(() => {
        // optional: show temporary “Copied!” feedback
        evt.target.textContent = "Copied!";
        setTimeout(() => evt.target.textContent = "Copy", 1500);
      })
      .catch(err => console.error("Clipboard write failed:", err));
  } else {
    // Fallback for insecure context or older browsers
    const ta = document.createElement("textarea");
    ta.value = email;
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      evt.target.textContent = "Copied!";
      setTimeout(() => evt.target.textContent = "Copy", 1500);
    } catch (err) {
      console.error("Fallback: copy command failed", err);
    }
    document.body.removeChild(ta);
  }
}
function typewriterRevealHTML(html, onComplete) {
  // Create the message container
  const msg = document.createElement("div");
  msg.className = "message bot-message";
  msg.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/306/306047.png" alt="Shield Icon" /><span class="typewriter-text"></span>`;
  getChatBox().appendChild(msg);

  const span = msg.querySelector(".typewriter-text");

  // Parse the HTML into a DOM fragment
  const frag = document.createElement("div");
  frag.innerHTML = html;

  // Collect all text nodes (including inside <a>, <b>, etc.)
  const textNodes = [];
  function getTextNodes(node) {
    if (node.nodeType === 3) {
      textNodes.push(node);
    } else if (node.nodeType === 1) {
      for (let child of node.childNodes) getTextNodes(child);
    }
  }
  getTextNodes(frag);

  // Hide all text initially
  for (const tn of textNodes) {
    tn.originalText = tn.nodeValue;
    tn.nodeValue = "";
  }

  // Add the HTML structure to the message
  span.appendChild(frag);

  // Type each text node, character by character
  let nodeIdx = 0, charIdx = 0;
  function type() {
    if (nodeIdx < textNodes.length) {
      const node = textNodes[nodeIdx];
      const full = node.originalText;
      if (charIdx < full.length) {
        node.nodeValue += full[charIdx++];
        scrollChatToBottom();
        setTimeout(type, 10); // Adjust typing speed as desired
      } else {
        nodeIdx++;
        charIdx = 0;
        setTimeout(type, 10);
      }
    } else {
      setTimeout(() => span.classList.add('typewriter-done'), 400); // (Optional) Remove cursor
      if (onComplete) onComplete && onComplete();
    }
  }
  type();
}





