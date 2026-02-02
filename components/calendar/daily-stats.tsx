"use client";

import { Activity, ActivityTypeConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

interface DailyStatsProps {
	activities: Activity[];
	activityTypes: ActivityTypeConfig[];
	currentDate: Date;
}

export function DailyStats({ activities, activityTypes, currentDate }: DailyStatsProps) {
	const counts = activities.reduce(
		(acc, activity) => {
			acc[activity.typeId] = (acc[activity.typeId] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	const total = activities.length;

	const today = new Date();
	const isToday =
		currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

	const isPast = currentDate < today && !isToday;
	const isFuture = currentDate > today;

	return (
		<div className="space-y-4">
			{/* Day Info Card */}
			<div className="rounded-lg border border-border bg-card p-4">
				<div className="flex items-center gap-3 mb-4">
					<div
						className={cn(
							"h-10 w-10 rounded-full flex items-center justify-center",
							isToday ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
						)}>
						<Calendar className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-sm font-medium text-foreground">{isToday ? "Oggi" : isPast ? "Giorno Passato" : "Giorno Futuro"}</h3>
						<p className="text-xs text-muted-foreground">
							{currentDate.toLocaleDateString("it-IT", {
								weekday: "short",
								day: "numeric",
								month: "short",
							})}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="rounded-lg bg-muted/50 p-3">
						<div className="text-2xl font-bold text-foreground">{total}</div>
						<div className="text-xs text-muted-foreground">{total === 1 ? "Attività" : "Attività"}</div>
					</div>
					<div className="rounded-lg bg-muted/50 p-3">
						<div className="text-2xl font-bold text-foreground">{activityTypes.length}</div>
						<div className="text-xs text-muted-foreground">{activityTypes.length === 1 ? "Tipologia" : "Tipologie"}</div>
					</div>
				</div>
			</div>

			{/* Activity Type Breakdown */}
			<div className="rounded-lg border border-border bg-card p-4">
				<h2 className="text-sm font-medium text-muted-foreground mb-4">Riepilogo per Tipologia</h2>
				{total === 0 ? (
					<div className="text-center py-6">
						<div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
							<CheckCircle2 className="h-6 w-6 text-muted-foreground/50" />
						</div>
						<p className="text-xs text-muted-foreground">Nessuna attività per questo giorno</p>
					</div>
				) : (
					<div className="space-y-3">
						{activityTypes.map((type) => {
							const count = counts[type.id] || 0;
							const percentage = total > 0 ? (count / total) * 100 : 0;

							if (count === 0) return null;

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
				)}
			</div>

			{/* Time Info */}
			{isToday && (
				<div className="rounded-lg border border-border bg-card p-4">
					<div className="flex items-center gap-2 mb-2">
						<Clock className="h-4 w-4 text-primary" />
						<h3 className="text-sm font-medium text-foreground">Ora Corrente</h3>
					</div>
					<p className="text-2xl font-bold text-foreground">
						{new Date().toLocaleTimeString("it-IT", {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</p>
				</div>
			)}
		</div>
	);
}
