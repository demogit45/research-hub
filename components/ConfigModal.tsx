"use client";

import React, { useState } from "react";
import { HubConfig } from "@/types";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HubConfig;
  onImportConfig: (newConfig: Partial<HubConfig>) => void;
  onResetToDefaults: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onImportConfig,
  onResetToDefaults,
}) => {
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const exportString = `const HUB_CONFIG = ${JSON.stringify(config, null, 2)};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportString);
    showToast("Configuration copied to clipboard!", "copy");
  };

  const handleDownload = () => {
    const blob = new Blob([exportString], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hub-config.js";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded hub-config.js", "archive");
  };

  const handleImport = () => {
    setImportMsg(null);
    let raw = importText.trim();
    if (!raw) {
      setImportMsg({ text: "Please paste a config JSON block first.", ok: false });
      return;
    }

    try {
      // Clean leading JS variable assignment if pasted from export
      raw = raw.replace(/^\s*(?:const|let|var)\s+\w+\s*=\s*/, "").replace(/;\s*$/, "").trim();
      const parsed = JSON.parse(raw);

      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Invalid structure.");
      }

      onImportConfig(parsed);
      setImportMsg({ text: "Configuration loaded successfully!", ok: true });
      showToast("Imported new hub config!", "sparkle");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setImportMsg({
        text: `Parse error: Invalid JSON syntax (${err?.message || "Check formatting"})`,
        ok: false,
      });
    }
  };

  return (
    <div className="veil" role="dialog" aria-modal="true" aria-labelledby="configTitle">
      <div className="panel">
        <div className="panel__head">
          <h2 id="configTitle">Config &amp; Export</h2>
          <button className="tool" onClick={onClose} aria-label="Close modal">
            <Icon name="close" className="ico" />
          </button>
        </div>

        <div className="panel__body">
          <p>This block represents the current static resources configuration of the research hub.</p>

          <div className="code">
            <button
              className="code__copy"
              onClick={handleCopy}
              title="Copy code"
            >
              Copy
            </button>
            {exportString}
          </div>

          <div className="panel__foot" style={{ marginTop: 0, marginBottom: "24px" }}>
            <button
              className="btn btn--danger mr-auto"
              onClick={() => {
                if (confirm("Reset links and resources to defaults?")) {
                  onResetToDefaults();
                  showToast("Reset to defaults", "refresh");
                  onClose();
                }
              }}
            >
              <Icon name="refresh" className="ico" /> Discard edits
            </button>
            <button className="btn" onClick={handleDownload}>
              <Icon name="archive" className="ico" /> Download .js
            </button>
            <button className="btn btn--primary" onClick={handleCopy}>
              <Icon name="copy" className="ico" /> Copy config
            </button>
          </div>

          <h3>Import Config</h3>
          <p>Paste a previously exported config block to restore link definitions:</p>
          <div className="field">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="const HUB_CONFIG = { ... };"
              aria-label="Paste a config block to import"
              spellCheck="false"
            />
          </div>

          {importMsg && (
            <div
              className={`import-msg ${
                importMsg.ok ? "import-msg--ok" : "import-msg--err"
              }`}
            >
              <Icon name={importMsg.ok ? "check" : "alert"} className="ico" />
              <span>{importMsg.text}</span>
            </div>
          )}

          <div className="panel__foot">
            <button className="btn" onClick={onClose}>
              Close
            </button>
            <button className="btn btn--primary" onClick={handleImport}>
              <Icon name="doc" className="ico" /> Load config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
