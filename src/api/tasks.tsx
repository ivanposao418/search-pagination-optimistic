export type Task = {
  id: number
  title: string
  completed: boolean
}

let TASKS: Task[] = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  title: `Task ${i + 1}`,
  completed: Math.random() > 0.5,
}))

const delay = (ms: number) =>
  new Promise(res => setTimeout(res, ms))

export async function fetchTasks(search: string, page: number) {
  await delay(600)

  const pageSize = 10

  const filtered = TASKS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    tasks: filtered.slice(start, end),
    totalPages: Math.ceil(filtered.length / pageSize),
  }
}

export async function toggleTask(id: number) {
  await delay(500)

  // simulate random failure
  if (Math.random() < 0.2) {
    throw new Error("Server failed")
  }

  TASKS = TASKS.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )

  return TASKS.find(t => t.id === id)!
}
