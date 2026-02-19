import { useGetTasksQuery } from '../api/taskApi';

function TaskCounter() {
  console.log('🔵 TaskCounter RENDER');
  
  const { data } = useGetTasksQuery();
  
  if (!data) return <div>Ładowanie...</div>;

  const tasksArray = Object.values(data.tasks);

  
  const completedCount = tasksArray.filter((t) => t.completed).length;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Statystyki</h2>
      <p>Wszystkich tasków: {tasksArray.length}</p>
      <p>Ukończonych: {completedCount}</p>
      <p>Do zrobienia: {tasksArray.length - completedCount}</p>
    </div>
  );
}

export default TaskCounter;