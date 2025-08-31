// app-nested-3.js
// ——————————————————————————————————————————————————————————————————————————
// Everything related to option “3”’s submenu and its responses
// ——————————————————————————————————————————————————————————————————————————

/**
 * Define the nested sub-options under “3. Access & Permissions”
 */
nestedOptions["7"] = [
  { text: "7.1 Endpoint Performance",     value: "7.1" },
  { text: "7.2 Unexpected Application block", value: "7.2" },
  { text: "7.3 Unexpected UI Prompt",        value: "7.3" }
];

/**
 * Extend your customResponses to cover the 3.x choices
 */
customResponses["7.1"] = `
To request admin rights:
1. Open the BeyondTrust portalss.
2. Select “Request Elevation” and attach justificationsss.                 
3. Your request routes to ISRM for approvalss.
`;

customResponses["7.2"] = `
To view your current permissionsss:
1. Open the BeyondTrust client on your laptopsss.
2. Click “My Permissions” in the sidebar.
3. You’ll see a list of allowed apps and pending requests.
`;

customResponses["7.3"] = `
Exception process:
1. Submit an exception ticket via our ITSM portal.
2. Provide business justification and duration.
3. The L3 Support Team reviews within 24 hours.
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