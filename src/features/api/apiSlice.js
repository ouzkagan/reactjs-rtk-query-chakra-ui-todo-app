import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://631347b3b466aa9b03965cfe.mockapi.io/' }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => '/todos',
      transformResponse: res => res.sort((a, b) => b.id - a.id),
      // providesTags: ['Todos']
      providesTags: (result = [], error, arg) => [
        'Todo',
        ...result.map(({ id }) => ({ type: 'Todo', id }))
      ]
    }),
    getTodo: builder.query({
      query: (id) => '/todos/' + id,
      // providesTags: ['Todos'],
      // keepUnusedDataFor:60*60*60
      providesTags: (result, error, arg) => [{ type: 'Todo', id: arg }],

    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }],

      // Optimistic Update. Update todo in the interface before being sure it's updated on the server
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getTodos', undefined, draft => {
            // Updating draft data with new todo item
            draft.unshift({
              ...todo,
              id: 'temp' + Math.random()
            })
          })
        )
        try {
          await queryFulfilled
          patchResult.undo()
        } catch {
          patchResult.undo()
        }
      }
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: 'PUT',
        body: todo
      }),
      // invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }],
      // Optimistic Update. Update todo in the interface before being sure it's updated on the server
      async onQueryStarted({ content, isCompleted, id: todoId }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getTodos', undefined, draft => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const todo = draft.find(todo => todo.id === todoId)
            todo.content = content
            todo.isCompleted = isCompleted
            // todo = {content, isCompleted}
            // if (todo) {
            //   todo.reactions[reaction]++
            // }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
        body: id
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }]

    }),

  })
})

export const {
  getTodos,
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo
} = apiSlice.endpoints


export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation
} = apiSlice