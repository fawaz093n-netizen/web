// Defer PostHog out of the blocking bootstrap bundle.
// Using a dynamic import() splits posthog-js into its own chunk that is
// fetched asynchronously after the page's load event, removing ~169 KB from
// the critical rendering path without losing any page-view events (the user
// is still on the initial URL when the load event fires).
const initPostHog = () => {
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: "history_change",
      defaults: "2025-11-30",
      loaded: (posthog) => {
        posthog.register({
          site_name: "mono-site",
          environment: "production",
        });
      },
    });
  });
};

if (typeof window !== "undefined") {
  if (document.readyState === "complete") {
    initPostHog();
  } else {
    window.addEventListener("load", initPostHog, { once: true });
  }
}
