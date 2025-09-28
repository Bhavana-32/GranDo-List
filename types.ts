
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  isDeleting?: boolean;
}

export type InputMethod = 'text' | 'voice' | 'image';