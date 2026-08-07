import { addDays, format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function computeNextMorningDelivery(
  timezone: string,
  hour: number,
  minute: number,
  from = new Date(),
): Date {
  const zonedNow = toZonedTime(from, timezone);
  const tomorrow = addDays(zonedNow, 1);
  const datePart = format(tomorrow, "yyyy-MM-dd");
  const timePart = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  return fromZonedTime(`${datePart}T${timePart}`, timezone);
}

export function formatDeliveryLocal(iso: string, timezone: string): string {
  const date = toZonedTime(new Date(iso), timezone);
  return format(date, "M月d日 HH:mm");
}
