// PUBLIC API feature "tasks"
// To jest JEDYNY plik który powinien być importowany z zewnątrz

// Komponenty
export { default as TaskList } from "./components/TaskList";
export { default as TaskCounter } from "./components/TaskCounter";
export { default as TaskToggle } from "./components/TaskToggle";

// API
export { tasksApi, useGetTasksQuery, useUpdateTaskMutation } from "./api";

// Typy (jeśli potrzebne na zewnątrz)
export type {
	Task,
	NormalizedTask,
	NormalizedData,
	User,
	Project,
} from "./types";

// Utils (zazwyczaj nie expotujemy - internal)
// export { normalizeTasks } from './utils';
