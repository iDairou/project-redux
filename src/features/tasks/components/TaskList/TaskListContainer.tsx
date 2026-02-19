// CONTAINER

import { useGetTasksQuery } from "../../api";
import TaskListPresenter from "./TaskListPresenter";

function TaskListContainer() {
	console.log("TaskList RENDER");

	const { data, isLoading, isError } = useGetTasksQuery();

	// denormalizacja
	const tasksWithDetails = data
		? Object.values(data.tasks).map((task) => ({
				...task,
				assignee: data.users[task.assigneeId],
				project: data.projects[task.projectId],
			}))
		: [];

	return (
		<TaskListPresenter
			tasks={tasksWithDetails}
			isLoading={isLoading}
			isError={isError}
		/>
	);
}

export default TaskListContainer;
