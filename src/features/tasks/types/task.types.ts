import type { User } from "./user.types";
import type { Project } from "./project.types";

// Task z zagnieżdżonymi danymi (jak przychodzi z API)
export interface Task {
	id: number;
	title: string;
	completed: boolean;
	assignee: User;
	project: Project;
}

// Task znormalizowany (tylko ID, bez zagnieżdżonych obiektów)
export interface NormalizedTask {
	id: number;
	title: string;
	completed: boolean;
	assigneeId: number; // Tylko ID zamiast całego User
	projectId: number; // Tylko ID zamiast całego Project
}

// Struktura znormalizowanych danych w cache
export interface NormalizedData {
	tasks: Record<number, NormalizedTask>;
	users: Record<number, User>;
	projects: Record<number, Project>; 
}
