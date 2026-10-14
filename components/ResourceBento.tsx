"use client";

import React, { useState, useMemo } from "react";
import { ResourceLink, Category } from "@/types";
import { Icon } from "./Icon";
import { safeUrl, extractHost } from "@/lib/utils";

interface ResourceBentoProps {
  links: ResourceLink[];
  categories: Category[];
  searchQuery: string;
  manageMode: boolean;
  onEditLink: (link: ResourceLink) => void;
  onDeleteLink: (linkId: string) => void;
  onOpenAddLink: () => void;
}

export const ResourceBento: React.FC<ResourceBentoProps> = ({
  links,
  categories,
  searchQuery,
  manageMode,
  onEditLink,
  onDeleteLink,
  onOpenAddLink,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>("all");

  // Track mouse coordinates for radial hover spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${x}%`);
    e.currentTarget.style.setProperty("--my", `${y}%`);
  };

  // Filter links by search query and category
  const filteredLinks = useMemo(() => {
    let result = links;

    if (selectedCat !== "all") {
      result = result.filter((l) => l.cat === selectedCat);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.desc && l.desc.toLowerCase().includes(q)) ||
          l.cat.toLowerCase().includes(q) ||
          (l.badge && l.badge.toLowerCase().includes(q))
      );
    }

    return result;
  }, [links, selectedCat, searchQuery]);

  // Pinned links for the "Start Here" Bento Grid
  const pinnedLinks = useMemo(() => {
    return links.filter((l) => l.pinned || l.cat === "start");
  }, [links]);

  return (
    <>
      {/* ======================= PINNED START HERE BENTO GRID ======================= */}
      {!searchQuery && pinnedLinks.length > 0 && (
        <section id="pinnedSection">
          <div className="sec">
            <h2>Start here</h2>
            <span className="sec__rule"></span>
            <span className="sec__count">{pinnedLinks.length}</span>
          </div>

          <div className="bento">
            {pinnedLinks.map((item, idx) => {
              // Assign hero tile to 1st item, wide to 2nd if available
              const isHero = idx === 0;
              const isWide = idx === 1;
              const isTodo = !item.url || item.url.includes("REPLACE_ME");
              const validHref = safeUrl(item.url);

              return (
                <a
                  key={item.id}
                  href={validHref}
                  target={validHref.startsWith("http") ? "_blank" : undefined}
                  rel={validHref.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`tile ${isHero ? "tile--hero" : isWide ? "tile--wide" : ""} ${
                    isTodo ? "is-todo" : ""
                  }`}
                  style={{ "--cat": `var(--c-${item.cat})` } as React.CSSProperties}
                  onMouseMove={handleMouseMove}
                >
                  <div className="tile__ico">
                    <Icon name={item.icon || "link"} className="ico" />
                  </div>

                  <div className="tile__body">
                    <span className="tile__eyebrow">
                      {categories.find((c) => c.id === item.cat)?.label || item.cat}
                    </span>
                    <span className="tile__title">{item.title}</span>
                    {item.desc && <p className="tile__desc">{item.desc}</p>}
                    <span className="tile__sub">{extractHost(item.url)}</span>
                  </div>

                  <span className="tile__arrow">
                    <Icon name="external" className="ico" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* ======================= ALL RESOURCES SECTION ======================= */}
      <section className="mt-12">
        <div className="sec">
          <h2>All resources</h2>
          <span className="sec__rule"></span>
          <span className="sec__count">{filteredLinks.length}</span>
          {manageMode && (
            <button
              onClick={onOpenAddLink}
              className="btn btn--sm btn--primary ml-auto"
            >
              <Icon name="plus" className="ico" /> Add link
            </button>
          )}
        </div>

        {/* Category Filter Rail */}
        <div className="rail">
          <button
            className={`chip ${selectedCat === "all" ? "is-on" : ""}`}
            onClick={() => setSelectedCat("all")}
          >
            <span>All</span>
            <span className="chip__n">{links.length}</span>
          </button>
          {categories.map((cat) => {
            const count = links.filter((l) => l.cat === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`chip ${selectedCat === cat.id ? "is-on" : ""}`}
                onClick={() => setSelectedCat(cat.id)}
                style={{ "--cat": `var(--c-${cat.id})` } as React.CSSProperties}
              >
                <span className="chip__dot"></span>
                <span>{cat.label}</span>
                <span className="chip__n">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid">
          {filteredLinks.length === 0 ? (
            <div className="state">
              <div className="state__ico">
                <Icon name="search" className="ico" />
              </div>
              <h3>No resources found</h3>
              <p>
                No items match your filter criteria. Try resetting your search or select another category.
              </p>
              <div className="state__btns">
                <button
                  className="btn btn--sm"
                  onClick={() => {
                    setSelectedCat("all");
                  }}
                >
                  Reset category
                </button>
              </div>
            </div>
          ) : (
            filteredLinks.map((link, idx) => {
              const isTodo = !link.url || link.url.includes("REPLACE_ME");
              const validHref = safeUrl(link.url);

              return (
                <div
                  key={link.id}
                  className={`card ${isTodo ? "is-todo" : ""}`}
                  style={
                    {
                      "--cat": `var(--c-${link.cat})`,
                      "--i": idx,
                    } as React.CSSProperties
                  }
                  onMouseMove={handleMouseMove}
                >
                  {/* Admin Tools when in Manage Mode */}
                  {manageMode && (
                    <div className="card__tools">
                      <button
                        className="tool"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditLink(link);
                        }}
                        title="Edit link"
                      >
                        <Icon name="edit" className="ico" />
                      </button>
                      <button
                        className="tool tool--danger"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDeleteLink(link.id);
                        }}
                        title="Delete link"
                      >
                        <Icon name="trash" className="ico" />
                      </button>
                    </div>
                  )}

                  <a
                    href={validHref}
                    target={validHref.startsWith("http") ? "_blank" : undefined}
                    rel={validHref.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="card__link"
                  >
                    <div className="card__top">
                      <div className="card__ico">
                        <Icon name={link.icon || "link"} className="ico" />
                      </div>
                      <span className="card__go">
                        <Icon name="external" className="ico" />
                      </span>
                    </div>

                    <h3 className="card__title">{link.title}</h3>
                    {link.desc && <p className="card__desc">{link.desc}</p>}

                    <div className="card__meta">
                      <span className="card__cat">
                        {categories.find((c) => c.id === link.cat)?.label || link.cat}
                      </span>
                      <span className="card__host">{extractHost(link.url)}</span>
                      {isTodo ? (
                        <span className="card__flag card__flag--todo">
                          <Icon name="alert" className="ico" /> needs URL
                        </span>
                      ) : link.badge ? (
                        <span className="card__flag">{link.badge}</span>
                      ) : null}
                    </div>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
};
