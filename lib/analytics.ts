export const GA_EVENTS = {
  COMPANY_ANALYSIS_START: "company_analysis_start",
  COMPANY_ANALYSIS_SUCCESS: "company_analysis_success",
  COMPANY_ANALYSIS_ERROR: "company_analysis_error",
  MOTIVATION_COPY: "motivation_copy",
  SNS_GENERATE_START: "sns_generate_start",
  SNS_GENERATE_SUCCESS: "sns_generate_success",
  SNS_GENERATE_ERROR: "sns_generate_error",
  POST_COPY: "post_copy",
} as const;

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string | Date,
      params?: GtagEventParams,
    ) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: GtagEventParams,
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;

  window.gtag("event", eventName, params);
}
