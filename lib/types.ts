export interface ActivityTypeConfig {
  id: string
  label: string
  color: string
  bgColor: string
}

export interface Activity {
  id: string
  title: string
  typeId: string
  date: string // ISO date string for API compatibility
  description?: string
}

export const defaultActivityTypes: ActivityTypeConfig[] = [
  { 
    id: "meeting",
    label: "Riunione", 
    color: "text-chart-1", 
    bgColor: "bg-chart-1" 
  },
  { 
    id: "task",
    label: "Compito", 
    color: "text-chart-2", 
    bgColor: "bg-chart-2" 
  },
  { 
    id: "deadline",
    label: "Scadenza", 
    color: "text-chart-5", 
    bgColor: "bg-chart-5" 
  },
  { 
    id: "event",
    label: "Evento", 
    color: "text-chart-3", 
    bgColor: "bg-chart-3" 
  },
  { 
    id: "reminder",
    label: "Promemoria", 
    color: "text-chart-4", 
    bgColor: "bg-chart-4" 
  },
]

export const availableColors = [
  { name: "Blu", color: "text-chart-1", bgColor: "bg-chart-1" },
  { name: "Giallo", color: "text-chart-2", bgColor: "bg-chart-2" },
  { name: "Verde", color: "text-chart-3", bgColor: "bg-chart-3" },
  { name: "Rosa", color: "text-chart-4", bgColor: "bg-chart-4" },
  { name: "Rosso", color: "text-chart-5", bgColor: "bg-chart-5" },
]
