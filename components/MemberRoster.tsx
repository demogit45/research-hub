"use client";

import React, { useState, useMemo } from "react";
import { Member, Task, Department } from "@/types";
import { Icon } from "./Icon";
import { getInitials, isOverdue, formatDue, safeUrl } from "@/lib/utils";

interface MemberRosterProps {
  members: Member[];
  tasks: Task[];
  departments: Department[];
  currentUser: Member | null;
  isAdmin: boolean;
  manageMode: boolean;
  onOpenAssignWork: (memberId?: string) => void;
  onOpenAddPerson: () => void;
  onToggleTaskStatus: (taskId: string, currentStatus: string) => void;
  onDeletePerson: (personId: string) => void;
}

export const MemberRoster: React.FC<MemberRosterProps> = ({
  members,
  tasks,
  departments,
  currentUser,
  isAdmin,
  manageMode,
  onOpenAssignWork,
  onOpenAddPerson,
  onToggleTaskStatus,
  onDeletePerson,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${x}%`);
    e.currentTarget.style.setProperty("--my", `${y}%`);
  };

  const filteredMembers = useMemo(() => {
    if (selectedDept === "all") return members;
    return members.filter((m) => m.department === selectedDept);
  }, [members, selectedDept]);

  // Find tasks assigned to non-existent members (orphaned tasks)
  const orphanTasks = useMemo(() => {
    const memberIds = new Set(members.map((m) => m.id));
    return tasks.filter((t) => t.assignee_id && !memberIds.has(t.assignee_id));
  }, [tasks, members]);

  return (
    <section id="peopleSection" className="mt-14">
      <div className="sec">
        <h2>People</h2>
        <span className="sec__rule"></span>
        <span className="sec__count">{members.length}</span>

        {(isAdmin || manageMode) && (
          <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
            <button
              className="btn btn--sm btn--primary"
              onClick={() => onOpenAssignWork()}
            >
              <Icon name="clock" className="ico" /> Assign work
            </button>
            <button className="btn btn--sm" onClick={onOpenAddPerson}>
              <Icon name="plus" className="ico" /> Add person
            </button>
          </div>
        )}
      </div>

      {/* Department Filter Chips */}
      <div className="chips-row">
        <button
          className={`chip ${selectedDept === "all" ? "is-on" : ""}`}
          onClick={() => setSelectedDept("all")}
        >
          <span>All</span>
          <span className="chip__n">{members.length}</span>
        </button>
        {departments.map((dept) => {
          const count = members.filter((m) => m.department === dept.id).length;
          return (
            <button
              key={dept.id}
              className={`chip ${selectedDept === dept.id ? "is-on" : ""}`}
              onClick={() => setSelectedDept(dept.id)}
              style={{ "--cat": `var(--d-${dept.id})` } as React.CSSProperties}
            >
              <span className="chip__dot"></span>
              <span>{dept.label}</span>
              <span className="chip__n">{count}</span>
            </button>
          );
        })}
      </div>

      {/* People Cards Grid */}
      <div className="people">
        {filteredMembers.map((person, idx) => {
          const personTasks = tasks.filter((t) => t.assignee_id === person.id);
          const isMe = currentUser?.id === person.id;

          return (
            <div
              key={person.id}
              className={`person ${isMe ? "person--me" : ""}`}
              style={
                {
                  "--dept": `var(--d-${person.department})`,
                  "--i": idx,
                } as React.CSSProperties
              }
              onMouseMove={handleMouseMove}
            >
              {/* Admin Tools in Manage Mode */}
              {(manageMode || isAdmin) && (
                <div className="person__tools">
                  <button
                    className="tool"
                    onClick={() => onOpenAssignWork(person.id)}
                    title="Assign work to this person"
                  >
                    <Icon name="clock" className="ico" />
                  </button>
                  <button
                    className="tool tool--danger"
                    onClick={() => onDeletePerson(person.id)}
                    title="Remove member"
                  >
                    <Icon name="trash" className="ico" />
                  </button>
                </div>
              )}

              <div className="person__head">
                <div className="person__avatar">{getInitials(person.name)}</div>
                <div className="person__id">
                  <span className="person__name">
                    {person.name} {isMe && <span className="text-xs text-accent">(You)</span>}
                  </span>
                  <span className="person__role">{person.role}</span>
                </div>
                <span className="person__dept">{person.department}</span>
              </div>

              {/* Tasks assigned to this researcher */}
              <ul className="tasks">
                {personTasks.length === 0 ? (
                  <li className="tasks__none">No tasks assigned</li>
                ) : (
                  personTasks.map((task) => {
                    const overdue = isOverdue(task.due_date, task.status);

                    return (
                      <li
                        key={task.id}
                        className={`task task--${task.status}`}
                        title={
                          manageMode || isAdmin
                            ? "Click status dot to cycle (Open -> Doing -> Done)"
                            : undefined
                        }
                      >
                        <button
                          type="button"
                          className="task__dot"
                          onClick={() => {
                            if (manageMode || isAdmin || isMe) {
                              onToggleTaskStatus(task.id, task.status);
                            }
                          }}
                          disabled={!manageMode && !isAdmin && !isMe}
                          aria-label={`Mark task status`}
                        />

                        <div className="task__body">
                          <span className="task__title">{task.title}</span>

                          {(task.due_date || task.progress > 0) && (
                            <div className="task__meta">
                              {task.due_date && (
                                <span
                                  className={`task__due ${
                                    overdue ? "is-overdue font-semibold" : ""
                                  }`}
                                >
                                  {overdue ? "OVERDUE: " : "Due: "}
                                  {formatDue(task.due_date)}
                                </span>
                              )}
                              {task.progress > 0 && task.status !== "done" && (
                                <span className="task__pct">{task.progress}%</span>
                              )}
                            </div>
                          )}

                          {task.progress > 0 && (
                            <div className="task__bar">
                              <i style={{ width: `${task.progress}%` }}></i>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>

              {/* Quick assign button */}
              {(isAdmin || manageMode) && (
                <button
                  type="button"
                  className="add-task"
                  onClick={() => onOpenAssignWork(person.id)}
                >
                  <Icon name="plus" className="ico" /> Add task
                </button>
              )}

              {/* Social / Email Links */}
              <div className="person__links">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="person__link"
                    title={`Email ${person.email}`}
                  >
                    <Icon name="mail" className="ico" />
                  </a>
                )}
                {person.github && (
                  <a
                    href={safeUrl(`https://github.com/${person.github}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="person__link"
                    title={`GitHub: @${person.github}`}
                  >
                    <Icon name="git" className="ico" />
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {/* Orphaned Tasks Card (if any tasks have deleted members) */}
        {orphanTasks.length > 0 && (
          <div
            className="person person--orphan"
            style={{ "--dept": "var(--danger)" } as React.CSSProperties}
          >
            <div className="person__head">
              <div className="person__avatar">?</div>
              <div className="person__id">
                <span className="person__name">Unassigned / Former Members</span>
                <span className="person__role">Needs reassignment</span>
              </div>
              <span className="person__dept">Review</span>
            </div>

            <ul className="tasks">
              {orphanTasks.map((task) => (
                <li key={task.id} className={`task task--${task.status}`}>
                  <span className="task__dot"></span>
                  <div className="task__body">
                    <span className="task__title">{task.title}</span>
                  </div>
                </li>
              ))}
            </ul>

            {isAdmin && (
              <button
                type="button"
                className="add-task"
                onClick={() => onOpenAssignWork()}
              >
                <Icon name="clock" className="ico" /> Reassign work
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
