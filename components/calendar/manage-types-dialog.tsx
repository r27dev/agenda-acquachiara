"use client"

import { useState, useEffect } from "react"
import { mutate } from "swr"
import { ActivityTypeConfig, availableColors } from "@/lib/types"
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
import { cn } from "@/lib/utils"
import { Pencil, Plus, Trash2, X, Loader2 } from "lucide-react"

interface ManageTypesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activityTypes: ActivityTypeConfig[]
  onUpdateTypes: (types: ActivityTypeConfig[]) => void
}

export function ManageTypesDialog({
  open,
  onOpenChange,
  activityTypes,
  onUpdateTypes,
}: ManageTypesDialogProps) {
  const [types, setTypes] = useState<ActivityTypeConfig[]>(activityTypes)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeColorIndex, setNewTypeColorIndex] = useState(0)
  const [editName, setEditName] = useState("")
  const [editColorIndex, setEditColorIndex] = useState(0)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<{
    added: ActivityTypeConfig[]
    updated: ActivityTypeConfig[]
    deleted: string[]
  }>({ added: [], updated: [], deleted: [] })

  // Sync with props when dialog opens
  useEffect(() => {
    if (open) {
      setTypes(activityTypes)
      setPendingChanges({ added: [], updated: [], deleted: [] })
    }
  }, [open, activityTypes])

  const handleAddType = () => {
    if (!newTypeName.trim()) return
    
    const colorConfig = availableColors[newTypeColorIndex]
    const tempId = `temp-${crypto.randomUUID()}`
    const newType: ActivityTypeConfig = {
      id: tempId,
      label: newTypeName.trim(),
      color: colorConfig.color,
      bgColor: colorConfig.bgColor,
    }
    
    setTypes([...types, newType])
    setPendingChanges(prev => ({
      ...prev,
      added: [...prev.added, newType]
    }))
    setNewTypeName("")
    setNewTypeColorIndex(0)
    setIsAddingNew(false)
  }

  const handleStartEdit = (type: ActivityTypeConfig) => {
    setEditingId(type.id)
    setEditName(type.label)
    const colorIndex = availableColors.findIndex(c => c.bgColor === type.bgColor)
    setEditColorIndex(colorIndex >= 0 ? colorIndex : 0)
  }

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return
    
    const colorConfig = availableColors[editColorIndex]
    const updatedType = { 
      id, 
      label: editName.trim(), 
      color: colorConfig.color, 
      bgColor: colorConfig.bgColor 
    }
    
    setTypes(types.map(t => t.id === id ? updatedType : t))
    
    // Track if it's a new type or existing
    const isNewType = pendingChanges.added.some(t => t.id === id)
    if (isNewType) {
      setPendingChanges(prev => ({
        ...prev,
        added: prev.added.map(t => t.id === id ? updatedType : t)
      }))
    } else {
      setPendingChanges(prev => ({
        ...prev,
        updated: [...prev.updated.filter(t => t.id !== id), updatedType]
      }))
    }
    
    setEditingId(null)
    setEditName("")
  }

  const handleDeleteType = (id: string) => {
    if (types.length <= 1) return
    setTypes(types.filter(t => t.id !== id))
    
    // Track deletion
    const isNewType = pendingChanges.added.some(t => t.id === id)
    if (isNewType) {
      // Remove from added list if it was a new type
      setPendingChanges(prev => ({
        ...prev,
        added: prev.added.filter(t => t.id !== id)
      }))
    } else {
      // Add to deleted list if it was an existing type
      setPendingChanges(prev => ({
        ...prev,
        deleted: [...prev.deleted, id],
        updated: prev.updated.filter(t => t.id !== id)
      }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Process deletions first
      for (const id of pendingChanges.deleted) {
        await fetch(`/api/activity-types/${id}`, { method: "DELETE" })
      }
      
      // Process updates
      for (const type of pendingChanges.updated) {
        const colorName = availableColors.find(c => c.bgColor === type.bgColor)?.name || "blue"
        await fetch(`/api/activity-types/${type.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: type.label, color: colorName.toLowerCase() })
        })
      }
      
      // Process additions
      for (const type of pendingChanges.added) {
        const colorName = availableColors.find(c => c.bgColor === type.bgColor)?.name || "blue"
        await fetch("/api/activity-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: type.label, color: colorName.toLowerCase() })
        })
      }
      
      // Refresh data
      mutate("/api/activity-types")
      onUpdateTypes(types)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving types:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setTypes(activityTypes)
    setEditingId(null)
    setIsAddingNew(false)
    setPendingChanges({ added: [], updated: [], deleted: [] })
    onOpenChange(false)
  }

  const hasChanges = pendingChanges.added.length > 0 || 
                     pendingChanges.updated.length > 0 || 
                     pendingChanges.deleted.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Gestisci Tipologie</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Aggiungi, modifica o elimina le tipologie di attività
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
          {types.map((type) => (
            <div 
              key={type.id} 
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
            >
              {editingId === type.id ? (
                <>
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 bg-input border-border"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      {availableColors.map((colorOption, index) => (
                        <button
                          key={colorOption.name}
                          type="button"
                          onClick={() => setEditColorIndex(index)}
                          className={cn(
                            "h-6 w-6 rounded-full transition-all",
                            colorOption.bgColor,
                            editColorIndex === index 
                              ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" 
                              : "opacity-60 hover:opacity-100"
                          )}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleSaveEdit(type.id)}
                    >
                      <span className="sr-only">Salva</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingId(null)}
                    >
                      <span className="sr-only">Annulla</span>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className={cn("h-3 w-3 rounded-full shrink-0", type.bgColor)} />
                  <span className="flex-1 text-sm font-medium text-foreground">{type.label}</span>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleStartEdit(type)}
                    >
                      <span className="sr-only">Modifica</span>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteType(type.id)}
                      disabled={types.length <= 1}
                    >
                      <span className="sr-only">Elimina</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Add new type form */}
          {isAddingNew ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Nome tipologia"
                  className="h-8 bg-input border-border"
                  autoFocus
                />
                <div className="flex gap-1">
                  {availableColors.map((colorOption, index) => (
                    <button
                      key={colorOption.name}
                      type="button"
                      onClick={() => setNewTypeColorIndex(index)}
                      className={cn(
                        "h-6 w-6 rounded-full transition-all",
                        colorOption.bgColor,
                        newTypeColorIndex === index 
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" 
                          : "opacity-60 hover:opacity-100"
                      )}
                      title={colorOption.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={handleAddType}
                  disabled={!newTypeName.trim()}
                >
                  <span className="sr-only">Aggiungi</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setIsAddingNew(false)
                    setNewTypeName("")
                  }}
                >
                  <span className="sr-only">Annulla</span>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground bg-transparent"
              onClick={() => setIsAddingNew(true)}
            >
              <Plus className="h-4 w-4" />
              Aggiungi tipologia
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvataggio...
              </>
            ) : (
              "Salva modifiche"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
