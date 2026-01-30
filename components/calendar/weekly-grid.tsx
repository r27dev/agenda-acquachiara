"use client";

import { Activity, ActivityTypeConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ActivityBadge } from "./activity-badge";
import { Plus } from "lucide-react";

interface WeeklyGridProps {
	startOfWeek: Date;
	activities: Activity[];
	activityTypes: ActivityTypeConfig[];
	onDateClick: (date: Date) => void;
	onRemoveActivity: (id: string) => void;
}

const dayNames = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

function getWeekDays(startOfWeek: Date): Date[] {
	const days: Date[] = [];
	for (let i = 0; i < 7; i++) {
		const day = new Date(startOfWeek);
		day.setDate(startOfWeek.getDate() + i);
		days.push(day);
	}
	return days;
}

export function WeeklyGrid({ startOfWeek, activities, activityTypes, onDateClick, onRemoveActivity }: WeeklyGridProps) {
	const weekDays = getWeekDays(startOfWeek);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const isToday = (date: Date) => {
		const compareDate = new Date(date);
		compareDate.setHours(0, 0, 0, 0);
		return compareDate.getTime() === today.getTime();
	};

	const getActivitiesForDay = (date: Date) => {
		return activities.filter((activity) => {
			const activityDate = new Date(activity.date);
			return (
				activityDate.getDate() === date.getDate() && activityDate.getMonth() === date.getMonth() && activityDate.getFullYear() === date.getFullYear()
			);
		});
	};

	return (
		<div className="rounded-lg border border-border bg-card overflow-hidden">
			{/* Day Headers */}
			<div className="grid grid-cols-7 border-b border-border bg-muted/50">
				{weekDays.map((date, index) => (
					<div key={index} className={cn("p-3 text-center border-r border-border last:border-r-0", isToday(date) && "bg-primary/10")}>
						<div className="text-xs font-medium text-muted-foreground mb-1">{dayNames[index]}</div>
						<div
							className={cn(
								"mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
								isToday(date) ? "bg-primary text-primary-foreground" : "text-foreground",
							)}>
							{date.getDate()}
						</div>
					</div>
				))}
			</div>

			{/* Day Content */}
			<div className="grid grid-cols-7">
				{weekDays.map((date, index) => {
					const dayActivities = getActivitiesForDay(date);

					return (
						<div
							key={index}
							className={cn(
								"min-h-50 border-r border-border last:border-r-0 p-3 transition-colors hover:bg-secondary/50 cursor-pointer group relative",
								isToday(date) && "bg-primary/5",
							)}
							onClick={() => onDateClick(date)}>
							{/* Add button */}
							<button
								className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
								onClick={(e) => {
									e.stopPropagation();
									onDateClick(date);
								}}>
								<Plus className="h-4 w-4" />
							</button>

							{/* Activities */}
							<div className="space-y-1.5 mt-8">
								{dayActivities.length === 0 ? (
									<div className="text-xs text-muted-foreground/50 text-center py-8">Nessuna attività</div>
								) : (
									dayActivities.map((activity) => {
										const type = activityTypes.find((t) => t.id === activity.typeId);
										return <ActivityBadge key={activity.id} activity={activity} type={type} onRemove={() => onRemoveActivity(activity.id)} />;
									})
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
