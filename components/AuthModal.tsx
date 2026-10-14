"use client";

import React, { useState } from "react";
import { Department } from "@/types";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onSignIn: (identifier: string, code: string) => Promise<any>;
  onSignUp: (data: {
    email: string;
    password: string;
    name: string;
    department: string;
    role?: string;
    github?: string;
    isAdmin?: boolean;
  }) => Promise<any>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  departments,
  onSignIn,
  onSignUp,
}) => {
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const { showToast } = useToast();

  // Sign In Form State
  const [signIdentifier, setSignIdentifier] = useState("");
  const [signPassword, setSignPassword] = useState("");
  const [signLoading, setSignLoading] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDept, setRegDept] = useState(departments[0]?.id || "research");
  const [regRole, setRegRole] = useState("");
  const [regGithub, setRegGithub] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regIsAdmin, setRegIsAdmin] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignError(null);
    setSignLoading(true);

    try {
      await onSignIn(signIdentifier, signPassword);
      showToast("Signed in successfully!", "check");
      onClose();
    } catch (err: any) {
      setSignError(err?.message || "Invalid credentials. Please verify your details.");
    } finally {
      setSignLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);

    try {
      await onSignUp({
        email: regEmail,
        password: regPassword,
        name: regName,
        department: regDept,
        role: regRole,
        github: regGithub,
        isAdmin: regIsAdmin,
      });
      showToast("Account created and profile synced!", "sparkle");
      onClose();
    } catch (err: any) {
      setRegError(err?.message || "Failed to register. Please try again.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="veil" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <div className="panel">
        <div className="panel__head">
          <h2 id="authTitle">Researcher Account Access</h2>
          <button className="tool" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="ico" />
          </button>
        </div>

        <div className="panel__body">
          {/* Tab Bar */}
          <div className="tabs" role="tablist">
            <button
              type="button"
              className={`tab ${tab === "signin" ? "is-active" : ""}`}
              onClick={() => setTab("signin")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`tab ${tab === "register" ? "is-active" : ""}`}
              onClick={() => setTab("register")}
            >
              Register New Member
            </button>
          </div>

          {/* SIGN IN TAB */}
          {tab === "signin" && (
            <form onSubmit={handleSignInSubmit}>
              <div className="field">
                <label htmlFor="authEmail">Member ID, Email or Code</label>
                <input
                  id="authEmail"
                  required
                  placeholder="e.g. name@lab.edu or AARAV-4X9P"
                  value={signIdentifier}
                  onChange={(e) => setSignIdentifier(e.target.value)}
                  autoComplete="username"
                  spellCheck="false"
                />
              </div>

              <div className="field">
                <label htmlFor="authPassword">Password / Secret Key</label>
                <input
                  id="authPassword"
                  type="password"
                  required
                  placeholder="Enter password"
                  value={signPassword}
                  onChange={(e) => setSignPassword(e.target.value)}
                  autoComplete="current-password"
                  spellCheck="false"
                />
              </div>

              {signError && (
                <div className="import-msg import-msg--err">
                  <Icon name="alert" className="ico" />
                  <span>{signError}</span>
                </div>
              )}

              <div className="panel__foot">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={onClose}
                  disabled={signLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={signLoading}
                >
                  <Icon name="user" className="ico" />
                  {signLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          )}

          {/* REGISTER TAB */}
          {tab === "register" && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="field">
                <label htmlFor="regName">Full Name</label>
                <input
                  id="regName"
                  required
                  placeholder="Dr. Aarav Mehta"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  spellCheck="false"
                />
              </div>

              <div className="row2">
                <div className="field">
                  <label htmlFor="regEmail">Email Address</label>
                  <input
                    id="regEmail"
                    type="email"
                    required
                    placeholder="aarav@lab.edu"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    spellCheck="false"
                  />
                </div>
                <div className="field">
                  <label htmlFor="regDept">Department</label>
                  <select
                    id="regDept"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <label htmlFor="regRole">
                    Role <span className="opt">optional</span>
                  </label>
                  <input
                    id="regRole"
                    placeholder="Research Fellow"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="regGithub">
                    GitHub Username <span className="opt">optional</span>
                  </label>
                  <input
                    id="regGithub"
                    placeholder="username"
                    value={regGithub}
                    onChange={(e) => setRegGithub(e.target.value)}
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="regPassword">Password (minimum 6 characters)</label>
                <input
                  id="regPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Choose a secure password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  spellCheck="false"
                />
              </div>

              <div
                className="field"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                <input
                  type="checkbox"
                  id="regAdminCheck"
                  checked={regIsAdmin}
                  onChange={(e) => setRegIsAdmin(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <label
                  htmlFor="regAdminCheck"
                  style={{
                    margin: 0,
                    cursor: "pointer",
                    fontSize: "12.5px",
                    textTransform: "none",
                    letterSpacing: 0,
                    color: "var(--text)",
                  }}
                >
                  Grant Administrator Privileges
                </label>
              </div>

              {regError && (
                <div className="import-msg import-msg--err">
                  <Icon name="alert" className="ico" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="panel__foot">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={onClose}
                  disabled={regLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={regLoading}
                >
                  <Icon name="plus" className="ico" />
                  {regLoading ? "Registering..." : "Register & Join Hub"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
