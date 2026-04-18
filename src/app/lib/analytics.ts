/**
 * Google Analytics Event Tracking Utility
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Tracks a custom event in Google Analytics
 * @param action The event name (e.g., 'resume_download')
 * @param category The event category (e.g., 'engagement')
 * @param label The event label (e.g., 'Navbar Resume Link')
 * @param value Optional numeric value
 */
export const trackEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Tracks a page view in Google Analytics
 * @param path The current page path
 */
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};
