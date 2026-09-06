export type Todo = {
  id: string
  title: string
  detalhe: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export function useTodos() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const todos = useState<Todo[]>('todos', () => [])
  const loading = useState('todos-loading', () => false)
  const error = useState<string | null>('todos-error', () => null)

  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      todos.value = await $fetch<Todo[]>(`${apiBase}/todos`)
    } catch (e) {
      error.value = 'Não foi possível carregar as tarefas.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function createTodo(title: string, detalhe?: string) {
    error.value = null
    try {
      const body: { title: string; detalhe?: string } = { title }
      const trimmed = detalhe?.trim()
      if (trimmed) body.detalhe = trimmed

      const created = await $fetch<Todo>(`${apiBase}/todos`, {
        method: 'POST',
        body,
      })
      todos.value = [created, ...todos.value]
    } catch (e) {
      error.value = 'Não foi possível criar a tarefa.'
      console.error(e)
      throw e
    }
  }

  async function updateTodo(
    id: string,
    payload: { title?: string; detalhe?: string | null; completed?: boolean },
  ) {
    error.value = null
    try {
      const updated = await $fetch<Todo>(`${apiBase}/todos/${id}`, {
        method: 'PATCH',
        body: payload,
      })
      todos.value = todos.value.map((t) => (t.id === id ? updated : t))
    } catch (e) {
      error.value = 'Não foi possível atualizar a tarefa.'
      console.error(e)
      throw e
    }
  }

  async function removeTodo(id: string) {
    error.value = null
    try {
      await $fetch(`${apiBase}/todos/${id}`, { method: 'DELETE' })
      todos.value = todos.value.filter((t) => t.id !== id)
    } catch (e) {
      error.value = 'Não foi possível excluir a tarefa.'
      console.error(e)
      throw e
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    removeTodo,
  }
}
