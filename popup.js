const RULESET_ID = "ruleset_1";

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const toggleButton = document.getElementById("toggleButton");
const blockedCount = document.getElementById("blockedCount");
const message = document.getElementById("message");

async function isProtectionOn() {
  const enabled = await chrome.declarativeNetRequest.getEnabledRulesets();
  return enabled.includes(RULESET_ID);
}

async function setProtection(enabled) {
  if (enabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID],
      disableRulesetIds: []
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [],
      disableRulesetIds: [RULESET_ID]
    });
  }
}

async function updateCount(isOn) {
  if (!isOn) {
    blockedCount.textContent = "0";
    message.textContent = "";
    return;
  }

  try {
    const result = await chrome.storage.local.get({
      blockedCount: 0
    });

    blockedCount.textContent = String(result.blockedCount);
    message.textContent = "Blocked requests";
  } catch (error) {
    console.error(error);

    blockedCount.textContent = "0";
    message.textContent = "Statistics unavailable";
  }
}

async function updateUI() {
  try {
    const isOn = await isProtectionOn();

    statusDot.className = isOn ? "on" : "off";

    statusText.textContent = isOn
      ? "Protection is ON"
      : "Protection is OFF";

    toggleButton.className = isOn ? "on" : "off";

    toggleButton.textContent = isOn
      ? "Turn OFF"
      : "Turn ON";

    await updateCount(isOn);
  } catch (error) {
    console.error(error);

    statusText.textContent = "Error";
    message.textContent = "Could not read extension status.";
  }
}

toggleButton.addEventListener("click", async () => {
  try {
    const currentState = await isProtectionOn();

    await setProtection(!currentState);

    await updateUI();
  } catch (error) {
    console.error(error);

    message.textContent =
      "Could not change protection state.";
  }
});

updateUI();