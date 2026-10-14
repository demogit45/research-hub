"use client";

import React, { useState, useEffect } from "react";
import { Member, Task } from "@/types";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  initialAssigneeId?: string;
  onSaveTask: (task: Omit<Task, "id">) => Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  members,
  initialAssigneeId,
  onSaveTask,
}) => {
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId || members[0]?.id || "");
  const [status, setStatus] = useState<"open" | "doing" | "done">("open");
  const [dueDate, setDueDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialAssigneeId) {
      setAssigneeId(initialAssigneeId);
    } else if (members.length > 0 && !assigneeId) {
      setAssigneeId(members[0].id);
    }
  }, [initialAssigneeId, members, assigneeId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSaveTask({
        title: title.trim(),
        assignee_id: assigneeId || null,
        status,
        progress: Number(progress),
        due_date: dueDate || null,
      });
      showToast("Work assigned successfully!", "clock");
      setTitle("");
      setProgress(0);
      setDueDate("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="veil" role="dialog" aria-modal="true" aria-labelledby="taskModalTitle">
      <div className="panel">
        <div className="panel__head">
          <h2 id="taskModalTitle">Assign Work</h2>
          <button className="tool" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="ico" />
          </button>
        </div>

        <div className="panel__body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="tTitle">Task Title</label>
              <input
                id="tTitle"
                required
                placeholder="Draft the literature review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="tAssignee">Assignee</label>
                <select
                  id="tAssignee"
                  required
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="tStatus">Status</label>
                <select
                  id="tStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="open">Open</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="tDue">
                  Due Date <span className="opt">optional</span>
                </label>
                <input
                  id="tDue"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="tProgress">Progress (%)</label>
                <input
                  id="tProgress"
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="panel__foot">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? "Saving..." : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
