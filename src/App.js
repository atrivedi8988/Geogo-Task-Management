import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Home from "./components/Home";
import EmptyBoard from './components/EmptyBoard';
import boardsSlice, { fetchBoards } from "./redux/boardsSlice";

function App() {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { boardsList } = useSelector((state) => state.boards);
  const activeBoard = boardsList?.find((board) => board.isActive);
  if (!activeBoard && boardsList?.length > 0)
    dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  useEffect(() => {
    dispatch(fetchBoards())
  }, [])
  return (
    <div className=" overflow-hidden  overflow-x-scroll h-[100vh]">
      <>
        {boardsList?.length > 0 ?
          <>
            <Header
              setIsBoardModalOpen={setIsBoardModalOpen}
              isBoardModalOpen={isBoardModalOpen}
            />
            <Home
              setIsBoardModalOpen={setIsBoardModalOpen}
              isBoardModalOpen={isBoardModalOpen}
            />
          </>
          :
          <>
            <EmptyBoard type='add' />
          </>
        }

      </>
    </div>
  );
}

export default App;
