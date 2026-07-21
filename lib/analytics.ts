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
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

function normalizeParams(
  params?: GtagEventParams,
): Record<string, string | number> {
  if (!params) return {};

  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        typeof value === "boolean" ? String(value) : value!,
      ]),
  );
}

export function trackEvent(
  eventName: string,
  params?: GtagEventParams,
): void {
  if (typeof window === "undefined") return;

  const payload = normalizeParams(params);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...payload,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
}
