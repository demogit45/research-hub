"use client";

import React from "react";
import { Icon } from "./Icon";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="veil" role="dialog" aria-modal="true" aria-labelledby="guideTitle">
      <div className="panel">
        <div className="panel__head">
          <h2 id="guideTitle">How this hub works</h2>
          <button className="tool" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="ico" />
          </button>
        </div>

        <div className="panel__body">
          <p>
            A unified research resource dashboard with live Supabase database synchronization and role-based work tracking.
          </p>

          <h3>Updating Links &amp; Work</h3>
          <ol className="steps">
            <li>
              <strong>Live Supabase backend.</strong> Team members and tasks sync in real-time across all browser sessions via Supabase Realtime WebSocket channels.
            </li>
            <li>
              <strong>Member accounts.</strong> Register with your research lab details or sign in using your credentials. Extra profile fields sync directly into <code>public.members</code>.
            </li>
            <li>
              <strong>Task tracking.</strong> View your assigned tasks under &ldquo;My work&rdquo; and adjust progress sliders to sync directly with Supabase.
            </li>
            <li>
              <strong>Admin tools.</strong> Administrators can assign work, register new researchers, and edit resource tiles.
            </li>
          </ol>

          <h3>Keyboard Shortcuts</h3>
          <ul className="steps">
            <li>
              <kbd>/</kbd> &mdash; focus search field
            </li>
            <li>
              <kbd>Esc</kbd> &mdash; clear search or close active modal
            </li>
          </ul>

          <h3>Embed in Your Site</h3>
          <p>
            Add <code>?embed=1</code> to the URL to remove the topbar, footer, and background effects for clean iframe embedding:
          </p>
          <div className="code">
            {`<iframe src="https://your-domain.vercel.app/?embed=1" style="width:100%;height:100vh;border:0" />`}
          </div>

          <div className="panel__foot">
            <button className="btn btn--primary" onClick={onClose}>
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
