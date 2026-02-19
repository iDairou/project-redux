import { useGetTasksQuery, useUpdateTaskMutation } from "../api/taskApi";

function TaskToggle() {
	console.log("🟢 TaskToggle RENDER");

	const { data } = useGetTasksQuery();
	const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

	const handleToggle = async (taskId: number, currentCompleted: boolean) => {
		await updateTask({
			id: taskId,
			completed: !currentCompleted,
		});
	};

	if (!data) return <div>Ładowanie...</div>;

	const tasksArray = Object.values(data.tasks);

	return (
		<div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
			<h2>Oznacz jako ukończone</h2>
			<ul style={{ listStyle: "none", padding: 0 }}>
				{tasksArray.map((task) => {
					const assignee = data.users[task.assigneeId];
					const project = data.projects[task.projectId];

					return (
						<li key={task.id} style={{ marginBottom: "8px" }}>
							<label
								style={{
									display: "flex",
									alignItems: "center",
									cursor: "pointer",
								}}
							>
								<input
									type="checkbox"
									checked={task.completed}
									onChange={() => handleToggle(task.id, task.completed)}
									disabled={isUpdating}
									style={{ marginRight: "8px" }}
								/>
								<span
									style={{
										textDecoration: task.completed ? "line-through" : "none",
									}}
								>
									{task.title}
									<br />
									<small>
										👤 {assignee.name} | 📁 {project.name}
									</small>
								</span>
								{isUpdating && <span style={{ marginLeft: "8px" }}>⏳</span>}
							</label>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default TaskToggle;