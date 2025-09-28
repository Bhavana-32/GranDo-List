import React, { useState, useRef } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, setTodos, toggleTodo, deleteTodo }) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDrop = () => {
    if (draggedItemIndex === null || dragOverItemIndex.current === null || draggedItemIndex === dragOverItemIndex.current) {
        setDraggedItemIndex(null);
        return;
    }
    
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(draggedItemIndex, 1);
    items.splice(dragOverItemIndex.current, 0, reorderedItem);
    
    setTodos(items);
    setDraggedItemIndex(null);
    dragOverItemIndex.current = null;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  const paperStyles: React.CSSProperties = {
      backgroundImage: 'repeating-linear-gradient(var(--color-surface) 0, var(--color-surface) calc(var(--line-height-paper) - 1px), #d1d5db 1px, #d1d5db var(--line-height-paper))',
      lineHeight: 'var(--line-height-paper)',
      backgroundSize: '100% var(--line-height-paper)',
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <span className="text-5xl font-handwritten">📝</span>
        <p className="text-[var(--color-text-muted)] text-lg mt-4">This page is blank.</p>
        <p className="text-[var(--color-text-muted)]">Time to write down what Grandma needs to nag you about!</p>
      </div>
    );
  }
  
  return (
    <div className="px-8 pb-8 relative" onDragOver={handleDragOver}>
        {/* Red Margin Line */}
        <div className="absolute top-0 left-12 bottom-0 w-px bg-[var(--color-accent-red)] opacity-50"></div>
        
        <div style={paperStyles} className="pl-6">
            {todos.map((todo, index) => (
                <div
                    key={todo.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDrop}
                    className={`transition-transform duration-300 ${draggedItemIndex === index ? 'opacity-50 scale-105 bg-yellow-100/50' : ''}`}
                >
                    <TodoItem todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
                </div>
            ))}
        </div>
    </div>
  );
};

export default TodoList;