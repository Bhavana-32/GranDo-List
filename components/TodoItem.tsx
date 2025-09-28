
import React from 'react';
import { Todo } from '../types';
import { DragHandleIcon, TrashIcon } from './Icons';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, toggleTodo, deleteTodo }) => {
  const containerClasses = `
    flex items-center w-full min-h-[var(--line-height-paper)]
    ${todo.isDeleting ? 'animate-fadeOutAndSlide' : 'animate-fadeInUp'}
  `;

  return (
    <div className={containerClasses}>
      <div className="cursor-grab group -ml-1">
        <DragHandleIcon />
      </div>
      <div className="flex-shrink-0 mx-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="appearance-none h-6 w-6 border-2 border-gray-400 rounded-sm bg-transparent checked:bg-[var(--color-primary)] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-primary)] cursor-pointer relative"
          style={{ backgroundImage: todo.completed ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` : 'none' }}
        />
      </div>
      <div className="flex-grow relative">
        <p className={`font-handwritten text-2xl text-[var(--color-text-base)] transition-all ${todo.completed ? 'text-[var(--color-text-muted)] line-through' : ''}`}>
          {todo.text}
        </p>
      </div>
      <div className="ml-4 pl-2 flex-shrink-0">
         <button 
           onClick={() => deleteTodo(todo.id)}
           className="text-gray-400 hover:text-[var(--color-accent-red)] transition-colors duration-200"
           aria-label="Delete todo"
          >
            <TrashIcon />
         </button>
      </div>
    </div>
  );
};

export default TodoItem;
