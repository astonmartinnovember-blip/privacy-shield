const RULESET_ID = "ruleset_1";

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID],
      disableRulesetIds: []
    });

    await chrome.storage.local.set({
      blockedCount: 0
    });
  } catch (error) {
    console.error("Failed to enable ruleset:", error);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  try {
    const enabled = await chrome.declarativeNetRequest.getEnabledRulesets();

    if (!enabled.includes(RULESET_ID)) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [RULESET_ID],
        disableRulesetIds: []
      });
    }
  } catch (error) {
    console.error("Failed to check ruleset:", error);
  }
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async () => {
  try {
    const result = await chrome.storage.local.get({
      blockedCount: 0
    });

    await chrome.storage.local.set({
      blockedCount: result.blockedCount + 1
    });
  } catch (error) {
    console.error("Failed to update blocked count:", error);
  }
});