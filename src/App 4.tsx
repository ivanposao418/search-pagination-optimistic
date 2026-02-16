import { useState } from "react";
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { fetchTasks, toggleTask } from "./api/tasks";

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
    
        return { previousData }
    },
    
    onError: (_err, _id, context) => {
        // CRUCIAL: restore snapshot back into the same cache entry you patched.
        if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
        }
    },
    
    onSettled: () => { 
        queryClient.invalidateQueries({ queryKey })
    },
    })
     
    const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
    ) => {
    setPage(1)
    setSearch(e.target.value)
    }
 
 
}

// useQuery destructures into data, loading, error objects

// useMutation destructures into mutation object
    // cancelQuery
    // patch ui with current immediately rerenders 
    // onError if server returns error 
    // onSettled if server returns good 

// Dumb ui 
    // ul , data, maps tasks 
        // button for toggle with mutation object mutation.mutate()
    // pagination with disables 
