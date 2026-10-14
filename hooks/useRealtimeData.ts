"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Member, Task, Department } from "@/types";
import { DEFAULT_HUB_CONFIG } from "@/lib/config";
import { isOverdue } from "@/lib/utils";

// Initial seed data fallback if Supabase tables are freshly initialized
const SEED_MEMBERS: Member[] = [
  {
    id: "p1",
    name: "Aarav Mehta",
    role: "Coordinator",
    department: "research",
    email: "aarav@example.com",
    github: "aarav-m",
    member_code: "AARAV-4X9P",
    is_admin: true,
  },
  {
    id: "p2",
    name: "Diya Nair",
    role: "Research",
    department: "research",
    email: "diya@example.com",
    github: "diya-n",
    member_code: "DIYA-9M2X",
    is_admin: false,
  },
  {
    id: "p3",
    name: "Kabir Rao",
    role: "Tech lead",
    department: "tech",
    email: "kabir@example.com",
    github: "kabir-r",
    member_code: "KABIR-7T1Q",
    is_admin: false,
  },
  {
    id: "p4",
    name: "Ananya Iyer",
    role: "Multimedia lead",
    department: "multimedia",
    email: "ananya@example.com",
    github: "ananya-i",
    member_code: "ANANYA-2W8L",
    is_admin: false,
  },
  {
    id: "p5",
    name: "Rohan Gupta",
    role: "Tech",
    department: "tech",
    email: "rohan@example.com",
    github: "rohan-g",
    member_code: "ROHAN-5K3Z",
    is_admin: false,
  },
];

const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "Draft the literature review outline",
    assignee_id: "p2",
    status: "doing",
    progress: 40,
    due_date: "2026-11-30",
  },
  {
    id: "t2",
    title: "Summarise arXiv:2609.10876 for the group",
    assignee_id: "p2",
    status: "open",
    progress: 0,
    due_date: "2026-10-15",
  },
  {
    id: "t3",
    title: "Set up the shared reference library",
    assignee_id: "p1",
    status: "done",
    progress: 100,
    due_date: null,
  },
  {
    id: "t4",
    title: "Book the weekly sync slot",
    assignee_id: "p1",
    status: "done",
    progress: 100,
    due_date: null,
  },
  {
    id: "t5",
    title: "Build the pipeline for the decoder runs",
    assignee_id: "p3",
    status: "doing",
    progress: 65,
    due_date: "2026-11-15",
  },
  {
    id: "t6",
    title: "Write the decoder benchmark script",
    assignee_id: "p5",
    status: "open",
    progress: 0,
    due_date: null,
  },
  {
    id: "t7",
    title: "Set up CI for the code repository",
    assignee_id: "p5",
    status: "open",
    progress: 15,
    due_date: null,
  },
  {
    id: "t8",
    title: "Design the group logo and slide template",
    assignee_id: "p4",
    status: "open",
    progress: 25,
    due_date: null,
  },
  {
    id: "t9",
    title: "Edit the first explainer video",
    assignee_id: "p4",
    status: "open",
    progress: 10,
    due_date: "2026-11-01",
  },
];

