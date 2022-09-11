import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Todo } from "../types";
// const baseApiUrl = import.meta.env.VITE_REACT_APP_BASE_API
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_BASE_API,
  }),
  tagTypes: ["Todo"],

  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "/todos",
      transformResponse: (res: Todo[]): Todo[] =>
        res.sort((a, b) => b.id - a.id),
      // providesTags: ['Todos']
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Todo' as const, id })), 'Todo']
          : ['Todo'],

      // providesTags: (result = [], error, arg) => [
      //   "Todo",
      //   ...result.map(({ id }) => ({ type: "Todo", id })),
      // ],
    }),
    getTodo: builder.query<Todo[], void>({
      query: (id) => "/todos/" + id,
      // providesTags: ['Todos'],
      // keepUnusedDataFor:60*60*60
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Todo' as const, id })), 'Todo']
          : ['Todo'],
      
    }),
    addTodo: builder.mutation<Todo, Omit<Todo, 'id'>>({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
      // invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }],

      // Optimistic Update. Update todo in the interface before being sure it's updated on the server
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getTodos", undefined, (draft) => {
            // Updating draft data with new todo item
            draft.unshift({
              ...todo,
              // @ts-ignore: Type 'string' is not assignable to type 'number'.ts(2322)
              id: "temp" + Math.random(),
            });
          })
        );
        try {
          // await queryFulfilled
          const { data: addedTodo } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData("getTodos", undefined, (draft) => {
              // Updating draft data with new todo item
              draft[0] = {
                ...addedTodo,
              };
            })
          );
        } catch (error) {
          patchResult.undo();
        }
      },
    }),
    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PUT",
        body: todo,
      }),
      // invalidatesTags: (result, error, arg) => [{ type: 'Todo', id: arg.id }],
      // Optimistic Update. Update todo in the interface before being sure it's updated on the server
      async onQueryStarted(
        { content, isCompleted, id: todoId },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getTodos",
            undefined,
            (draft: Todo[]) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const todo: Todo | undefined = draft.find(
                (todo: Todo) => todo.id === todoId
              );
              if (todo !== undefined) {
                todo.content = content;
                todo.isCompleted = isCompleted;
              }
              // todo = {content, isCompleted}
              // if (todo) {
              //   todo.reactions[reaction]++
              // }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: id,
      }),
      // pessimistic update when don't wanna fetch all todos again

      // async onQueryStarted({ id:todoId }, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled
      //     const patchResult = dispatch(
      //       apiSlice.util.updateQueryData('getTodos', undefined, (draft) => {
      //         draft.splice(draft.findIndex((item)=>item.id === todoId),1)
      //       })
      //     )
      //   } catch {}
      // },
      invalidatesTags: ["Todo"],
      // invalidatesTags: (result, error, arg) => [{ type: "Todo", id: arg.id }],
    }),
  }),
});

export const { getTodos, getTodo, addTodo, updateTodo, deleteTodo } =
  apiSlice.endpoints;

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = apiSlice;
