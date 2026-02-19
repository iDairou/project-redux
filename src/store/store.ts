import { configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "../features/tasks";

export const store = configureStore({
	reducer: {
		[tasksApi.reducerPath]: tasksApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(tasksApi.middleware),
});
