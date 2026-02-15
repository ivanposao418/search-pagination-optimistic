import React, { useState } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { fetchTasks, toggleTask } from "./api/tasks"

export default function App() {
  // LOCAL UI STATE:
  // These are not server data. They are "selectors" that decide WHICH cache entry we are looking at.
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const queryClient = useQueryClient()

  // CRUCIAL: cache identity (namespace)
  // Every unique (search,page) pair becomes a different cache entry.
  // This is why search/pagination "just works": you’re switching cache addresses.
  const queryKey = ["tasks", search, page] as const

  const { data, isLoading, isError } = useQuery({
    queryKey,
    // CRUCIAL: queryFn must match the queryKey dimensions.
    // If the key includes (search,page), the fetch should use (search,page).
    queryFn: () => fetchTasks(search, page),

    // CRUCIAL: when page/search changes, TanStack starts fetching the NEW key.
    // keepPreviousData keeps OLD data visible while the new request is in-flight,
    // preventing UI flicker/empty list.
    keepPreviousData: true,
  })

  const mutation = useMutation({
    mutationFn: toggleTask,

    // =========================
    // OPTIMISTIC UPDATE (core)
    // =========================
    onMutate: async (id: number) => {
      // 1) CRUCIAL: stop any in-flight fetch for THIS SAME key
      // so it can’t race in and overwrite your optimistic patch.
      await queryClient.cancelQueries({ queryKey })

      // 2) CRUCIAL: snapshot the exact previous cache value for rollback.
      // Rollback only works if you restore EXACTLY what was there.
      const previousData = queryClient.getQueryData<any>(queryKey)

      // 3) CRUCIAL: patch the cache immediately (UI updates instantly because UI reads cache).
      queryClient.setQueryData<any>(queryKey, (old) => {
        if (!old) return old

        // IMPORTANT: you’re not updating the server here.
        // You’re updating the CACHE copy for the current (search,page) view.
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

    // =========================
    // ROLLBACK (if server fails)
    // =========================
    onError: (_err, _id, context) => {
      // CRUCIAL: restore snapshot back into the same cache entry you patched.
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },

    // =========================
    // RECONCILE (server truth)
    // =========================
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
