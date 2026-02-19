import type { Task, NormalizedData } from "../types";

/**
 * Normalizuje tablicę tasków do płaskiej struktury
 * @param tasks - Tablica tasków z API (zagnieżdżone dane)
 * @returns Znormalizowane dane (płaska struktura)
 */
export function normalizeTasks(tasks: Task[]): NormalizedData {
	const normalized: NormalizedData = {
		tasks: {},
		users: {},
		projects: {},
	};

	tasks.forEach((task) => {
		// Zapisujemy task (tylko z ID, bez zagnieżdżonych obiektów)
		normalized.tasks[task.id] = {
			id: task.id,
			title: task.title,
			completed: task.completed,
			assigneeId: task.assignee.id,
			projectId: task.project.id,
		};

		// Zapisujemy usera (RAZ, nawet jeśli pojawia się w wielu taskach)
		normalized.users[task.assignee.id] = task.assignee;

		// Zapisujemy projekt (RAZ, nawet jeśli pojawia się w wielu taskach)
		normalized.projects[task.project.id] = task.project;
	});

	return normalized;
}
