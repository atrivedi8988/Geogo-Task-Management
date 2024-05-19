import React from "react";
import { useDispatch } from "react-redux";
import { updateTasks } from "../redux/tasksSlice";

function Subtask({ subtask, task }) {
  const dispatch = useDispatch();
  const checked = subtask?.isCompleted;

  const onChange = (e) => {
    let updatedSubTasks = task?.subtasks?.map((el) => el?.id === subtask?.id ? { ...el, isCompleted: e?.target?.checked } : el)
    dispatch(updateTasks({ ...task, subtasks: updatedSubTasks }))
  };

  return (
    <div className=" w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740] rounded-md relative items-center justify-start dark:bg-[#20212c]  p-3 gap-4  bg-[#f4f7fd]">
      <input
        className=" w-4 h-4  accent-[#635fc7] cursor-pointer "
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <p className={checked && " line-through opacity-30 "}>
        {subtask.title}
      </p>
    </div>
  );
}

export default Subtask;
