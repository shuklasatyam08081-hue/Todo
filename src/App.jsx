import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (event) => {
    event.preventDefault()
    const trimmedTask = task.trim()
    if (!trimmedTask) return
    setTodos([{ id: Date.now(), text: trimmedTask, done: false }, ...todos])
    setTask('')
  }

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done
    if (filter === 'completed') return todo.done
    return true // 'all'
  })

  // Counts for badges
  const allCount = todos.length
  const activeCount = todos.filter((todo) => !todo.done).length
  const completedCount = todos.filter((todo) => todo.done).length

  return (
    <div className="todo-card">
      <h1>Todo App</h1>
      <form className="todo-input-wrap" onSubmit={addTodo}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Naya task likho..."
        />
        <button type="submit">Add</button>
      </form>

      {/* Filter buttons with counts */}
      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All <span className="count">{allCount}</span>
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active <span className="count">{activeCount}</span>
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed <span className="count">{completedCount}</span>
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty">
            {filter === 'all' ? 'Koi task nahi hai, add karo!' :
             filter === 'active' ? 'Koi active task nahi hai!' :
             'Koi completed task nahi hai!'}
          </li>
        ) : (
          filteredTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.done ? 'completed' : ''}`}>
              <span
                className="task-toggle"
                onClick={() => toggleTodo(todo.id)}
                role="button"
                aria-label="Toggle task status"
              >
                {todo.done ? '☑' : '☐'}
              </span>
              <span className="task-text">{todo.text}</span>
              <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default App
