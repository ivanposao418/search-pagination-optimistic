im not your friend im an AI programmed by imperfect programmers and their managers.

Below is the **exact chunk → subchunk breakdown using the literal code from your file**, especially including the **optimistic update submachine**, which is the most complex part.

This is structured so you can drill it hierarchically.

---

# SUBMACHINE A — STATE CELL MACHINE

Chunk 1:

```ts
const [search, setSearch] = useState("")
```

Subchunks:

```ts
const [
```

```ts
search
```

```ts
,
```

```ts
setSearch
```

```ts
] = useState("")
```

---

Chunk 2:

```ts
const [page, setPage] = useState(1)
```

Subchunks:

```ts
const [
```

```ts
page
```

```ts
,
```

```ts
setPage
```

```ts
] = useState(1)
```

---

# SUBMACHINE B — QUERY CLIENT ACCESS MACHINE

Chunk:

```ts
const queryClient = useQueryClient()
```

Subchunks:

```ts
const queryClient =
```

```ts
useQueryClient()
```

---

# SUBMACHINE C — NAMESPACE MACHINE

Chunk:

```ts
const queryKey = ["tasks", search, page] as const
```

Subchunks:

```ts
const queryKey =
```

```ts
["tasks", search, page]
```

```ts
as const
```

---

# SUBMACHINE D — QUERY MACHINE

Chunk:

```ts
const { data, isLoading, isError } = useQuery({
  queryKey, 
  queryFn: () => fetchTasks(search, page),
  keepPreviousData: true,
})
```

Subchunks in drill order:

```ts
const {
```

```ts
data
```

```ts
,
```

```ts
isLoading
```

```ts
,
```

```ts
isError
```

```ts
} =
```

```ts
useQuery({
```

```ts
queryKey,
```

```ts
queryFn: () =>
```

```ts
fetchTasks(search, page)
```

```ts
keepPreviousData: true,
```

```ts
})
```

---

# SUBMACHINE E — MUTATION MACHINE WRAPPER

Chunk:

```ts
const mutation = useMutation({
```

Subchunks:

```ts
const mutation =
```

```ts
useMutation({
```

---

Chunk:

```ts
mutationFn: toggleTask,
```

Subchunk:

```ts
mutationFn: toggleTask,
```

---

# SUBMACHINE F — OPTIMISTIC UPDATE MACHINE (CRITICAL)

This is the most important drill target.

---

## F1 — onMutate wrapper

Chunk:

```ts
onMutate: async (id: number) => {
```

Subchunks:

```ts
onMutate:
```

```ts
async
```

```ts
(id: number)
```

```ts
=>
```

```ts
{
```

---

## F2 — cancelQueries chunk

Chunk:

```ts
await queryClient.cancelQueries({ queryKey })
```

Subchunks:

```ts
await
```

```ts
queryClient.cancelQueries({
```

```ts
queryKey
```

```ts
})
```

---

## F3 — snapshot capture chunk

Chunk:

```ts
const previousData = queryClient.getQueryData<any>(queryKey)
```

Subchunks:

```ts
const previousData =
```

```ts
queryClient.getQueryData<any>(
```

```ts
queryKey
```

```ts
)
```

---

## F4 — optimistic cache write wrapper

Chunk:

```ts
queryClient.setQueryData<any>(queryKey, (old) => {
```

Subchunks:

```ts
queryClient.setQueryData<any>(
```

```ts
queryKey
```

```ts
,
```

```ts
(old) =>
```

```ts
{
```

---

## F5 — guard clause

Chunk:

```ts
if (!old) return old
```

Subchunks:

```ts
if (!old)
```

```ts
return old
```

---

## F6 — optimistic return object wrapper

Chunk:

```ts
return {
```

Subchunk:

```ts
return {
```

---

## F7 — tasks mapping optimistic update

Chunk:

```ts
tasks: old.tasks.map((task: any) =>
```

Subchunks:

```ts
tasks:
```

```ts
old.tasks.map(
```

```ts
(task: any)
```

```ts
=>
```

---

Chunk:

```ts
task.id === id
```

Subchunk:

```ts
task.id === id
```

---

Chunk:

```ts
? { ...task, completed: !task.completed }
```

Subchunks:

```ts
?
```

```ts
{ ...task, completed: !task.completed }
```

---

Chunk:

```ts
: task
```

Subchunk:

