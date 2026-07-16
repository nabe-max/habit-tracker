"use client";

import { Briefcase, ExternalLink, Trash2 } from "lucide-react";

import { StarRating } from "@/components/salespilot/StarRating";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { LeadStatus, SalesLead } from "@/types/salespilot";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/types/salespilot";

interface LeadListProps {
  leads: SalesLead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onPriorityChange: (id: string, priority: number) => void;
  onRemove: (id: string) => void;
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  unsent: "bg-slate-100 text-slate-700",
  sent: "bg-blue-100 text-blue-700",
  waiting: "bg-amber-100 text-amber-700",
  replied: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
};

export function LeadList({
  leads,
  onStatusChange,
  onPriorityChange,
  onRemove,
}: LeadListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Briefcase className="size-5" />
          </div>
          <div>
            <CardTitle>④ 案件管理</CardTitle>
            <CardDescription>
              解析した営業先を保存し、ステータスを管理
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            案件がありません。サイト解析後に「案件に保存」してください。
          </p>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-xl border p-4 transition-colors hover:bg-muted/20"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{lead.companyName}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          STATUS_COLORS[lead.status],
                        )}
                      >
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        スコア {lead.score}点
                      </span>
                    </div>
                    <a
                      href={lead.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 truncate text-sm text-primary hover:underline"
                    >
                      {lead.url}
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                    <StarRating
                      value={lead.priority}
                      onChange={(value) => onPriorityChange(lead.id, value)}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={(value) =>
                        onStatusChange(lead.id, value as LeadStatus)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LEAD_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {LEAD_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(lead.id)}
                      aria-label="削除"
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
