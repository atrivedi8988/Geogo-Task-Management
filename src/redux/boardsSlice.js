import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { server } from "../axios_config";


export const fetchBoards = createAsyncThunk(
  'tasks/fetchBoards',
  async (userId, thunkAPI) => {
    try {
      const res = await server.get("boards");
      return res?.data
    } catch (error) {
      console.log(error)
    }
  },
)

export const addBoards = createAsyncThunk(
  'tasks/addBoards',
  async (data, thunkAPI) => {
    try {
      const res = await server.post("boards", data);
      return res?.data
    } catch (error) {
      console.log(error)
    }
  },
)

export const updateBoards = createAsyncThunk(
  'tasks/updateBoards',
  async (data, thunkAPI) => {
    try {
      const res = await server.put(`boards/${data?.id}`, data);
      return res?.data
    } catch (error) {
      console.log(error)
    }
  },
)

export const deleteBoards = createAsyncThunk(
  'tasks/deleteBoards',
  async (data, thunkAPI) => {
    try {
      const res = await server.delete(`boards/${data?.id}`);
      return res?.data
    } catch (error) {
      console.log(error)
    }
  },
)


const initialState = {
  boardsList: null,
  loading: false,
  error: false
}


const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoardActive: (state, action) => {
      state?.boardsList?.map((board, index) => {
        index === action.payload.index
          ? (board.isActive = true)
          : (board.isActive = false);
        return board;
      });
    },
    dragTask: (state, action) => {
      const { colID, prevColID, taskID, tasks } = action.payload;
      const board = state?.boardsList?.find((board) => board.isActive);
      const prevCol = board.columns.find((col, i) => col?.id === prevColID);
      const task = tasks.splice(taskID, 1)[0];
      board.columns.find((col, i) => col?.id === colID).tasks.push(task);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Boards
      .addCase(fetchBoards.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boardsList = action.payload
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = true
      })

      // Create New Boards
      .addCase(addBoards.pending, (state, action) => {
        state.loading = true
      })
      .addCase(addBoards.fulfilled, (state, action) => {
        let tempTaskList = [...state?.boardsList];
        tempTaskList.push(action.payload)
        state.boardsList = tempTaskList
      })
      .addCase(addBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = true
      })

      // Update Boards
      .addCase(updateBoards.pending, (state, action) => {
        state.loading = true
      })
      .addCase(updateBoards.fulfilled, (state, action) => {
        let tempTaskList = [...state?.boardsList];
        tempTaskList = tempTaskList?.map((el) => el?.id === action.payload?.id ? action.payload : el)
        state.boardsList = tempTaskList
      })
      .addCase(updateBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = true
      })

      // Delete Boards
      .addCase(deleteBoards.pending, (state, action) => {
        state.loading = true
      })
      .addCase(deleteBoards.fulfilled, (state, action) => {
        let tempTaskList = [...state?.boardsList];
        tempTaskList = tempTaskList?.filter((el) => el?.id !== action.payload?.id)
        state.boardsList = tempTaskList
      })
      .addCase(deleteBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = true
      })
  }
});

export default boardsSlice;
export const boardsSliceReducer = boardsSlice.reducer;
