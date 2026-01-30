"use client"

import { Activity, ActivityTypeConfig } from "@/lib/types"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ActivityBadgeProps {
  activity: Activity
  activityTypes: ActivityTypeConfig[]
  onRemove?: (id: string) => void
  compact?: boolean
}

export function ActivityBadge({ activity, activityTypes, onRemove, compact = false }: ActivityBadgeProps) {
  const config = activityTypes.find(t => t.id === activity.typeId) || activityTypes[0]

  if (compact) {
    return (
      <div 
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.bgColor
        )} 
        title={activity.title}
      />
    )
  }

  return (
    <div 
      className={cn(
        "group flex items-center justify-between gap-1 rounded px-2 py-1 text-xs",
        config.bgColor + "/20",
        config.color
      )}
    >
      <span className="truncate">{activity.title}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(activity.id)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/50 rounded p-0.5"
          aria-label="Rimuovi attività"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
