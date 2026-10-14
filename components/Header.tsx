"use client";

import React from "react";
import { Icon } from "./Icon";
import { Member } from "@/types";

interface HeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  userMember: Member | null;
  isAdmin: boolean;
  manageMode: boolean;
  onToggleManage: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenConfig: () => void;
  onOpenGuide: () => void;
  stats: {
    totalLinks: number;
    totalMembers: number;
    openTasks: number;
    overdueTasks: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  userMember,
  isAdmin,
  manageMode,
  onToggleManage,
  onOpenAuth,
  onSignOut,
  onOpenConfig,
  onOpenGuide,
  stats,
}) => {
  return (
    <>
      <header className="topbar">
        <div className="mark">
          <span className="glyph">
            <Icon name="hub" className="ico" />
          </span>
          <span id="markName">
            Group <b>Hub</b>
          </span>
        </div>

        <div className="actions">
          {/* Theme Toggle */}
          <button
            className="act act--icon"
            onClick={onToggleTheme}
            aria-label="Switch theme"
            title="Switch theme"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} className="ico" />
          </button>

          {/* Sign In / Profile Button */}
          {userMember ? (
            <button
              className="act is-on"
              onClick={onSignOut}
              title={`Signed in as ${userMember.name}. Click to sign out.`}
            >
              <Icon name="user" className="ico" />
              <span className="act__label">
                {userMember.name.split(" ")[0]}
                {isAdmin ? " (Admin)" : ""}
              </span>
            </button>
          ) : (
            <button
              className="act"
              onClick={onOpenAuth}
              title="Account sign-in or register"
            >
              <Icon name="user" className="ico" />
              <span className="act__label">Sign in</span>
            </button>
          )}

          {/* Manage Mode Toggle */}
          <button
            className={`act ${manageMode ? "is-on" : ""}`}
            onClick={onToggleManage}
            title="Add, edit or reorder links"
          >
            <Icon name="sliders" className="ico" />
            <span className="act__label">Edit</span>
          </button>

          {/* Config & Export */}
          <button
            className="act"
            onClick={onOpenConfig}
            title="Export or import the config"
          >
            <Icon name="layers" className="ico" />
            <span className="act__label">Config</span>
          </button>

          {/* Guide */}
          <button className="act" onClick={onOpenGuide} title="Open documentation">
            <Icon name="book-open" className="ico" />
            <span className="act__label">Guide</span>
          </button>
        </div>
      </header>

      {/* Hero Header with Asymmetric Layout & Live Readout */}
      <section className="hero">
        <div>
          <p className="eyebrow">Group workspace</p>
          <h1 id="heroTitle">
            Every link we use, <em>one place.</em>
          </h1>
          <p className="lede">
            Search it, filter it, click through. Connected live to Supabase for dynamic work tracking.
          </p>
        </div>

        <dl className="readout" id="readout">
          <div className="stat">
            <dt>Resources</dt>
            <dd>{stats.totalLinks}</dd>
          </div>
          <div className="stat">
            <dt>Members</dt>
            <dd>{stats.totalMembers}</dd>
          </div>
          <div className="stat">
            <dt>Open work</dt>
            <dd>{stats.openTasks}</dd>
          </div>
          <div className={`stat ${stats.overdueTasks > 0 ? "stat--warn" : ""}`}>
            <dt>Overdue</dt>
            <dd>{stats.overdueTasks}</dd>
          </div>
        </dl>
      </section>
    </>
  );
};
