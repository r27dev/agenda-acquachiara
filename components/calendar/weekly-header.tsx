"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeeklyHeaderProps {
	currentDate: Date;
	startOfWeek: Date;
	endOfWeek: Date;
	onPrevWeek: () => void;
	onNextWeek: () => void;
	onToday: () => void;
}

const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

function formatWeekRange(startDate: Date, endDate: Date): string {
	const startMonth = monthNames[startDate.getMonth()];
	const endMonth = monthNames[endDate.getMonth()];
	const startYear = startDate.getFullYear();
	const endYear = endDate.getFullYear();

	if (startDate.getMonth() === endDate.getMonth() && startYear === endYear) {
		return `${startDate.getDate()}-${endDate.getDate()} ${startMonth} ${startYear}`;
	} else if (startYear === endYear) {
		return `${startDate.getDate()} ${startMonth} - ${endDate.getDate()} ${endMonth} ${startYear}`;
	} else {
		return `${startDate.getDate()} ${startMonth} ${startYear} - ${endDate.getDate()} ${endMonth} ${endYear}`;
	}
}

export function WeeklyHeader({ currentDate, startOfWeek, endOfWeek, onPrevWeek, onNextWeek, onToday }: WeeklyHeaderProps) {
	const weekRange = formatWeekRange(startOfWeek, endOfWeek);

	// Check if current week contains today
	const today = new Date();
	const isCurrentWeek = today >= startOfWeek && today <= endOfWeek;

	return (
		<div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
			<div className="flex items-center gap-2">
				<Button variant="outline" size="icon" onClick={onPrevWeek} className="h-9 w-9">
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon" onClick={onNextWeek} className="h-9 w-9">
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			<div className="text-center">
				<h2 className="text-lg font-semibold text-foreground">{weekRange}</h2>
			</div>

			<Button variant={isCurrentWeek ? "secondary" : "outline"} size="sm" onClick={onToday} disabled={isCurrentWeek}>
				Oggi
			</Button>
		</div>
	);
}