export function useRealtimeData() {
  const [supabase] = useState(() => createBrowserClient());
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_HUB_CONFIG.departments);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<string>("Connecting to Supabase Realtime...");
  const [isLive, setIsLive] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch departments
      const { data: deptData } = await supabase.from("departments").select("*");
      if (deptData && deptData.length > 0) {
        setDepartments(deptData);
      }

      // 2. Fetch members
      const { data: memberData, error: memberErr } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: true });

      if (memberData && memberData.length > 0) {
        setMembers(
          memberData.map((m: any) => ({
            id: m.id,
            name: m.name,
            role: m.role || "Researcher",
            department: m.department || m.dept || "research",
            email: m.email || "",
            github: m.github || "",
            member_code: m.member_code || m.access_code || "",
            is_admin: Boolean(m.is_admin),
            created_at: m.created_at,
          }))
        );
      } else if (memberErr) {
        console.warn("Notice: Fetching members from Supabase:", memberErr.message);
      }

      // 3. Fetch tasks
      const { data: taskData, error: taskErr } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: true });

      if (taskData && taskData.length > 0) {
        setTasks(
          taskData.map((t: any) => ({
            id: t.id,
            title: t.title,
            assignee_id: t.assignee_id || t.assignee || null,
            status: t.status || "open",
            progress: Number(t.progress ?? 0),
            due_date: t.due_date || t.due || null,
            created_at: t.created_at,
          }))
        );
      } else if (taskErr) {
        console.warn("Notice: Fetching tasks from Supabase:", taskErr.message);
      }

      setSyncStatus("Live sync active");
      setIsLive(true);
    } catch (err) {
      console.warn("Data fetch fallback:", err);
      setSyncStatus("Local cache active");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();

    // Set up Realtime subscriptions for tasks and members
    const channel = supabase
      .channel("public-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as any;
            const newTask: Task = {
              id: row.id,
              title: row.title,
              assignee_id: row.assignee_id || row.assignee,
              status: row.status,
              progress: Number(row.progress ?? 0),
              due_date: row.due_date || row.due || null,
              created_at: row.created_at,
            };
            setTasks((prev) => {
              if (prev.some((t) => t.id === newTask.id)) return prev;
              return [...prev, newTask];
            });
          } else if (payload.eventType === "UPDATE") {
            const row = payload.new as any;
            setTasks((prev) =>
              prev.map((t) =>
                t.id === row.id
                  ? {
                      ...t,
                      title: row.title ?? t.title,
                      assignee_id: row.assignee_id ?? row.assignee ?? t.assignee_id,
                      status: row.status ?? t.status,
                      progress: Number(row.progress ?? t.progress),
                      due_date: row.due_date ?? row.due ?? t.due_date,
                    }
                  : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            const oldRow = payload.old as any;
            setTasks((prev) => prev.filter((t) => t.id !== oldRow.id));
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as any;
            const newMember: Member = {
              id: row.id,
              name: row.name,
              role: row.role || "Researcher",
              department: row.department || row.dept || "research",
              email: row.email,
              github: row.github,
              member_code: row.member_code || row.access_code,
              is_admin: Boolean(row.is_admin),
              created_at: row.created_at,
            };
            setMembers((prev) => {
              if (prev.some((m) => m.id === newMember.id)) return prev;
              return [...prev, newMember];
            });
          } else if (payload.eventType === "UPDATE") {
            const row = payload.new as any;
            setMembers((prev) =>
              prev.map((m) =>
                m.id === row.id
                  ? {
                      ...m,
                      name: row.name ?? m.name,
                      role: row.role ?? m.role,
                      department: row.department ?? row.dept ?? m.department,
                      email: row.email ?? m.email,
                      github: row.github ?? m.github,
                      is_admin: row.is_admin !== undefined ? Boolean(row.is_admin) : m.is_admin,
                    }
                  : m
              )
            );
          } else if (payload.eventType === "DELETE") {
            const oldRow = payload.old as any;
            setMembers((prev) => prev.filter((m) => m.id !== oldRow.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsLive(true);
          setSyncStatus("Live sync active");
        } else if (status === "CHANNEL_ERROR") {
          setIsLive(false);
          setSyncStatus("Reconnecting to realtime...");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchData]);

  // Optimistic update + Supabase sync for task progress and status
  const updateTaskProgress = async (taskId: string, progress: number, newStatus?: "open" | "doing" | "done") => {
    const computedStatus =
      newStatus !== undefined
        ? newStatus
        : progress >= 100
        ? "done"
        : progress > 0
        ? "doing"
        : "open";

    // 1. Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              progress,
              status: computedStatus,
            }
          : t
      )
    );

    // 2. Push to Supabase
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ progress, status: computedStatus })
        .eq("id", taskId);

      if (error) {
        console.warn("Supabase update task error:", error.message);
      }
    } catch (err) {
      console.warn("Failed to push task progress to Supabase:", err);
    }
  };

  // Create a new task
  const createTask = async (taskData: Omit<Task, "id">) => {
    const tempId = `t-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id: tempId,
    };

    // Optimistic UI insert
    setTasks((prev) => [...prev, newTask]);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: taskData.title,
          assignee_id: taskData.assignee_id,
          status: taskData.status,
          progress: taskData.progress,
          due_date: taskData.due_date || null,
        })
        .select()
        .single();

      if (error) {
        console.warn("Notice: Task insert error:", error.message);
      } else if (data) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? { ...t, id: data.id } : t))
        );
      }
    } catch (err) {
      console.warn("Failed to save task to Supabase:", err);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await supabase.from("tasks").delete().eq("id", taskId);
    } catch (err) {
      console.warn("Failed to delete task from Supabase:", err);
    }
  };

  // Create or add a member (by admin)
  const createMember = async (memberData: Omit<Member, "id">) => {
    const tempId = `m-${Date.now()}`;
    const newMember: Member = {
      ...memberData,
      id: tempId,
    };

    setMembers((prev) => [...prev, newMember]);

    try {
      const { data, error } = await supabase
        .from("members")
        .insert({
          name: memberData.name,
          role: memberData.role,
          department: memberData.department,
          email: memberData.email,
          github: memberData.github,
          member_code: memberData.member_code,
          is_admin: memberData.is_admin,
        })
        .select()
        .single();

      if (error) {
        console.warn("Notice: Member insert error:", error.message);
      } else if (data) {
        setMembers((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: data.id } : m))
        );
      }
    } catch (err) {
      console.warn("Failed to save member to Supabase:", err);
    }
  };

  // Delete a member (by admin)
  const deleteMember = async (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    try {
      await supabase.from("members").delete().eq("id", memberId);
    } catch (err) {
      console.warn("Failed to delete member from Supabase:", err);
    }
  };

  // Computed dashboard statistics
  const stats = {
    totalLinks: DEFAULT_HUB_CONFIG.links.length,
    totalMembers: members.length,
    openTasks: tasks.filter((t) => t.status !== "done").length,
    overdueTasks: tasks.filter((t) => isOverdue(t.due_date, t.status)).length,
  };

  return {
    members,
    tasks,
    departments,
    loading,
    syncStatus,
    isLive,
    stats,
    updateTaskProgress,
    createTask,
    deleteTask,
    createMember,
    deleteMember,
    refetch: fetchData,
  };
}
