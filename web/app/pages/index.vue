<template>
  <div class="page">
    <header class="header">
      <h1>To-do</h1>
      <p>Lista simples compartilhada</p>
    </header>

    <form class="composer" @submit.prevent="onCreate">
      <div class="composer-fields">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Nova tarefa..."
          maxlength="255"
          :disabled="saving"
          required
        />
        <textarea
          v-model="newDetalhe"
          placeholder="Detalhes (opcional)..."
          rows="2"
          :disabled="saving"
        />
      </div>
      <button type="submit" :disabled="saving || !newTitle.trim()">
        Adicionar
      </button>
    </form>

    <p v-if="error" class="banner error" role="alert">{{ error }}</p>
    <p v-else-if="loading && !todos.length" class="banner">Carregando...</p>

    <ul class="list">
      <li v-for="todo in todos" :key="todo.id" class="item">
        <input
          type="checkbox"
          :checked="todo.completed"
          :aria-label="`Concluir ${todo.title}`"
          @change="onToggle(todo)"
        />

        <div v-if="editingId === todo.id" class="edit-fields">
          <input
            v-model="editingTitle"
            class="edit-input"
            maxlength="255"
            placeholder="Título"
            @keydown.enter.prevent="onSaveEdit(todo.id)"
            @keydown.escape.prevent="cancelEdit"
          />
          <textarea
            v-model="editingDetalhe"
            class="edit-input"
            rows="2"
            placeholder="Detalhes (opcional)..."
            @keydown.escape.prevent="cancelEdit"
          />
        </div>
        <div v-else class="content" @dblclick="startEdit(todo)">
          <span class="title" :class="{ done: todo.completed }">
            {{ todo.title }}
          </span>
          <p v-if="todo.detalhe" class="detalhe" :class="{ done: todo.completed }">
            {{ todo.detalhe }}
          </p>
        </div>

        <div class="actions">
          <button
            v-if="editingId === todo.id"
            type="button"
            class="ghost"
            @click="onSaveEdit(todo.id)"
          >
            Salvar
          </button>
          <button
            v-else
            type="button"
            class="ghost"
            @click="startEdit(todo)"
          >
            Editar
          </button>
          <button type="button" class="danger" @click="onRemove(todo.id)">
            Excluir
          </button>
        </div>
      </li>
    </ul>

    <p v-if="!loading && !todos.length && !error" class="empty">
      Nenhuma tarefa ainda. Adicione a primeira acima.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '~/composables/useTodos'

const {
  todos,
  loading,
  error,
  fetchTodos,
  createTodo,
  updateTodo,
  removeTodo,
} = useTodos()

const newTitle = ref('')
const newDetalhe = ref('')
const saving = ref(false)
const editingId = ref<string | null>(null)
const editingTitle = ref('')
const editingDetalhe = ref('')

onMounted(() => {
  fetchTodos()
})

async function onCreate() {
  const title = newTitle.value.trim()
  if (!title) return
  saving.value = true
  try {
    await createTodo(title, newDetalhe.value)
    newTitle.value = ''
    newDetalhe.value = ''
  } finally {
    saving.value = false
  }
}

async function onToggle(todo: Todo) {
  await updateTodo(todo.id, { completed: !todo.completed })
}

function startEdit(todo: Todo) {
  editingId.value = todo.id
  editingTitle.value = todo.title
  editingDetalhe.value = todo.detalhe ?? ''
}

function cancelEdit() {
  editingId.value = null
  editingTitle.value = ''
  editingDetalhe.value = ''
}

async function onSaveEdit(id: string) {
  const title = editingTitle.value.trim()
  if (!title) return
  const detalhe = editingDetalhe.value.trim() || null
  await updateTodo(id, { title, detalhe })
  cancelEdit()
}

async function onRemove(id: string) {
  await removeTodo(id)
  if (editingId.value === id) cancelEdit()
}
</script>

<style scoped>
.page {
  width: min(680px, calc(100% - 2rem));
  margin: 3rem auto 4rem;
}

.header h1 {
  margin: 0;
  font-size: 2.4rem;
  letter-spacing: -0.03em;
}

.header p {
  margin: 0.35rem 0 1.75rem;
  color: var(--muted);
}

.composer {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.composer-fields {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 0.5rem;
}

.composer input,
.composer textarea,
.edit-input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  background: #fff;
  font: inherit;
  resize: vertical;
}

.composer button,
.actions button {
  border: 0;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.composer button {
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  align-self: stretch;
}

.composer button:hover:not(:disabled) {
  background: var(--accent-hover);
}

.composer button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.banner {
  margin: 1rem 0 0;
  color: var(--muted);
}

.banner.error {
  color: var(--danger);
}

.list {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}

.item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.item > input[type='checkbox'] {
  margin-top: 0.35rem;
}

.content,
.edit-fields {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
}

.title {
  word-break: break-word;
}

.detalhe {
  margin: 0;
  font-size: 0.92rem;
  color: var(--muted);
  white-space: pre-wrap;
  word-break: break-word;
}

.title.done,
.detalhe.done {
  color: var(--done);
  text-decoration: line-through;
}

.edit-input {
  border-radius: 8px;
  padding: 0.45rem 0.6rem;
}

.actions {
  display: flex;
  gap: 0.4rem;
}

.ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--border) !important;
}

.danger {
  background: transparent;
  color: var(--danger);
  border: 1px solid color-mix(in srgb, var(--danger) 35%, white) !important;
}

.empty {
  margin-top: 2rem;
  text-align: center;
  color: var(--muted);
}

@media (max-width: 560px) {
  .composer {
    flex-direction: column;
  }

  .composer button {
    align-self: stretch;
  }

  .item {
    grid-template-columns: auto 1fr;
  }

  .actions {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
