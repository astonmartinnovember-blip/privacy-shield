(() => {
  "use strict";

  const AD_SELECTORS = [
    "ytd-display-ad-renderer",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-action-companion-ad-renderer",
    "ytd-in-feed-ad-layout-renderer",
    "ytd-ad-slot-renderer",
    "ytd-banner-promo-renderer",
    "ytd-statement-banner-renderer",
    "#masthead-ad",
    "#player-ads",
    ".ytp-ad-overlay-container",
    ".ytp-ad-message-container",
    ".ytp-ad-image-overlay",
    ".ytp-ad-text"
  ];

  function hidePageAds() {
    for (const selector of AD_SELECTORS) {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.setProperty("display", "none", "important");
        element.style.setProperty("visibility", "hidden", "important");
      });
    }
  }

  function clickSkipButton() {
    const selectors = [
      ".ytp-ad-skip-button",
      ".ytp-ad-skip-button-modern",
      "button.ytp-ad-skip-button-modern",
      ".ytp-ad-skip-button-slot button"
    ];

    for (const selector of selectors) {
      const button = document.querySelector(selector);

      if (button) {
        button.click();
        return true;
      }
    }

    return false;
  }

  function handleVideoAd() {
    const player = document.querySelector(".html5-video-player");

    if (!player || !player.classList.contains("ad-showing")) {
      return;
    }

    // Try the normal Skip button first.
    if (clickSkipButton()) {
      return;
    }

    // If there is no Skip button, try to move the ad video to its end.
    const video = document.querySelector("video");

    if (video && Number.isFinite(video.duration) && video.duration > 0) {
      try {
        video.currentTime = video.duration;
      } catch (error) {
        console.debug("Could not seek ad:", error);
      }
    }

    // Hide the ad overlay while the player is in ad mode.
    const adContainers = document.querySelectorAll(
      ".ytp-ad-overlay-container, .ytp-ad-message-container"
    );

    adContainers.forEach((element) => {
      element.style.setProperty("display", "none", "important");
    });
  }

  function cleanYouTube() {
    hidePageAds();
    handleVideoAd();
  }

  const style = document.createElement("style");

  style.textContent = `
    ytd-display-ad-renderer,
    ytd-promoted-sparkles-web-renderer,
    ytd-action-companion-ad-renderer,
    ytd-in-feed-ad-layout-renderer,
    ytd-ad-slot-renderer,
    ytd-banner-promo-renderer,
    ytd-statement-banner-renderer,
    #masthead-ad,
    #player-ads,
    .ytp-ad-overlay-container,
    .ytp-ad-message-container,
    .ytp-ad-image-overlay,
    .ytp-ad-text {
      display: none !important;
      visibility: hidden !important;
    }
  `;

  if (document.documentElement) {
    document.documentElement.appendChild(style);
  }

  const observer = new MutationObserver(() => {
    cleanYouTube();
  });

  function start() {
    cleanYouTube();

    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    setInterval(cleanYouTube, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, {
      once: true
    });
  } else {
    start();
  }
})();