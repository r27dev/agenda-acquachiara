"use client";

import { Activity, ActivityTypeConfig } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyViewProps {
	currentDate: Date;
	activities: Activity[];
	activityTypes: ActivityTypeConfig[];
	onAddActivity: () => void;
	onRemoveActivity: (id: string) => void;
}

export function DailyView({ currentDate, activities, activityTypes, onAddActivity, onRemoveActivity }: DailyViewProps) {
	const today = new Date();
	const isToday =
		currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

	return (
		<div className="rounded-lg border border-border bg-card overflow-hidden">
			{/* Header */}
			<div className={cn("p-6 border-b border-border", isToday ? "bg-primary/5" : "bg-muted/30")}>
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-foreground mb-1">
							{currentDate.toLocaleDateString("it-IT", {
								weekday: "long",
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</h2>
						{isToday && (
							<span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
								<Clock className="h-3 w-3" />
								Oggi
							</span>
						)}
					</div>
					<Button onClick={onAddActivity} className="gap-2">
						<Plus className="h-4 w-4" />
						Aggiungi Attività
					</Button>
				</div>
			</div>

			{/* Activities List */}
			<div className="p-6">
				{activities.length === 0 ? (
					<div className="text-center py-16">
						<div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
							<CalendarRange className="h-8 w-8 text-muted-foreground/50" />
						</div>
						<h3 className="text-lg font-medium text-foreground mb-2">Nessuna attività programmata</h3>
						<p className="text-sm text-muted-foreground mb-4">Inizia aggiungendo la tua prima attività per questo giorno</p>
						<Button onClick={onAddActivity} variant="outline" className="gap-2">
							<Plus className="h-4 w-4" />
							Aggiungi Attività
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						{activities.map((activity) => {
							const type = activityTypes.find((t) => t.id === activity.typeId);

							return (
								<div key={activity.id} className="group relative rounded-lg border border-border bg-background p-4 transition-all hover:shadow-md">
									<div className="flex items-start gap-3">
										{/* Type Indicator */}
										<div className="flex-shrink-0">
											<div className={cn("w-3 h-3 rounded-full", type?.bgColor || "bg-muted")} />
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1">
													<h4 className="text-base font-medium text-foreground mb-1">{activity.title}</h4>
													{activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
												</div>

												{/* Remove Button */}
												<button
													onClick={() => onRemoveActivity(activity.id)}
													className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 h-8 w-8 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
													aria-label="Rimuovi attività">
													<X className="h-4 w-4" />
												</button>
											</div>

											{/* Type Badge */}
											<div className="mt-2 flex items-center gap-2">
												<span
													className={cn(
														"inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
														type?.bgColor ? `${type.bgColor}/20` : "bg-muted",
														type?.color || "text-foreground",
													)}>
													{type?.label || "Senza categoria"}
												</span>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

function CalendarRange({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}>
			<rect width="18" height="18" x="3" y="4" rx="2" />
			<path d="M16 2v4" />
			<path d="M8 2v4" />
			<path d="M3 10h18" />
			<path d="M8 14h.01" />
			<path d="M12 14h.01" />
			<path d="M16 14h.01" />
			<path d="M8 18h.01" />
			<path d="M12 18h.01" />
			<path d="M16 18h.01" />
		</svg>
	);
}
