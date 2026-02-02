"use client";

import { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { Activity, ActivityTypeConfig, availableColors } from "@/lib/types";
import { DailyHeader } from "./daily-header";
import { DailyView } from "./daily-view";
import { DailyStats } from "./daily-stats";
import { AddActivityDialog } from "./add-activity-dialog";
import { ManageTypesDialog } from "./manage-types-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Settings2, Loader2, Calendar, CalendarDays, CalendarRange } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ViewMode = "monthly" | "weekly" | "daily";

interface DailyCalendarProps {
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
}

// Convert DB color to Tailwind classes
function getTypeWithColors(type: { id: string; name: string; color: string }): ActivityTypeConfig {
	const colorConfig = availableColors.find((c) => c.name.toLowerCase() === type.color.toLowerCase());
	return {
		id: type.id,
		label: type.name,
		color: colorConfig?.color || "text-chart-1",
		bgColor: colorConfig?.bgColor || "bg-chart-1",
	};
}

export function DailyCalendar({ viewMode, setViewMode }: DailyCalendarProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [typesDialogOpen, setTypesDialogOpen] = useState(false);

	const month = currentDate.getMonth();
	const year = currentDate.getFullYear();

	// Fetch activity types
	const { data: rawTypes, isLoading: typesLoading } = useSWR<{ id: string; name: string; color: string }[]>("/api/activity-types", fetcher);

	// Fetch activities for current month (to get day's activities)
	const { data: allActivities, isLoading: activitiesLoading } = useSWR<Activity[]>(`/api/activities?month=${month}&year=${year}`, fetcher);

	const activityTypes = rawTypes?.map(getTypeWithColors) || [];
	const isLoading = typesLoading || activitiesLoading;

	// Filter activities for current day
	const dayActivities = (allActivities || []).filter((activity) => {
		const activityDate = new Date(activity.date);
		return (
			activityDate.getDate() === currentDate.getDate() &&
			activityDate.getMonth() === currentDate.getMonth() &&
			activityDate.getFullYear() === currentDate.getFullYear()
		);
	});

	const handlePrevDay = useCallback(() => {
		setCurrentDate((prev) => {
			const d = new Date(prev);
			d.setDate(d.getDate() - 1);
			return d;
		});
	}, []);

	const handleNextDay = useCallback(() => {
		setCurrentDate((prev) => {
			const d = new Date(prev);
			d.setDate(d.getDate() + 1);
			return d;
		});
	}, []);

	const handleToday = useCallback(() => {
		setCurrentDate(new Date());
	}, []);

	const handleAddActivity = useCallback(
		async (activityData: Omit<Activity, "id">) => {
			try {
				await fetch("/api/activities", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(activityData),
				});
				mutate(`/api/activities?month=${month}&year=${year}`);
			} catch (error) {
				console.error("Error adding activity:", error);
			}
		},
		[month, year],
	);

	const handleRemoveActivity = useCallback(
		async (id: string) => {
			try {
				await fetch(`/api/activities/${id}`, { method: "DELETE" });
				mutate(`/api/activities?month=${month}&year=${year}`);
			} catch (error) {
				console.error("Error removing activity:", error);
			}
		},
		[month, year],
	);

	const handleUpdateTypes = useCallback(
		async (newTypes: ActivityTypeConfig[]) => {
			mutate("/api/activity-types");
			mutate(`/api/activities?month=${month}&year=${year}`);
		},
		[month, year],
	);

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="mx-auto max-w-7xl space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-foreground">Agenda Acquachiara</h1>
						<p className="text-sm text-muted-foreground">Gestisci e monitora le tue attività giornaliere</p>
					</div>
					{/* Activity Type Legend with Settings */}
					<div className="flex flex-wrap items-center gap-3">
						{activityTypes.map((type) => (
							<div key={type.id} className="flex items-center gap-1.5">
								<span className={cn("h-2.5 w-2.5 rounded-full", type.bgColor)} />
								<span className="text-xs text-muted-foreground">{type.label}</span>
							</div>
						))}
						<Button
							variant="ghost"
							size="sm"
							className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
							onClick={() => setTypesDialogOpen(true)}>
							<Settings2 className="h-4 w-4" />
							<span className="hidden sm:inline">Gestisci</span>
						</Button>
					</div>
				</div>

				{/* View Toggle */}
				<div className="flex justify-center">
					<div className="inline-flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
						<Button variant={viewMode === "monthly" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("monthly")} className="gap-2">
							<Calendar className="h-4 w-4" />
							Mensile
						</Button>
						<Button variant={viewMode === "weekly" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("weekly")} className="gap-2">
							<CalendarDays className="h-4 w-4" />
							Settimanale
						</Button>
						<Button variant={viewMode === "daily" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("daily")} className="gap-2">
							<CalendarRange className="h-4 w-4" />
							Giornaliera
						</Button>
					</div>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : (
					<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
						{/* Calendar Section */}
						<div className="space-y-4">
							<DailyHeader currentDate={currentDate} onPrevDay={handlePrevDay} onNextDay={handleNextDay} onToday={handleToday} />
							<DailyView
								currentDate={currentDate}
								activities={dayActivities}
								activityTypes={activityTypes}
								onAddActivity={() => {
									setSelectedDate(currentDate);
									setDialogOpen(true);
								}}
								onRemoveActivity={handleRemoveActivity}
							/>
						</div>

						{/* Sidebar with Stats */}
						<div className="space-y-4">
							<DailyStats activities={dayActivities} activityTypes={activityTypes} currentDate={currentDate} />

							{/* Quick Tips */}
							<div className="rounded-lg border border-border bg-card p-4">
								<h3 className="text-sm font-medium text-foreground mb-2">Suggerimenti</h3>
								<ul className="text-xs text-muted-foreground space-y-2">
									<li>Clicca sul pulsante + per aggiungere un&apos;attività</li>
									<li>Passa il mouse su un&apos;attività per rimuoverla</li>
									<li>Usa le frecce per navigare tra i giorni</li>
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>

			<AddActivityDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				selectedDate={selectedDate}
				onAddActivity={handleAddActivity}
				activityTypes={activityTypes}
			/>

			<ManageTypesDialog open={typesDialogOpen} onOpenChange={setTypesDialogOpen} activityTypes={activityTypes} onUpdateTypes={handleUpdateTypes} />
		</div>
	);
}
