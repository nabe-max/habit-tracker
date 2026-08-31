"use client";

import { Trash2 } from "lucide-react";

import type { GeoMonitorClient } from "@/lib/geo/types";

interface GeoClientListProps {
  clients: GeoMonitorClient[];
  activeClientId: string | null;
  deletingId: string | null;
  onSelect: (client: GeoMonitorClient) => void;
  onDelete: (client: GeoMonitorClient) => void;
  variant?: "sidebar" | "mobile";
}

export function GeoClientList({
  clients,
  activeClientId,
  deletingId,
  onSelect,
  onDelete,
  variant = "sidebar",
}: GeoClientListProps) {
  if (variant === "mobile") {
    return (
      <div className="mb-6 flex gap-2 overflow-x-auto md:hidden">
        {clients.map((client) => (
          <button
            key={client.brandId}
            type="button"
            onClick={() => onSelect(client)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
              activeClientId === client.brandId
                ? "bg-violet-100 text-violet-800"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {client.brandName}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {clients.map((client) => {
        const isActive = activeClientId === client.brandId;
        const isDeleting = deletingId === client.brandId;

        return (
          <div
            key={client.brandId}
            className={`group flex items-center gap-1 rounded-lg transition-colors ${
              isActive ? "bg-violet-50 ring-1 ring-violet-200" : "hover:bg-slate-50"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(client)}
              className="min-w-0 flex-1 rounded-lg px-3 py-2 text-left"
            >
              <p className="truncate text-sm font-medium text-slate-800">{client.brandName}</p>
              <p className="truncate text-xs text-slate-500">{client.clientCategory}</p>
            </button>
            <button
              type="button"
              onClick={() => onDelete(client)}
              disabled={isDeleting}
              aria-label={`${client.brandName} を削除`}
              className="mr-1 shrink-0 rounded-md p-1.5 text-slate-400 opacity-0 transition-opacity hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
