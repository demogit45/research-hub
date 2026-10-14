"use client";

import React from "react";
import { Member, Task } from "@/types";
import { Icon } from "./Icon";
import { getInitials, isOverdue, formatDue } from "@/lib/utils";

interface TaskListProps {
  currentUser: Member;
  tasks: Task[];
  isAdmin: boolean;
  onUpdateProgress: (taskId: string, progress: number) => void;
  onDeleteTask: (taskId: string) => void;
  onSignOut: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  currentUser,
  tasks,
  isAdmin,
  onUpdateProgress,
  onDeleteTask,
  onSignOut,
}) => {
  const myTasks = tasks.filter((t) => t.assignee_id === currentUser.id);

  return (
    <>
      {/* Active Session Bar */}
      <div className="session">
        <div className="session__avatar">{getInitials(currentUser.name)}</div>
        <div className="session__who">
          <div className="session__name">
            {currentUser.name}
            {isAdmin && <span className="badge--admin">Admin</span>}
            <span className="text-xs text-muted">({currentUser.email})</span>
          </div>
          <span className="session__role">
            {currentUser.role} &bull; {currentUser.department}
          </span>
        </div>
        <button
          className="btn btn--sm btn--ghost"
          onClick={onSignOut}
          title="Sign out of this session"
        >
          Sign out
        </button>
      </div>

      {/* "My work" Section */}
      <section id="mineSection" className="mb-8">
        <div className="sec">
          <h2>My work</h2>
          <span className="sec__rule"></span>
          <span className="sec__count">{myTasks.length}</span>
        </div>

        <div className="mine">
          {myTasks.length === 0 ? (
            <div className="state py-8">
              <div className="state__ico">
                <Icon name="check" className="ico" />
              </div>
              <h3>No work currently assigned</h3>
              <p>You have zero active tasks on your plate. Enjoy the breathing room!</p>
            </div>
          ) : (
            myTasks.map((task) => {
              const overdue = isOverdue(task.due_date, task.status);
              const isDone = task.status === "done";

              return (
                <div
                  key={task.id}
                  className={`mine__row ${isDone ? "is-done" : ""}`}
                >
                  <div className="mine__head">
                    <div>
                      <span
                        className={`mine__title ${
                          isDone ? "line-through text-muted" : ""
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.due_date && (
                        <div className="mine__meta">
                          <span className={overdue ? "is-overdue" : ""}>
                            {overdue ? "OVERDUE: " : "Due: "}
                            {formatDue(task.due_date)}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      className="tool tool--danger opacity-70 hover:opacity-100"
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete or dismiss task"
                    >
                      <Icon name="trash" className="ico" />
                    </button>
                  </div>

                  {/* Interactive Slider & Percentage Readout */}
                  <div className="mine__ctl">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={task.progress}
                      onChange={(e) =>
                        onUpdateProgress(task.id, parseInt(e.target.value, 10))
                      }
                      aria-label={`Progress for ${task.title}`}
                    />
                    <span className="mine__pct">{task.progress}%</span>
                  </div>

                  {/* Quick Jump Buttons */}
                  <div className="mine__quick">
                    {[0, 25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => onUpdateProgress(task.id, pct)}
                      >
                        {pct === 100 ? "Complete" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
};
