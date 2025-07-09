import React, { useState, useEffect } from "react";

const USERNAME = "sasha";
const API_USER_URL = `https://playground.4geeks.com/todo/users/${USERNAME}`; // Para traer las tareas (GET)
const API_TODO_URL = `https://playground.4geeks.com/todo/todos/${USERNAME}`; // Para añadir tareas (POST)

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar tareas al iniciar
  useEffect(() => {
    getTodos();
  }, []);

  // 2. Traer tareas de la API
  const getTodos = () => {
    setLoading(true);
    fetch(API_USER_URL)
      .then((res) => res.json())
      .then((data) => {
        setTodos(Array.isArray(data.todos) ? data.todos : []);
        setLoading(false);
      })
      .catch(() => {
        setTodos([]);
        setLoading(false);
      });
  };

  // 3. Añadir tarea (POST)
  const addTodo = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const task = { label: inputValue.trim(), done: false };
      setLoading(true);
      fetch(API_TODO_URL, {
        method: "POST",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then(() => {
          setInputValue("");
          getTodos();
        })
        .catch(() => setLoading(false));
    }
  };

  // 4. Eliminar tarea (DELETE con id)
  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setLoading(true);
    fetch(API_TODO_URL, {
      method: "PUT",
      body: JSON.stringify(newTodos),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar tarea");
        getTodos();
      })
      .catch(() => setLoading(false));
  };

  // 5. Limpiar todas las tareas (DELETE masivo)
  const clearTodos = () => {
    setLoading(true);
    fetch(API_TODO_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        setTodos([]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="background">
      <h1 className="title">todos</h1>
      <div className="todo-container">
        <ul>
          <li>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={addTodo}
              placeholder="What needs to be done?"
              autoFocus
              disabled={loading}
            />
          </li>
          {loading ? (
            <li className="no-tasks">Cargando...</li>
          ) : todos.length === 0 ? (
            <li className="no-tasks">No hay tareas, añadir tareas</li>
          ) : (
            todos.map((item, index) => (
              <li key={item.id || index} className="todo-item">
                {item.label}
                <span className="trash" onClick={() => removeTodo(item.id)}>
                  <i className="fas fa-trash-alt"></i>
                </span>
              </li>
            ))
          )}
        </ul>
        <div className="task-counter">
          {todos.length} {todos.length === 1 ? "item" : "items"} left
        </div>
        <button
          className="clear-btn"
          onClick={clearTodos}
          disabled={loading || todos.length === 0}
        >
          Limpiar todas las tareas
        </button>
      </div>
    </div>
  );
};

export default Home;
