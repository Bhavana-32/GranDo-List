
import React, { useState } from 'react';
import { Todo } from './types';
import Header from './components/Header';
import InputArea from './components/InputArea';
import TodoList from './components/TodoList';
import GrandmaWisdom from './components/GrandmaWisdom';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [grandmaMessage, setGrandmaMessage] = useState<string>('');
  
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    // First, trigger the exit animation
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, isDeleting: true } : todo
      )
    );
    // Then, remove the item from state after the animation completes
    setTimeout(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }, 500); // Should match the animation duration
  };

  // Sort todos: completed items go to the bottom, then sort by due date.
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const dateA = a.dueDate ? new Date(`${a.dueDate}T00:00:00`).getTime() : 0;
    const dateB = b.dueDate ? new Date(`${b.dueDate}T00:00:00`).getTime() : 0;
    
    // Group items with no due date at the bottom of their completion section
    if (dateA === 0 && dateB > 0) return 1;
    if (dateB === 0 && dateA > 0) return -1;

    return dateA - dateB;
  });

  return (
    <div className="min-h-screen font-sans p-4 sm:p-8 flex items-start justify-center">
      <div 
        className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-2xl"
      >
        {/* Notepad Binding */}
        <div className="h-8 bg-slate-800 shadow-inner"></div>
        <div className="bg-[var(--color-surface)]">
            <Header />
            <InputArea todos={todos} setTodos={setTodos} setGrandmaMessage={setGrandmaMessage} />
            <GrandmaWisdom key={grandmaMessage} message={grandmaMessage} />
            <TodoList todos={sortedTodos} setTodos={setTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
        </div>
      </div>
    </div>
  );
};

export default App;