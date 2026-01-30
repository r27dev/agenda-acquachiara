import { Activity } from "./types"

// Simple in-memory store for activities
let activities: Activity[] = []

export function getActivities(): Activity[] {
  return activities
}

export function addActivity(activity: Activity): void {
  activities.push(activity)
}

export function removeActivity(id: string): void {
  activities = activities.filter((a) => a.id !== id)
}

export function getActivitiesForMonth(year: number, month: number): Activity[] {
  return activities.filter((activity) => {
    const date = new Date(activity.date)
    return date.getFullYear() === year && date.getMonth() === month
  })
}

export function getActivitiesForDate(date: Date): Activity[] {
  return activities.filter((activity) => {
    const activityDate = new Date(activity.date)
    return (
      activityDate.getFullYear() === date.getFullYear() &&
      activityDate.getMonth() === date.getMonth() &&
      activityDate.getDate() === date.getDate()
    )
  })
}
