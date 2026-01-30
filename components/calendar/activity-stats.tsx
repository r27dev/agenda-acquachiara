"use client"

import { Activity, ActivityTypeConfig } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ActivityStatsProps {
  activities: Activity[]
  activityTypes: ActivityTypeConfig[]
}

export function ActivityStats({ activities, activityTypes }: ActivityStatsProps) {
  const counts = activities.reduce((acc, activity) => {
    acc[activity.typeId] = (acc[activity.typeId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = activities.length

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">
        Riepilogo Mensile
      </h2>
      <div className="space-y-3">
        {activityTypes.map((type) => {
          const count = counts[type.id] || 0
          const percentage = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={type.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={cn("flex items-center gap-2", type.color)}>
                  <span className={cn("h-2 w-2 rounded-full", type.bgColor)} />
                  {type.label}
                </span>
                <span className="font-medium text-foreground">{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-300", type.bgColor)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Totale</span>
          <span className="font-semibold text-foreground">{total}</span>
        </div>
      </div>
    </div>
  )
}
