import React, { useState } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { fetchTasks, toggleTask } from "./api/tasks"

export default function App() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const queryClient = useQueryClient()
  const queryKey = ["tasks", search, page] as const

  const { data, isLoading, isError } = useQuery({
    queryKey, 
    queryFn: () => fetchTasks(search, page),
    keepPreviousData: true,
  })

  const mutation = useMutation({
    mutationFn: toggleTask,

    // =========================
    // OPTIMISTIC UPDATE (core)
    // =========================
    onMutate: async (id: number) => { 
      await queryClient.cancelQueries({ queryKey })
 
      const previousData = queryClient.getQueryData<any>(queryKey)

      queryClient.setQueryData<any>(queryKey, (old) => {
        if (!old) return old
 
        return {
          ...old,
          tasks: old.tasks.map((task: any) =>
            task.id === id
              ? { ...task, completed: !task.completed }
              : task
          ),
        }
      })

      // 4) return context so onError can rollback
      return { previousData }
    },
 
    // ROLLBACK (if server fails) 
    onError: (_err, _id, context) => {
      // CRUCIAL: restore snapshot back into the same cache entry you patched.
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
 
    onSettled: () => {
      // CRUCIAL: server is final authority.
      // We refetch to ensure cache matches server (even if optimistic patch was “wrong”).
      // Using queryKey refetches the current (search,page) entry.
      queryClient.invalidateQueries({ queryKey })
    },
  })

  // CRUCIAL: search changes can make the current page invalid.
  // Example: page=5 exists for empty search, but for "react" there may be only 1 page.
  // Reset page to 1 before setting new search to keep state consistent.
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPage(1)
    setSearch(e.target.value)
  }





 
  return (
    <div style={{ padding: 20 }}>
      <h2>Task Board</h2>

      {/* Controlled input: UI state drives value */}
      <input
        value={search}
        onChange={handleSearchChange}
        placeholder="Search tasks..."
      />

      {/* UI gates: show status from query */}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading tasks</p>}

      <ul>
        {data?.tasks.map((task: any) => (
          <li key={task.id}>
            {/* CRUCIAL: disable while pending to prevent double-click races */}
            <button
              onClick={() => mutation.mutate(task.id)}
              disabled={mutation.isPending}
            >
              {task.title} {task.completed ? "✅" : "❌"}
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination is local UI state that changes queryKey → switches cache entry */}
      <div style={{ marginTop: 20 }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page}
        </span>

        <button
          disabled={!data || page === data.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}