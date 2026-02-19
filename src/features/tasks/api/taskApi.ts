import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task, NormalizedData } from "../types";
import { normalizeTasks } from "../utils"; 

export const tasksApi = createApi({
	reducerPath: "tasksApi",
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
	tagTypes: ["Task"],
	endpoints: (builder) => ({
		getTasks: builder.query<NormalizedData, void>({
			query: () => "/tasks",
			transformResponse: normalizeTasks,
			providesTags: ["Task"],
		}),

		updateTask: builder.mutation<Task, Partial<Task> & { id: number }>({
			query: ({ id, ...patch }) => ({
				url: `/tasks/${id}`,
				method: "PATCH",
				body: patch,
			}),
			invalidatesTags: ["Task"],
		}),
	}),
});

export const { useGetTasksQuery, useUpdateTaskMutation } = tasksApi;
