import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";
import Sidebar from "./Sidebar";
import { fetchTasks, tasksSliceActions } from "../redux/tasksSlice";

function Home() {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const { boardsList } = useSelector((state) => state.boards);
  const board = boardsList?.find((board) => board.isActive === true);
  const columns = board?.columns;

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  const [sortCriteria, setSortCriteria] = useState("");

  const handleSortChange = (e) => {
    dispatch(tasksSliceActions?.sortDateAndTitle(e.target.value))
    setSortCriteria(e.target.value);
  }

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  return (
    <div
      className={
        windowSize[0] >= 768 && isSideBarOpen
          ? " bg-[#f4f7fd]  scrollbar-hide h-screen flex dark:bg-[#20212c]  overflow-x-scroll gap-6  ml-[261px]"
          : "bg-[#f4f7fd]  scrollbar-hide h-screen flex    dark:bg-[#20212c] overflow-x-scroll gap-6 "
      }
    >
      {windowSize[0] >= 768 && (
        <Sidebar
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}
      <div className="flex flex-col w-full">
        <div className="flex w-full gap-5">
          <div className="mt-24 w-52">
            <label>
              Search By Title :
              <input
                type="text"
                placeholder="Search Title..."
                value={searchTerm}
                onChange={(e) => {
                  setTimeout(() => {
                    dispatch(tasksSliceActions?.searchTasks(e.target.value))
                  }, 800);
                  setSearchTerm(e.target.value)
                }}
                className="p-2 border rounded w-full"
              />
            </label>
          </div>
          <div className="mt-24 w-52">
            <label>
              Sort by :
              <select
                className="p-2 border rounded w-full"
                value={sortCriteria}
                onChange={handleSortChange}
              >
                <option value="" hidden>Due Date And Title</option>
                <option value="dueDateAsc">Due Date (Ascending)</option>
                <option value="dueDateDesc">Due Date (Descending)</option>
                <option value="titleAsc">Title (Ascending)</option>
                <option value="titleDesc">Title (Descending)</option>
              </select>
            </label>
          </div>
        </div>

        {/* Columns Section */}
        <div className="flex gap-6 overflow-auto">
          {columns?.length > 0 ? (
            <>
              {columns?.map((col, index) => (
                <Column key={index} colIndex={index} col={col} />
              ))}
              <div
                onClick={() => {
                  setIsBoardModalOpen(true);
                }}
                className=" h-screen dark:bg-[#2b2c3740] flex justify-center items-center font-bold text-2xl hover:text-[#635FC7] transition duration-300 cursor-pointer bg-[#E9EFFA] scrollbar-hide mb-2   mx-5 pt-[90px] min-w-[280px] text-[#828FA3] mt-[135px] rounded-lg "
              >
                + New Column
              </div>
            </>
          ) : (
            <>
              <EmptyBoard type="edit" />
            </>
          )}
        </div>
      </div>
      {isBoardModalOpen && (
        <AddEditBoardModal
          type="edit"
          setIsBoardModalOpen={setIsBoardModalOpen}
        />
      )}
    </div>
  );
}

export default Home;
