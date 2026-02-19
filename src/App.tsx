
import { TaskList, TaskCounter, TaskToggle } from "./features/tasks";

function App() {
	return (
		<div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
			<h1>Task Manager</h1>

			<TaskToggle />
			<TaskList />
			<TaskCounter />
		</div>
	);
}

export default App;
