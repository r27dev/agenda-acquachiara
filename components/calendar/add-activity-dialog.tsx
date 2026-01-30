"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Activity, ActivityTypeConfig } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  onAddActivity: (activity: Omit<Activity, "id">) => void
  activityTypes: ActivityTypeConfig[]
}

export function AddActivityDialog({
  open,
  onOpenChange,
  selectedDate,
  onAddActivity,
  activityTypes,
}: AddActivityDialogProps) {
  const [title, setTitle] = useState("")
  const [typeId, setTypeId] = useState(activityTypes[0]?.id || "")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (activityTypes.length > 0 && !activityTypes.find(t => t.id === typeId)) {
      setTypeId(activityTypes[0].id)
    }
  }, [activityTypes, typeId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !selectedDate || !typeId) return

    // Format date as YYYY-MM-DD for the API
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    onAddActivity({
      title: title.trim(),
      typeId,
      date: dateStr,
      description: description.trim() || undefined,
    })

    setTitle("")
    setTypeId(activityTypes[0]?.id || "")
    setDescription("")
    onOpenChange(false)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Aggiungi Attività</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {formatDate(selectedDate)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-foreground">Titolo</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome dell'attività"
                className="bg-input border-border"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-foreground">Tipo</Label>
              <Select value={typeId} onValueChange={setTypeId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {activityTypes.map((activityType) => (
                    <SelectItem key={activityType.id} value={activityType.id}>
                      <span className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", activityType.bgColor)} />
                        {activityType.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-foreground">
                Descrizione <span className="text-muted-foreground">(opzionale)</span>
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Aggiungi una descrizione"
                className="bg-input border-border"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Aggiungi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
