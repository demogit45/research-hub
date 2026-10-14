"use client";

import React, { useState, useEffect } from "react";
import { Category, ResourceLink } from "@/types";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

const AVAILABLE_ICONS = [
  "folder",
  "code",
  "chat",
  "book",
  "flask",
  "bookmark",
  "pen",
  "note",
  "door",
  "laptop",
  "db",
  "notebook",
  "video",
  "phone",
  "clock",
  "grid",
  "layers",
  "users",
  "link",
];

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  editingLink: ResourceLink | null;
  onSaveLink: (link: ResourceLink) => void;
  onDeleteLink?: (linkId: string) => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  categories,
  editingLink,
  onSaveLink,
  onDeleteLink,
}) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [cat, setCat] = useState("start");
  const [badge, setBadge] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("link");
  const [pinned, setPinned] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setCat(editingLink.cat);
      setBadge(editingLink.badge || "");
      setDesc(editingLink.desc || "");
      setIcon(editingLink.icon || "link");
      setPinned(Boolean(editingLink.pinned));
    } else {
      setTitle("");
      setUrl("");
      setCat(categories[0]?.id || "start");
      setBadge("");
      setDesc("");
      setIcon("link");
      setPinned(false);
    }
  }, [editingLink, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const newOrUpdatedLink: ResourceLink = {
      id: editingLink ? editingLink.id : `link-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      cat,
      badge: badge.trim() || undefined,
      desc: desc.trim() || undefined,
      icon,
      pinned,
    };

    onSaveLink(newOrUpdatedLink);
    showToast(editingLink ? "Resource link updated!" : "Resource link added!", "check");
    onClose();
  };

  return (
    <div className="veil" role="dialog" aria-modal="true" aria-labelledby="linkModalTitle">
      <div className="panel">
        <div className="panel__head">
          <h2 id="linkModalTitle">
            {editingLink ? "Edit Resource Link" : "Add Resource Link"}
          </h2>
          <button className="tool" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="ico" />
          </button>
        </div>

        <div className="panel__body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="fTitle">Title</label>
              <input
                id="fTitle"
                required
                placeholder="Shared Google Drive"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className="field">
              <label htmlFor="fUrl">URL (http:// or https://)</label>
              <input
                id="fUrl"
                required
                placeholder="https://drive.google.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                spellCheck="false"
              />
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="fCat">Category</label>
                <select id="fCat" value={cat} onChange={(e) => setCat(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="fBadge">
                  Badge <span className="opt">optional</span>
                </label>
                <input
                  id="fBadge"
                  placeholder="e.g. live, v2"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="fDesc">
                Description <span className="opt">optional</span>
              </label>
              <textarea
                id="fDesc"
                placeholder="What is this link for? Who needs it?"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Icon Picker</label>
              <div className="icons">
                {AVAILABLE_ICONS.map((iName) => (
                  <button
                    key={iName}
                    type="button"
                    className={`pick ${icon === iName ? "is-on" : ""}`}
                    onClick={() => setIcon(iName)}
                    title={iName}
                  >
                    <Icon name={iName} className="ico" />
                  </button>
                ))}
              </div>
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
                id="fPinned"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label
                htmlFor="fPinned"
                style={{
                  margin: 0,
                  cursor: "pointer",
                  fontSize: "12.5px",
                  textTransform: "none",
                  letterSpacing: 0,
                  color: "var(--text)",
                }}
              >
                Pin to &ldquo;Start here&rdquo; row
              </label>
            </div>

            <div className="panel__foot">
              {editingLink && onDeleteLink && (
                <button
                  type="button"
                  className="btn btn--danger btn--ghost mr-auto"
                  onClick={() => {
                    onDeleteLink(editingLink.id);
                    onClose();
                  }}
                >
                  <Icon name="trash" className="ico" /> Delete link
                </button>
              )}
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                Save Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
