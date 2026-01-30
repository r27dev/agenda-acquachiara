"use client";

import { useState } from "react";
import { MonthlyCalendar } from "@/components/calendar/monthly-calendar";
import { WeeklyCalendar } from "@/components/calendar/weekly-calendar";
import { DailyCalendar } from "@/components/calendar/daily-calendar";

type ViewMode = "monthly" | "weekly" | "daily";

export default function Page() {
	const [viewMode, setViewMode] = useState<ViewMode>("monthly");

	return (
		<div>
			{/* Calendar Views */}
			{viewMode === "monthly" ? (
				<MonthlyCalendar viewMode={viewMode} setViewMode={setViewMode} />
			) : viewMode === "weekly" ? (
				<WeeklyCalendar viewMode={viewMode} setViewMode={setViewMode} />
			) : (
				<DailyCalendar viewMode={viewMode} setViewMode={setViewMode} />
			)}
		</div>
	);
}
