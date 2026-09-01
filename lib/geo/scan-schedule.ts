/** 再スキャンまでの最短間隔（時間）。日次cron用に23時間。 */
export const SCAN_INTERVAL_HOURS = 23;

export const SCAN_INTERVAL_MS = SCAN_INTERVAL_HOURS * 60 * 60 * 1000;
