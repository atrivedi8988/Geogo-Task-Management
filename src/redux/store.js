import { configureStore } from "@reduxjs/toolkit";
import boardsSlice from "./boardsSlice";
import { tasksSliceReducer } from "./tasksSlice";


const store = configureStore({
  reducer: {
    boards: boardsSlice.reducer,
    tasks: tasksSliceReducer,
  }
})

export default store
