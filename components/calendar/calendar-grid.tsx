"use client";

import { Activity, ActivityTypeConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ActivityBadge } from "./activity-badge";
import { Plus } from "lucide-react";

interface CalendarGridProps {
	currentDate: Date;
	activities: Activity[];
	activityTypes: ActivityTypeConfig[];
	onDateClick: (date: Date) => void;
	onRemoveActivity: (id: string) => void;
}

const dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
	const day = new Date(year, month, 1).getDay();
	return day === 0 ? 6 : day - 1; // Convert to Monday-based (0 = Monday)
}

export function CalendarGrid({ currentDate, activities, activityTypes, onDateClick, onRemoveActivity }: CalendarGridProps) {
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const daysInMonth = getDaysInMonth(year, month);
	const firstDay = getFirstDayOfMonth(year, month);
	const today = new Date();

	const isToday = (day: number) => {
		return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
	};

	const getActivitiesForDay = (day: number) => {
		return activities.filter((activity) => {
			const activityDate = new Date(activity.date);
			return activityDate.getDate() === day && activityDate.getMonth() === month && activityDate.getFullYear() === year;
		});
	};

	const days = [];

	// Empty cells for days before the first day of month
	for (let i = 0; i < firstDay; i++) {
		days.push(<div key={`empty-${i}`} className="min-h-30 border-r border-b border-border bg-background/50" />);
	}

	// Days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		const dayActivities = getActivitiesForDay(day);
		const date = new Date(year, month, day);

		days.push(
			<div
				key={day}
				className={cn(
					"min-h-30 border-r border-b border-border p-2 transition-colors hover:bg-secondary/50 cursor-pointer group relative",
					isToday(day) && "bg-primary/5",
				)}
				onClick={() => onDateClick(date)}>
				<div className="flex items-center justify-between mb-2">
					<span
						className={cn(
							"flex h-7 w-7 items-center justify-center rounded-full text-sm",
							isToday(day) ? "bg-primary text-primary-foreground font-medium" : "text-foreground",
						)}>
						{day}
					</span>
					<button
						className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 flex items-center justify-center rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
						onClick={(e) => {
							e.stopPropagation();
							onDateClick(date);
						}}
						aria-label="Aggiungi attività">
						<Plus className="h-4 w-4" />
					</button>
				</div>
				<div className="space-y-1 overflow-hidden">
					{dayActivities.slice(0, 3).map((activity) => (
						<ActivityBadge key={activity.id} activity={activity} activityTypes={activityTypes} onRemove={onRemoveActivity} />
					))}
					{dayActivities.length > 3 && <div className="text-xs text-muted-foreground">+{dayActivities.length - 3} altri</div>}
				</div>
			</div>,
		);
	}

	return (
		<div className="rounded-lg border border-border bg-card overflow-hidden">
			{/* Header with day names */}
			<div className="grid grid-cols-7 border-b border-border">
				{dayNames.map((day) => (
					<div key={day} className="px-2 py-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0">
						{day}
					</div>
				))}
			</div>
			{/* Calendar grid */}
			<div className="grid grid-cols-7">{days}</div>
		</div>
	);
}
