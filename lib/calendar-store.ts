import { Activity } from "./types";

// Simple in-memory store for activities
let activities: Activity[] = [];

export function getActivities(): Activity[] {
	return activities;
}

export function addActivity(activity: Activity): void {
	activities.push(activity);
}

export function removeActivity(id: string): void {
	activities = activities.filter((a) => a.id !== id);
}

export function getActivitiesForMonth(year: number, month: number): Activity[] {
	return activities.filter((activity) => {
		const date = new Date(activity.date);
		return date.getFullYear() === year && date.getMonth() === month;
	});
}

export function getActivitiesForDate(date: Date): Activity[] {
	return activities.filter((activity) => {
		const activityDate = new Date(activity.date);
		return (
			activityDate.getFullYear() === date.getFullYear() && activityDate.getMonth() === date.getMonth() && activityDate.getDate() === date.getDate()
		);
	});
}

// Get start of week (Monday)
export function getStartOfWeek(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

// Get end of week (Sunday)
export function getEndOfWeek(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? 0 : 7 - day; // Adjust to Sunday
	d.setDate(d.getDate() + diff);
	d.setHours(23, 59, 59, 999);
	return d;
}

// Get activities for a specific week
export function getActivitiesForWeek(date: Date): Activity[] {
	const startOfWeek = getStartOfWeek(date);
	const endOfWeek = getEndOfWeek(date);

	return activities.filter((activity) => {
		const activityDate = new Date(activity.date);
		return activityDate >= startOfWeek && activityDate <= endOfWeek;
	});
}
