// app-nested-3.js
// ——————————————————————————————————————————————————————————————————————————
// Everything related to option “3”’s submenu and its responses
// ——————————————————————————————————————————————————————————————————————————

/**
 * Define the nested sub-options under “3. Access & Permissions”
 */
nestedOptions["3"] = [
  { text: "3.1 Windows UAC Prompts",     value: "3.1" },
  { text: "3.2 BeyondTrust Prompts", value: "3.2" },
];

/**
 * Extend your customResponses to cover the 3.x choices
 */
customResponses["3.1"] = `
If you receive Windows UAC Prompt while ONLY Uninstalling/ Repairing application from control Panel, you can utilize the following link to raise the ticket to LIT team: www.example.com
If you receive frequent UAC Prompts while daily activities, repairing BeyondTrust from Software Centre is recommended
`;

customResponses["3.2"] = `
A brief guidelines on understanding the BeyondTrust UI Prompts is given here - www.example.com
`;

/**
 * Patch sendChoice() to branch into nestedOptions when “3” is selected
 */
function sendChoice(choice) {
  if (chatEnded) return;

  // echo the button text (handles both top-level and nested)
  const optText = 
       optionsList.find(o => o.value === choice)?.text
    || nestedOptions[choice]?.find(o => o.value === choice)?.text
    || `Option ${choice}`;
  appendMessage(optText, "user-message");

  // if this choice has a nested submenu, render it and stop
  if (nestedOptions[choice]) {
    renderOptions(nestedOptions[choice], true);
    return;
  }

  // existing free-text branch (unchanged)
  if (choice === "7") {
    freeTextMode = true;
    showTypeBox();
    return;
  } else {
    freeTextMode = false;
  }

  // finally, look up the canned response
  const resp = customResponses[choice] || "No custom text found for this option.";
  appendBotMessagesSequentially(resp, showExploreOption);
}
