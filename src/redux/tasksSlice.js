import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { server } from "../axios_config";

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (props, thunkAPI) => {
        try {
            const res = await server.get("tasks");
            return res?.data
        } catch (error) {
            console.log(error)
        }
    },
)

export const addTasks = createAsyncThunk(
    'tasks/addTasks',
    async (data, thunkAPI) => {
        try {
            const res = await server.post("tasks", data);
            return res?.data
        } catch (error) {
            console.log(error)
        }
    },
)

export const updateTasks = createAsyncThunk(
    'tasks/updateTasks',
    async (data, thunkAPI) => {
        try {
            const res = await server.put(`tasks/${data?.id}`, data);
            return res?.data
        } catch (error) {
            console.log(error)
        }
    },
)

export const deleteTasks = createAsyncThunk(
    'tasks/deleteTasks',
    async (data, thunkAPI) => {
        try {
            const res = await server.delete(`tasks/${data?.id}`);
            return res?.data
        } catch (error) {
            console.log(error)
        }
    },
)


const initialState = {
    tasks: null,
    allTask: null,
    loading: false,
    error: false
}

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        searchTasks: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            state.tasks = state.allTask.filter(task => task?.title.toLowerCase().includes(searchTerm));
        },
        sortDateAndTitle: (state, action) => {
            const sortCriteria = action.payload;
            state.tasks = state?.allTask?.sort((a, b) => {
                if (sortCriteria === "dueDateAsc") {
                    return new Date(a?.dueDate) - new Date(b?.dueDate);
                } else if (sortCriteria === "dueDateDesc") {
                    return new Date(b?.dueDate) - new Date(a?.dueDate);
                } else if (sortCriteria === "titleAsc") {
                    return a?.title.localeCompare(b?.title);
                } else if (sortCriteria === "titleDesc") {
                    return b?.title.localeCompare(a?.title);
                }
                return 0;
            });
        },
        filterComplete: (state, action) => {
            const isCompleted = action.payload?.value === "completed";
            state.tasks = state?.allTask?.map(task => {
                const filteredSubtasks = task.subtasks.filter(subtask => subtask.isCompleted === isCompleted);
                return {
                    ...task,
                    subtasks: filteredSubtasks
                };
            });
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state, action) => {
                state.loading = true
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload
                state.allTask = action.payload
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = true
            })

            // Create New Tasks
            .addCase(addTasks.pending, (state, action) => {
                state.loading = true
            })
            .addCase(addTasks.fulfilled, (state, action) => {
                let tempTaskList = [...state?.tasks];
                tempTaskList.push(action.payload)
                state.tasks = tempTaskList
                state.allTask = tempTaskList
            })
            .addCase(addTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = true
            })

            // Update Tasks
            .addCase(updateTasks.pending, (state, action) => {
                state.loading = true
            })
            .addCase(updateTasks.fulfilled, (state, action) => {
                let tempTaskList = [...state?.tasks];
                tempTaskList = tempTaskList?.map((el) => el?.id === action.payload?.id ? action.payload : el)
                state.tasks = tempTaskList
                state.allTask = tempTaskList
            })
            .addCase(updateTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = true
            })

            // Delete Tasks
            .addCase(deleteTasks.pending, (state, action) => {
                state.loading = true
            })
            .addCase(deleteTasks.fulfilled, (state, action) => {
                let tempTaskList = [...state?.tasks];
                tempTaskList = tempTaskList?.filter((el) => el?.id !== action.payload?.id)
                state.tasks = tempTaskList
                state.allTask = tempTaskList
            })
            .addCase(deleteTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = true
            })
    }
});

export const tasksSliceReducer = tasksSlice.reducer;
export const tasksSliceActions = tasksSlice.actions;
