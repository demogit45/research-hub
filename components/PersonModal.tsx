"use client";

import React, { useState } from "react";
import { Department, Member } from "@/types";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onSavePerson: (person: Omit<Member, "id">) => Promise<void>;
}

export const PersonModal: React.FC<PersonModalProps> = ({
  isOpen,
  onClose,
  departments,
  onSavePerson,
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState(departments[0]?.id || "research");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const generatedCode =
        memberCode.trim() ||
        `${name.split(" ")[0].toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await onSavePerson({
        name: name.trim(),
        role: role.trim() || "Researcher",
        department: dept,
        email: email.trim(),
        github: github.trim(),
        member_code: generatedCode,
        is_admin: isAdmin,
      });

      showToast("Member added to hub roster!", "user");
      setName("");
      setRole("");
      setEmail("");
      setGithub("");
      setMemberCode("");
      setIsAdmin(false);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="veil" role="dialog" aria-modal="true" aria-labelledby="personModalTitle">
      <div className="panel">
        <div className="panel__head">
          <h2 id="personModalTitle">Add Member to Hub</h2>
          <button className="tool" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="ico" />
          </button>
        </div>

        <div className="panel__body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="pName">Full Name</label>
              <input
                id="pName"
                required
                placeholder="Dr. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="pRole">
                  Role <span className="opt">optional</span>
                </label>
                <input
                  id="pRole"
                  placeholder="Postdoctoral Fellow"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="pDept">Department</label>
                <select id="pDept" value={dept} onChange={(e) => setDept(e.target.value)}>
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
                <label htmlFor="pEmail">
                  Email <span className="opt">optional</span>
                </label>
                <input
                  id="pEmail"
                  type="email"
                  placeholder="maya@lab.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  spellCheck="false"
                />
              </div>
              <div className="field">
                <label htmlFor="pGithub">
                  GitHub Handle <span className="opt">optional</span>
                </label>
                <input
                  id="pGithub"
                  placeholder="mayalin"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  spellCheck="false"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="pCode">
                Access Code / Identifier <span className="opt">optional (auto-generated)</span>
              </label>
              <input
                id="pCode"
                placeholder="e.g. MAYA-8K2L"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div
              className="field"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "6px",
              }}
            >
              <input
                type="checkbox"
                id="pIsAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label
                htmlFor="pIsAdmin"
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
                {loading ? "Adding..." : "Add Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
