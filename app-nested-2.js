// app-nested-2.js
// ——————————————————————————————————————————————————————————————————————————
// Everything related to option “2”’s submenu and its responses
// ——————————————————————————————————————————————————————————————————————————

/**
 * Define the nested sub-options under “2. Access & Permissions”
 */
nestedOptions["2"] = [
  { text: "2.1 Request for BeyondTrust",     value: "2.1" },
  { text: "2.2 Report BT installation failure", value: "2.2" },
  { text: "2.3 Test", value: "2.3" }
];

/**
 * Extend your customResponses to cover the 2.x choices
 */
customResponses["2.1"] = `
If you want to get BeyondTrust Installed, you can submit a ticket to the LARM L3 Support Team. Utilize the below-mentioned link to raise the ticket: 
<a href="www.example.com" target="_blank">Raise a Ticket</a>
`;


customResponses["2.2"] = `
In case where you are unable to find BeyondTrust application in Software Centre or want to report BeyondTrust Installation failure, kindly raise a ticket with your Local IT team using the following link: 
<a href="www.example.com" target="_blank">Raise a Ticket</a>
`;


/**
 * Patch sendChoice() to branch into nestedOptions when “2” is selected
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
    renderOptions(nestedOptions[choice]);
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
