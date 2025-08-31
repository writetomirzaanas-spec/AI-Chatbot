// app-nested-3.js
// ——————————————————————————————————————————————————————————————————————————
// Everything related to option “3”’s submenu and its responses
// ——————————————————————————————————————————————————————————————————————————

/**
 * Define the nested sub-options under “3. Access & Permissions”
 */
nestedOptions["5"] = [
  { text: "5.1 Application exception request",     value: "5.1" },
  { text: "5.2 Workstyle", value: "5.2" },
  { text: "5.3 Request to add app in trusted list",        value: "5.3" },
  { text: "5.3 Uninstall/ Disable BT",        value: "5.3" }
];

/**
 * Extend your customResponses to cover the 3.x choices
 */
customResponses["5.1"] = `
In case you are trying to access any non standard application, it is recommended to review the list of applications which are blocked as per the ISRM guidelines.

<a href="www.google.com" target="_blank"> List of blocked applications</a> 

If you believe a specific blocked app is still required in your day to day work, you can submit a request for exception in order to gain the access to the app by filling in the form given below.

<a href="https://bostonconsultinggroup.service-now.com/itconnect" target="_blank">Application excpetion form</a>
`;

customResponses["5.2"] = `
To view your current permissionsss:
1. Open the BeyondTrust client on your laptopsss.
2. Click “My Permissions” in the sidebar.
3. You’ll see a list of allowed apps and pending requests.
`;

customResponses["5.3"] = `
Exception process:
1. Submit an exception ticket via our ITSM portal.
2. Provide business justification and duration.
3. The L3 Support Team reviews within 24 hours.
`;

customResponses["5.4"] = `
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