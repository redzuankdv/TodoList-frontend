import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const apiUrl = 'http://localhost:5026/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    setTitle('');
    setDescription('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const saveEdit = async (id) => {
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, description: editDescription })
    });

    setEditId(null);
    fetchTodos();
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">📝 To-do List</h2>

      <div className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTodo}>Add Todo</button>
      </div>

      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo.id} className="list-group-item">
            {editId === todo.id ? (
              <div>
                <input
                  className="form-control mb-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button className="btn btn-sm btn-success me-2" onClick={() => saveEdit(todo.id)}>Save</button>
                <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{todo.title}</h5>
                  <p className="mb-1">{todo.description}</p>
                </div>
                <div>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(todo)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;