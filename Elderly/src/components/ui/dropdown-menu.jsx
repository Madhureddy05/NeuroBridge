import React, { useState, useRef, useEffect } from "react";

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "DropdownMenuTrigger") {
          return React.cloneElement(child, { toggle: () => setIsOpen(!isOpen) });
        }

        if (child.type.displayName === "DropdownMenuContent") {
          return isOpen ? child : null;
        }

        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ children, toggle }) {
  return <div onClick={toggle}>{children}</div>;
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export function DropdownMenuContent({ children, className = "" }) {
  return (
    <div
      className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${className}`}
    >
      {children}
    </div>
  );
}
DropdownMenuContent.displayName = "DropdownMenuContent";

export function DropdownMenuItem({ children, className = "", ...props }) {
  return (
    <button
      className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
