import React, { useState, useEffect } from "react";
import axios from "axios";

const List = ({ toggle, todos, destroy }) => {
  return (
    <div id="paper">
      <div id="pattern">
        <ul id="content">
          {todos.map(todo => {
            return (
              <li className={todo.completed ? "archived" : ""} key={todo.id}>
                <span onClick={() => toggle(todo.id)}>
                  {todo.text} ------> due on: {todo.due.substr(0, 10)}
                </span>
                <button onClick={() => destroy(todo.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [due_date, setDate] = useState("");

  useEffect(() => {
    axios
      .get("/api/todos")
      .then(response => setTodos(response.data))
      .catch(ex => console.log(ex.response.data));
  }, []);

  const create = ev => {
    ev.preventDefault();
    axios
      .post("/api/todos", { text, due_date })
      .then(response => setTodos([response.data, ...todos]));
  };

  const destroy = id => {
    axios
      .delete(`/api/todos/${id}`)
      .then(response => response.data)
      .then(() => {
        setTodos(todos.filter(n => n.id !== id));
      });
  };

  const toggle = id => {
    axios
      .put(`/api/todos/${id}`)
      .then(response => response.data)
      .then(() =>
        axios.get("/api/todos").then(response => setTodos(response.data))
      );
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div>
        <div className="form">
          <form onSubmit={create}>
            <input
              type="text"
              value={text}
              placeholder="type in new task here"
              onChange={ev => setText(ev.target.value)}
            />
            <input
              type="date"
              defaultValue="2020-02-29"
              onChange={ev => {
                //console.log(ev.target.value);
                setDate(ev.target.value);
              }}
            />
            <button className="button" disabled={!text}>
              Create
            </button>
          </form>
        </div>
      </div>
      <div>
        <List toggle={toggle} todos={todos} destroy={destroy} />
      </div>
    </div>
  );
};

export default App;
