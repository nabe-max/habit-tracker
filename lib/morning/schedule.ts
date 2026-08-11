import { addDays, format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function computeNextMorningDelivery(
  timezone: string,
  hour: number,
  minute: number,
  from = new Date(),
): Date {
  const zonedNow = toZonedTime(from, timezone);
  const timePart = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  const todayDelivery = fromZonedTime(`${format(zonedNow, "yyyy-MM-dd")}T${timePart}`, timezone);

  // Register tonight → same morning if it hasn't passed yet; otherwise next morning.
  if (todayDelivery > from) {
    return todayDelivery;
  }

  const tomorrow = addDays(zonedNow, 1);
  return fromZonedTime(`${format(tomorrow, "yyyy-MM-dd")}T${timePart}`, timezone);
}

export function formatDeliveryLocal(iso: string, timezone: string): string {
  const date = toZonedTime(new Date(iso), timezone);
  return format(date, "MMM d, HH:mm");
}
