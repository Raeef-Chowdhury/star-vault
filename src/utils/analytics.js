import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const IS_DEBUG = import.meta.env.VITE_GA4_DEBUG === "true";

export const initGA = () => {
  console.log("=== Initializing GA4 ===");

  if (!MEASUREMENT_ID) {
    console.error(
      "❌ GA4 initialization failed: MEASUREMENT_ID not found in environment variables"
    );
    console.log("Make sure VITE_GA4_MEASUREMENT_ID is set in your .env file");
    return;
  }

  try {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        debug_mode: IS_DEBUG,
      },
    });
    console.log("✅ GA4 initialized successfully with ID:", MEASUREMENT_ID);

    // Send initial pageview
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    console.log("📊 Initial pageview sent:", window.location.pathname);
  } catch (error) {
    console.error("❌ GA4 initialization error:", error);
  }
};

// Optional: Export a function to track custom events with logging
export const trackEvent = (category, action, label) => {
  console.log("📈 Tracking event:", { category, action, label });
  ReactGA.event({
    category,
    action,
    label,
  });
};
