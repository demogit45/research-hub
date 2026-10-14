"use client";

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = "ico", ...props }) => {
  const renderPath = () => {
    switch (name) {
      case "hub":
        return (
          <>
            <path d="M12 3.5 20 8v8L12 20.5 4 16V8z" />
            <path d="M12 12 12 3.5M12 12 4 8M12 12 20 8M12 12 4 16M12 12 20 16M12 12 12 20.5" />
          </>
        );
      case "folder":
        return <path d="M3 7a2 2 0 0 1 2-2h3.6l2 2.4H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />;
      case "doc":
        return (
          <>
            <path d="M6 3.5h7.5L19 9v11.5H6z" />
            <path d="M13.5 3.5V9H19" />
            <path d="M9 13h7M9 16.5h5" />
          </>
        );
      case "code":
        return <path d="M9.5 8.5 5.5 12l4 3.5M14.5 8.5l4 3.5-4 3.5" />;
      case "chat":
        return <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-5 4z" />;
      case "book":
        return (
          <>
            <path d="M12 7.5C10.8 6.3 9.2 5.7 7 5.7H4v12h3c2.2 0 3.8.6 5 1.8 1.2-1.2 2.8-1.8 5-1.8h3v-12h-3c-2.2 0-3.8.6-5 1.8z" />
            <path d="M12 7.5v12" />
          </>
        );
      case "flask":
        return (
          <>
            <path d="M9.5 3v6.2L4.8 17.6A1.8 1.8 0 0 0 6.4 20.4h11.2a1.8 1.8 0 0 0 1.6-2.8L14.5 9.2V3" />
            <path d="M8 3h8" />
            <path d="M7.4 14.5h9.2" />
          </>
        );
      case "bookmark":
        return <path d="M6.5 3.5h11v17l-5.5-4.2-5.5 4.2z" />;
      case "pen":
        return (
          <>
            <path d="M4 20.2l1-4 11-11 3 3-11 11z" />
            <path d="M14.6 6.4l3 3" />
          </>
        );
      case "note":
        return (
          <>
            <path d="M5 4.5h14v10L14.5 19.5H5z" />
            <path d="M19 14.5h-4.5V19" />
          </>
        );
      case "door":
        return (
          <>
            <path d="M5.5 3.5h10a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-10z" />
            <path d="M13.5 12.4h.01" />
            <path d="M3 20.5h18" />
          </>
        );
      case "laptop":
        return (
          <>
            <path d="M5 5.5h14v10H5z" />
            <path d="M2.5 18.5h19" />
          </>
        );
      case "db":
        return (
          <>
            <path d="M4 6.5c0-1.4 3.6-2.5 8-2.5s8 1.1 8 2.5-3.6 2.5-8 2.5-8-1.1-8-2.5z" />
            <path d="M4 6.5v11c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-11" />
            <path d="M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5" />
          </>
        );
      case "notebook":
        return (
          <>
            <path d="M7 3.5h11v17H7z" />
            <path d="M4 6.5h3M4 12h3M4 17.5h3" />
          </>
        );
      case "video":
        return (
          <>
            <path d="M3.5 7.5h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" />
            <path d="M14.5 11l6-3.5v9l-6-3.5z" />
          </>
        );
      case "phone":
        return (
          <>
            <path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z" />
            <path d="M10.5 17.5h3" />
          </>
        );
      case "clock":
        return (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 7.5V12l3 2" />
          </>
        );
      case "grid":
        return <path d="M4 4.5h6.5V11H4zM13.5 4.5H20V11h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z" />;
      case "layers":
        return (
          <>
            <path d="M12 3.5 3.5 8 12 12.5 20.5 8z" />
            <path d="M3.5 12.5 12 17l8.5-4.5" />
            <path d="M3.5 16.5 12 21l8.5-4.5" />
          </>
        );
      case "users":
        return (
          <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <path d="M16 4.8a3.5 3.5 0 0 1 0 6.4" />
            <path d="M17.2 14.3c2.2.8 3.8 2.9 3.8 5.7" />
          </>
        );
      case "calendar":
        return (
          <>
            <path d="M4.5 6.5h15v14h-15z" />
            <path d="M4.5 11h15" />
            <path d="M8.5 3.5v4M15.5 3.5v4" />
          </>
        );
      case "link":
        return (
          <>
            <path d="M10.5 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5" />
            <path d="M13.5 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5" />
          </>
        );
      case "search":
        return (
          <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M15.8 15.8 20.5 20.5" />
          </>
        );
      case "plus":
        return <path d="M12 5v14M5 12h14" />;
      case "close":
        return <path d="M6 6l12 12M18 6L6 18" />;
      case "copy":
        return (
          <>
            <path d="M8.5 8.5h10v10h-10z" />
            <path d="M5.5 15.5h-1v-11h11v1" />
          </>
        );
      case "edit":
        return (
          <>
            <path d="M4 20.2l1-4 11-11 3 3-11 11z" />
            <path d="M14.6 6.4l3 3" />
          </>
        );
      case "trash":
        return (
          <>
            <path d="M4.5 6.5h15" />
            <path d="M9.5 6.5V4.5h5v2" />
            <path d="M6.8 6.5l1 13h8.4l1-13" />
            <path d="M10.5 10v6M13.5 10v6" />
          </>
        );
      case "sun":
        return (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
          </>
        );
      case "moon":
        return <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />;
      case "external":
        return (
          <>
            <path d="M14 4.5h5.5V10" />
            <path d="M19.5 4.5 11 13" />
            <path d="M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10" />
          </>
        );
      case "alert":
        return (
          <>
            <path d="M12 4 21 19.5H3z" />
            <path d="M12 10v4.5M12 17h.01" />
          </>
        );
      case "check":
        return <path d="M5 12.5l4.5 4.5L19 7.5" />;
      case "sliders":
        return (
          <>
            <path d="M5 8h14M5 16h14" />
            <circle cx="9.5" cy="8" r="2" />
            <circle cx="14.5" cy="16" r="2" />
          </>
        );
      case "refresh":
        return (
          <>
            <path d="M20 12a8 8 0 1 1-2.4-5.7" />
            <path d="M20 4v4.5h-4.5" />
          </>
        );
      case "book-open":
        return (
          <>
            <path d="M3.5 5.5h5.5a3 3 0 0 1 3 3v10a3 3 0 0 0-3-3H3.5z" />
            <path d="M20.5 5.5H15a3 3 0 0 0-3 3v10a3 3 0 0 1 3-3h5.5z" />
          </>
        );
      case "flag":
        return (
          <>
            <path d="M5.5 20.5V3.5" />
            <path d="M5.5 4.5h11l-1.8 4 1.8 4h-11z" />
          </>
        );
      case "user":
        return (
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
          </>
        );
      case "mail":
        return (
          <>
            <path d="M3.5 6.5h17v11h-17z" />
            <path d="M3.5 7.5 12 13l8.5-5.5" />
          </>
        );
      case "git":
        return (
          <>
            <circle cx="7" cy="6" r="2" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="12" r="2" />
            <path d="M7 8v8" />
            <path d="M9 6h3.5a4.5 4.5 0 0 1 4.5 4.5" />
          </>
        );
      default:
        return (
          <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4M12 16h.01" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {renderPath()}
    </svg>
  );
};
