import { computed, ref } from 'vue';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
const todos = ref<Todo[]>([]);

export const useTodoStore = () => {
  const activeTodos = computed(() =>
    todos.value.filter((todo) => !todo.completed)
  );
  const completedTodos = computed(() =>
    todos.value.filter((todo) => todo.completed)
  );

  const addTodo = (text: string) => {
    if (text.trim()) {
      todos.value.push({
        id: Date.now(),
        text: text.trim(),
        completed: false,
      });
    }
  };

  const toggleTodo = (todo: Todo) => {
    todo.completed = !todo.completed;
  };

  const removeTodo = (id: number) => {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  };

  return {
    todos,
    activeTodos,
    completedTodos,
    addTodo,
    toggleTodo,
    removeTodo,
  };
};
