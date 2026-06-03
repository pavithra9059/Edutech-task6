import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://jsonplaceholder.typicode.com/todos";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("");

  // Load from localStorage or API
  useEffect(() => {
    const saved = localStorage.getItem("tasks");

    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      loadTasks();
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // GET
  const loadTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data.slice(0, 6));
      setStatus("Tasks loaded");
    } catch {
      setStatus("Error loading tasks");
    }
  };

  // ADD
  const addTask = () => {
    if (!text) return;

    const newTask = {
      id: Date.now(),
      title: text,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setText("");
    setStatus("Task added");
  };

  // DELETE
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setStatus("Task deleted");
  };

  // EDIT
  const editTask = (task) => {
    setText(task.title);
    setEditId(task.id);
  };

  // UPDATE
  const updateTask = () => {
    setTasks(
      tasks.map((t) =>
        t.id === editId ? { ...t, title: text } : t
      )
    );

    setText("");
    setEditId(null);
    setStatus("Task updated");
  };

  return (
    <div className="container">
      <h1>TaskFlow Pro</h1>

      <div className="inputBox">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task"
        />

        {editId ? (
          <button onClick={updateTask}>Update</button>
        ) : (
          <button onClick={addTask}>Add</button>
        )}

        <button onClick={loadTasks}>Reload</button>
      </div>

      <p>{status}</p>

      <div className="grid">
        {tasks.map((t) => (
          <div key={t.id} className="card">
            <h3>{t.title}</h3>

            <button onClick={() => editTask(t)}>Edit</button>
            <button
              onClick={() => deleteTask(t.id)}
              style={{ background: "red", marginLeft: "5px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
