// PRESENTER
interface TaskWithDetails {
	id: number;
	title: string;
	completed: boolean;
	assignee: {
		name: string;
		email: string;
	};
	project: {
		name: string;
	};
}

interface TaskListPresenterProps {
	tasks: TaskWithDetails[];
	isLoading: boolean;
	isError: boolean;
}

function TaskListPresenter({ tasks, isLoading, isError }: TaskListPresenterProps) {
	
	if (isLoading) {
		return <div>Ładowanie tasków...</div>;
	}
	
	if (isError) {
		return <div>Błąd pobierania danych</div>;
	}

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
			<h2>Lista Tasków (Presenter/Container)</h2>
			<ul>
				{tasks.map((task) => (
					<li 
						key={task.id} 
						style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
					>
						<strong>{task.title}</strong>
						<br />
						<small>
							👤 {task.assignee.name} ({task.assignee.email})
							<br />
							📁 {task.project.name}
						</small>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TaskListPresenter;