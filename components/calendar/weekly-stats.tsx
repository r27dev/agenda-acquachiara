"use client";

import { Activity, ActivityTypeConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WeeklyStatsProps {
	activities: Activity[];
	activityTypes: ActivityTypeConfig[];
	startOfWeek: Date;
	endOfWeek: Date;
}

const dayNames = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function getWeekDays(startOfWeek: Date): Date[] {
	const days: Date[] = [];
	for (let i = 0; i < 7; i++) {
		const day = new Date(startOfWeek);
		day.setDate(startOfWeek.getDate() + i);
		days.push(day);
	}
	return days;
}

export function WeeklyStats({ activities, activityTypes, startOfWeek }: WeeklyStatsProps) {
	const counts = activities.reduce(
		(acc, activity) => {
			acc[activity.typeId] = (acc[activity.typeId] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	const total = activities.length;

	// Calcola attività per giorno
	const weekDays = getWeekDays(startOfWeek);
	const activitiesPerDay = weekDays.map((date) => {
		const dayActivities = activities.filter((activity) => {
			const activityDate = new Date(activity.date);
			return (
				activityDate.getDate() === date.getDate() && activityDate.getMonth() === date.getMonth() && activityDate.getFullYear() === date.getFullYear()
			);
		});
		return {
			day: dayNames[weekDays.indexOf(date)],
			count: dayActivities.length,
			date: date,
		};
	});

	const maxDayCount = Math.max(...activitiesPerDay.map((d) => d.count), 1);
	const busiestDay = activitiesPerDay.reduce((prev, current) => (current.count > prev.count ? current : prev));

	return (
		<div className="space-y-4">
			{/* Riepilogo per tipo */}
			<div className="rounded-lg border border-border bg-card p-4">
				<h2 className="text-sm font-medium text-muted-foreground mb-4">Riepilogo Settimanale</h2>
				<div className="space-y-3">
					{activityTypes.map((type) => {
						const count = counts[type.id] || 0;
						const percentage = total > 0 ? (count / total) * 100 : 0;

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
									<div className={cn("h-full rounded-full transition-all duration-300", type.bgColor)} style={{ width: `${percentage}%` }} />
								</div>
							</div>
						);
					})}
				</div>
				<div className="mt-4 pt-4 border-t border-border">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Totale</span>
						<span className="font-semibold text-foreground">{total}</span>
					</div>
				</div>
			</div>

			{/* Distribuzione giornaliera */}
			<div className="rounded-lg border border-border bg-card p-4">
				<h3 className="text-sm font-medium text-muted-foreground mb-3">Distribuzione Settimanale</h3>
				<div className="space-y-2">
					{activitiesPerDay.map((day, index) => {
						const barPercentage = maxDayCount > 0 ? (day.count / maxDayCount) * 100 : 0;
						const isToday = new Date().toDateString() === day.date.toDateString();

						return (
							<div key={index} className="space-y-1">
								<div className="flex items-center justify-between text-xs">
									<span className={cn("font-medium", isToday ? "text-primary" : "text-muted-foreground")}>{day.day}</span>
									<span className="text-foreground">{day.count}</span>
								</div>
								<div className="h-1.5 rounded-full bg-secondary overflow-hidden">
									<div
										className={cn("h-full rounded-full transition-all duration-300", isToday ? "bg-primary" : "bg-primary/70")}
										style={{ width: `${barPercentage}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>

				{total > 0 && (
					<div className="mt-3 pt-3 border-t border-border">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Giorno più impegnativo</span>
							<span className="font-medium text-foreground">
								{busiestDay.day} ({busiestDay.count})
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
