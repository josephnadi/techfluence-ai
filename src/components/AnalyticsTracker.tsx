import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Google Analytics 4 integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsTrackerProps {
  measurementId?: string;
}

const AnalyticsTracker = ({ measurementId }: AnalyticsTrackerProps) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize Google Analytics
    const initGA = () => {
      if (!measurementId) return;
      
      // Create script tag for gtag.js
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        page_path: location.pathname + location.search,
        anonymize_ip: true,
      });
    };

    initGA();
  }, [measurementId]);

  // Track page views on route change
  useEffect(() => {
    if (!measurementId || typeof window.gtag !== "function") return;

    window.gtag("config", measurementId, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location, measurementId]);

  return null;
};

// Utility functions for tracking events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }
};

export const trackConversion = (
  conversionLabel: string,
  value?: number,
  currency?: string
) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: conversionLabel,
      value: value,
      currency: currency || "USD",
    });
  }
};

export const trackFormSubmission = (formName: string) => {
  trackEvent("form_submission", {
    form_name: formName,
  });
};

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent("button_click", {
    button_name: buttonName,
    click_location: location,
  });
};

export const trackPageScroll = (percentage: number) => {
  trackEvent("scroll_depth", {
    scroll_percentage: percentage,
  });
};

export default AnalyticsTracker;
