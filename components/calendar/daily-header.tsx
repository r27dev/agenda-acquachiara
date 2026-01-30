"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DailyHeaderProps {
  currentDate: Date
  onPrevDay: () => void
  onNextDay: () => void
  onToday: () => void
}

const monthNames = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
]

const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
]

export function DailyHeader({
  currentDate,
  onPrevDay,
  onNextDay,
  onToday,
}: DailyHeaderProps) {
  const dayName = dayNames[currentDate.getDay()]
  const day = currentDate.getDate()
  const month = monthNames[currentDate.getMonth()]
  const year = currentDate.getFullYear()
  
  // Check if current date is today
  const today = new Date()
  const isToday = 
    currentDate.getDate() === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevDay}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextDay}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">
          {dayName}, {day} {month} {year}
        </h2>
      </div>

      <Button
        variant={isToday ? "secondary" : "outline"}
        size="sm"
        onClick={onToday}
        disabled={isToday}
      >
        Oggi
      </Button>
    </div>
  )
}
