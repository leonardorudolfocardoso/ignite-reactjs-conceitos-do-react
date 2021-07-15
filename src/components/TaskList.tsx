import { useState } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  function isValidId(id: number) {
    const idsAlreadyInUse = tasks.map(task => task.id)
    const idIsInUse = idsAlreadyInUse.includes(id)
    const idIsValid = !idIsInUse

    return idIsValid
  }

  function generateId(iteration = 0, maxIterations = 100): number {
    if (iteration === maxIterations) throw new Error("Max iterations achieved in generateId. ")

    const id = Math.round(Math.random() * 1000)
    return isValidId(id) ? id : generateId(iteration+1)
  }

  function titleIsEmpty() {
    return newTaskTitle.trim() === ''
  }

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (titleIsEmpty()) {

    } else {
      const newTaskId = generateId()
      
      setTasks([...tasks, {
        id: newTaskId,
        isComplete: false,
        title: newTaskTitle
      }])
    }
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    const taskToToggleIsComplete = tasks.find(task => task.id === id)

    if (taskToToggleIsComplete) {
      setTasks([...tasks.filter(task => task.id !== id), {...taskToToggleIsComplete, isComplete: !taskToToggleIsComplete.isComplete}])
    }
  }

  function handleRemoveTask(id: number) {
    // Remova uma task da listagem pelo ID
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Adicionar novo todo" 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff"/>
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input 
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16}/>
              </button>
            </li>
          ))}
          
        </ul>
      </main>
    </section>
  )
}