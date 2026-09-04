/** β版の監視クライアント上限（1ブラウザあたり） */
export const MAX_MONITORED_CLIENTS = 3;

export function canAddMonitorClient(currentCount: number): boolean {
  return currentCount < MAX_MONITORED_CLIENTS;
}

export function getMonitorClientLimitMessage(currentCount: number): string | null {
  if (canAddMonitorClient(currentCount)) return null;
  return `β版では監視クライアントは最大${MAX_MONITORED_CLIENTS}社までです。既存クライアントを削除してから追加してください。`;
}
