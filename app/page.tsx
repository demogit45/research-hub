"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { DEFAULT_HUB_CONFIG } from "@/lib/config";
import { HubConfig, ResourceLink, Member } from "@/types";
import { Header } from "@/components/Header";
import { ResourceBento } from "@/components/ResourceBento";
import { MemberRoster } from "@/components/MemberRoster";
import { TaskList } from "@/components/TaskList";
import { AuthModal } from "@/components/AuthModal";
import { TaskModal } from "@/components/TaskModal";
import { PersonModal } from "@/components/PersonModal";
import { LinkModal } from "@/components/LinkModal";
import { GuideModal } from "@/components/GuideModal";
import { ConfigModal } from "@/components/ConfigModal";
import { Icon } from "@/components/Icon";
import { useToast } from "@/components/Toast";

export default function DashboardPage() {
  const { user, member, isAdmin, signIn, signUp, signOut } = useAuth();
  const {
    members,
    tasks,
    departments,
    syncStatus,
    isLive,
    stats,
    updateTaskProgress,
    createTask,
    deleteTask,
    createMember,
    deleteMember,
  } = useRealtimeData();

  const { showToast } = useToast();

  // App Theme State
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Config & Links State
  const [config, setConfig] = useState<HubConfig>(DEFAULT_HUB_CONFIG);
  const [searchQuery, setSearchQuery] = useState("");
  const [manageMode, setManageMode] = useState(false);

  // Modals State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [taskAssigneeId, setTaskAssigneeId] = useState<string | undefined>(undefined);
  const [isPersonOpen, setIsPersonOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ResourceLink | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize theme and saved links from localStorage on client mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("hub.theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
        document.documentElement.setAttribute("data-theme", savedTheme);
      }

      const savedLinks = localStorage.getItem("hub.links");
      if (savedLinks) {
        const parsed = JSON.parse(savedLinks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConfig((prev) => ({ ...prev, links: parsed }));
        }
      }
    } catch (e) {
      console.warn("Storage access failed:", e);
    }
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.className = next;
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("hub.theme", next);
    } catch {}
  };

  // Global Keyboard Shortcuts (/ to search, Esc to clear / close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape") {
        if (searchQuery) {
          setSearchQuery("");
        } else {
          // Close open modals
          setIsAuthOpen(false);
          setIsTaskOpen(false);
          setIsPersonOpen(false);
          setIsLinkOpen(false);
          setIsGuideOpen(false);
          setIsConfigOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery]);

  // Handle Task Status Toggle Cycle
  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    let nextStatus: "open" | "doing" | "done" = "doing";
    let nextProgress = 50;

    if (currentStatus === "open") {
      nextStatus = "doing";
      nextProgress = 50;
    } else if (currentStatus === "doing") {
      nextStatus = "done";
      nextProgress = 100;
    } else {
      nextStatus = "open";
      nextProgress = 0;
    }

    await updateTaskProgress(taskId, nextProgress, nextStatus);
    showToast(`Task status set to ${nextStatus}`, "clock");
  };

  // Link Management
  const handleSaveLink = (newLink: ResourceLink) => {
    setConfig((prev) => {
      const exists = prev.links.some((l) => l.id === newLink.id);
      const updated = exists
        ? prev.links.map((l) => (l.id === newLink.id ? newLink : l))
        : [...prev.links, newLink];

      try {
        localStorage.setItem("hub.links", JSON.stringify(updated));
      } catch {}
      return { ...prev, links: updated };
    });
  };

  const handleDeleteLink = (linkId: string) => {
    setConfig((prev) => {
      const updated = prev.links.filter((l) => l.id !== linkId);
      try {
        localStorage.setItem("hub.links", JSON.stringify(updated));
      } catch {}
      return { ...prev, links: updated };
    });
    showToast("Resource link removed", "trash");
  };

  return (
    <div className="shell">
      {/* Topbar & Hero */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        userMember={member}
        isAdmin={isAdmin}
        manageMode={manageMode}
        onToggleManage={() => setManageMode((prev) => !prev)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => {
          signOut();
          showToast("Signed out successfully", "user");
        }}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        stats={stats}
      />

      {/* Command Search Bar */}
      <div className="cmd">
        <Icon name="search" className="ico cmd__ico" />
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search links, docs, repos…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search links"
        />
        <span className="cmd__hint">/</span>
        {searchQuery && (
          <button
            className="cmd__clear"
            onClick={() => setSearchQuery("")}
            title="Clear search"
          >
            <Icon name="close" className="ico" /> Clear
          </button>
        )}
      </div>

      {/* Logged-in Researcher's Work Area */}
      {member && (
        <TaskList
          currentUser={member}
          tasks={tasks}
          isAdmin={isAdmin}
          onUpdateProgress={(taskId, progress) => {
            updateTaskProgress(taskId, progress);
          }}
          onDeleteTask={(taskId) => {
            deleteTask(taskId);
            showToast("Task removed", "trash");
          }}
          onSignOut={signOut}
        />
      )}

      {/* Resource Bento & Grid */}
      <ResourceBento
        links={config.links}
        categories={config.categories}
        searchQuery={searchQuery}
        manageMode={manageMode}
        onEditLink={(link) => {
          setEditingLink(link);
          setIsLinkOpen(true);
        }}
        onDeleteLink={handleDeleteLink}
        onOpenAddLink={() => {
          setEditingLink(null);
          setIsLinkOpen(true);
        }}
      />

      {/* Member Roster & People Section */}
      <MemberRoster
        members={members}
        tasks={tasks}
        departments={departments}
        currentUser={member}
        isAdmin={isAdmin}
        manageMode={manageMode}
        onOpenAssignWork={(mId) => {
          setTaskAssigneeId(mId);
          setIsTaskOpen(true);
        }}
        onOpenAddPerson={() => setIsPersonOpen(true)}
        onToggleTaskStatus={handleToggleTaskStatus}
        onDeletePerson={(pId) => {
          if (confirm("Remove this member and archive their assignments?")) {
            deleteMember(pId);
            showToast("Member removed", "trash");
          }
        }}
      />

      {/* Status Bar Footer */}
      <footer className="status">
        <div className="status__left">
          <span className="dot-live" aria-hidden="true"></span>
          <span>
            Connected to <b>Supabase Realtime</b> &bull;{" "}
            <span id="syncStatus">{syncStatus}</span>
          </span>
        </div>
        <div className="status__hints">
          <span>
            <kbd>/</kbd> to search
          </span>
          <span>
            <kbd>Esc</kbd> to clear
          </span>
        </div>
      </footer>

      {/* Floating Action Button (in Manage Mode) */}
      {manageMode && (
        <button
          className="fab"
          onClick={() => {
            setEditingLink(null);
            setIsLinkOpen(true);
          }}
          aria-label="Add a new resource link"
        >
          <Icon name="plus" className="ico" />
          <span>Add link</span>
        </button>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        departments={departments}
        onSignIn={signIn}
        onSignUp={signUp}
      />

      <TaskModal
        isOpen={isTaskOpen}
        onClose={() => {
          setIsTaskOpen(false);
          setTaskAssigneeId(undefined);
        }}
        members={members}
        initialAssigneeId={taskAssigneeId}
        onSaveTask={createTask}
      />

      <PersonModal
        isOpen={isPersonOpen}
        onClose={() => setIsPersonOpen(false)}
        departments={departments}
        onSavePerson={createMember}
      />

      <LinkModal
        isOpen={isLinkOpen}
        onClose={() => {
          setIsLinkOpen(false);
          setEditingLink(null);
        }}
        categories={config.categories}
        editingLink={editingLink}
        onSaveLink={handleSaveLink}
        onDeleteLink={handleDeleteLink}
      />

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onImportConfig={(newConfig) => {
          setConfig((prev) => ({
            ...prev,
            ...newConfig,
            links: newConfig.links || prev.links,
          }));
        }}
        onResetToDefaults={() => {
          setConfig(DEFAULT_HUB_CONFIG);
          try {
            localStorage.removeItem("hub.links");
          } catch {}
        }}
      />
    </div>
  );
}
