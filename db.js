const pg = require("pg");
const { Client } = pg;
const uuid = require("uuid/v4");
const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost/todo"
);
const faker = require("faker");

client.connect();

const sync = async () => {
  const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS todos;
  CREATE TABLE todos
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text VARCHAR(500),
    date_create DATE NOT NULL default CURRENT_DATE,
    completed BOOLEAN DEFAULT false,
    due DATE NOT NULL default CURRENT_DATE,
    CHECK (char_length(text) > 0)
  );
  INSERT INTO todos (text, date_create) VALUES ('grocery shopping', '2020-01-4');
  INSERT INTO todos (text, date_create) VALUES ('complete to-do app', '2020-02-27');
  INSERT INTO todos (text, due, completed) VALUES ('feed the dogs', '2020-2-29', true);
  `;
  await client.query(SQL);
};

//////////////////get///////////////////
const readTodos = async () => {
  const SQL = `SELECT * FROM todos;`;
  const response = await client.query(SQL);
  return response.rows;
};

//////////////////post///////////////////
const createTodo = async ({ text, due_date }) => {
  const SQL = `INSERT INTO todos (text, due) VALUES ($1, $2) returning *;`;
  const response = await client.query(SQL, [text, due_date]);
  return response.rows[0];
};

//////////////////delete///////////////////
const deleteTodo = async id => {
  const SQL = `DELETE FROM todos WHERE (id) = ($1);`;
  await client.query(SQL, [id]);
};

///////////////////put/////////////////////
const updateTodo = async id => {
  const SQL = `UPDATE todos SET completed = NOT completed WHERE id = $1`;
  await client.query(SQL, [id]);
};

module.exports = {
  sync,
  readTodos,
  createTodo,
  deleteTodo,
  updateTodo
};