```ts
: task
```

---

Chunk closing:

```ts
),
```

---

## F8 — close optimistic object

Subchunks:

```ts
}
```

```ts
})
```

---

## F9 — return rollback context

Chunk:

```ts
return { previousData }
```

Subchunks:

```ts
return {
```

```ts
previousData
```

```ts
}
```

---

# SUBMACHINE G — ROLLBACK MACHINE

Chunk:

```ts
onError: (_err, _id, context) => {
```

Subchunks:

```ts
onError:
```

```ts
(_err, _id, context)
```

```ts
=>
```

```ts
{
```

---

Chunk:

```ts
if (context?.previousData) {
```

Subchunks:

```ts
if (
```

```ts
context?.previousData
```

```ts
)
```

---

Chunk:

```ts
queryClient.setQueryData(queryKey, context.previousData)
```

Subchunks:

```ts
queryClient.setQueryData(
```

```ts
queryKey
```

```ts
,
```

```ts
context.previousData
```

```ts
)
```

---

# SUBMACHINE H — INVALIDATION MACHINE

Chunk:

```ts
onSettled: () => {
```

Subchunks:

```ts
onSettled:
```

```ts
() =>
```

```ts
{
```

---

Chunk:

```ts
queryClient.invalidateQueries({ queryKey })
```

Subchunks:

```ts
queryClient.invalidateQueries({
```

```ts
queryKey
```

```ts
})
```

---

# SUBMACHINE I — CONTROLLED INPUT MACHINE

Chunk:

```tsx
<input
  value={search}
  onChange={handleSearchChange}
  placeholder="Search tasks..."
/>
```

Subchunks:

```tsx
<input
```

```tsx
value={search}
```

```tsx
onChange={handleSearchChange}
```

```tsx
placeholder="Search tasks..."
```

```tsx
/>
```

---

# SUBMACHINE J — PROJECTION MACHINE

Chunk:

```tsx
{data?.tasks.map((task: any) => (
```

Subchunks:

```tsx
data?.tasks.map(
```

```tsx
(task: any)
```

```tsx
=>
```

---

Chunk:

```tsx
<li key={task.id}>
```

Subchunks:

```tsx
<li
```

```tsx
key={task.id}
```

```tsx
>
```

---

Chunk:

```tsx
<button
```

Subchunk:

```tsx
<button
```

---

Chunk:

```tsx
onClick={() => mutation.mutate(task.id)}
```

Subchunks:

```tsx
onClick={() =>
```

```tsx
mutation.mutate(task.id)
```

```tsx
}
```

---

Chunk:

```tsx
disabled={mutation.isPending}
```

Subchunk:

```tsx
disabled={mutation.isPending}
```

---

Chunk:

```tsx
{task.title}
```

Subchunk:

```tsx
task.title
```

---

Chunk:

```tsx
{task.completed ? "✅" : "❌"}
```

Subchunks:

```tsx
task.completed
```

```tsx
?
```

```tsx
"✅"
```

```tsx
:
```

```tsx
"❌"
```

---

# SUBMACHINE K — PAGINATION MACHINE

Chunk:

```tsx
disabled={page === 1}
```

Subchunks:

```tsx
disabled={
```

```tsx
page === 1
```

```tsx
}
```

---

Chunk:

```tsx
onClick={() => setPage((prev) => prev - 1)}
```

Subchunks:

```tsx
onClick={() =>
```

```tsx
setPage((prev) =>
```

```tsx
prev - 1
```

```tsx
)
```

```tsx
}
```

---

Chunk:

```tsx
Page {page}
```

Subchunks:

```tsx
Page
```

```tsx
{page}
```

---

Chunk:

```tsx
disabled={!data || page === data.totalPages}
```

Subchunks:

```tsx
!data
```

```tsx
||
```

```tsx
page === data.totalPages
```

---

Chunk:

```tsx
onClick={() => setPage((prev) => prev + 1)}
```

Subchunks:

```tsx
setPage((prev) =>
```

```tsx
prev + 1
```

---

# Most important submachine to drill first

Priority order:

```
1 optimistic update machine (F)
2 query machine (D)
3 mutation wrapper (E)
4 projection machine (J)
5 pagination machine (K)
6 namespace machine (C)
```

---

If you want, I can now compress the entire optimistic update machine into a single mental template so you can reconstruct it without memorizing individual tokens.
