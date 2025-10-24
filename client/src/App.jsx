import { useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const addTask = () => {
    if (!newTitle) return;
    setTasks([...tasks, { title: newTitle, completed: false }]);
    setNewTitle("");
  };

  const toggleCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input 
        type="text" 
        value={newTitle} 
        onChange={(e) => setNewTitle(e.target.value)} 
        placeholder="New Task"
      />
      <button onClick={addTask}>Add Task</button>

      <div style={{display: "flex", flexDirection: "column-reverse"}}>
      {tasks.map((task, index) => (
        <div key={index} style={{ margin: "10px 0" }}>
          <h3 style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.title}
          </h3>
          <label>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleCompleted(index)} 
            /> Completed
          </label>
          <button onClick={() => deleteTask(index)}>Delete</button>
        </div>
      ))}
      </div>
    </div>
  );
}
