"use client";

import { createContext, useContext, useMemo, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const value = useMemo(
    () => ({
      isExpanded,
      isMobileOpen,
      isHovered,
      setIsHovered,
      toggleSidebar: () => setIsExpanded((prev) => !prev),
      toggleMobileSidebar: () => setIsMobileOpen((prev) => !prev),
    }),
    [isExpanded, isMobileOpen, isHovered],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}
