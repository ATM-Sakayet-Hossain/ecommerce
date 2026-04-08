import React from "react";

function IconWrapper({ children }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center">
      {children}
    </span>
  );
}

export function BoxCubeIcon() {
  return <IconWrapper>□</IconWrapper>;
}

export function CalenderIcon() {
  return <IconWrapper>C</IconWrapper>;
}

export function ChevronDownIcon() {
  return <IconWrapper>⌄</IconWrapper>;
}

export function GridIcon() {
  return <IconWrapper>▦</IconWrapper>;
}

export function HorizontaLDots() {
  return <IconWrapper>⋯</IconWrapper>;
}

export function ListIcon() {
  return <IconWrapper>≡</IconWrapper>;
}

export function PageIcon() {
  return <IconWrapper>▤</IconWrapper>;
}

export function PieChartIcon() {
  return <IconWrapper>◔</IconWrapper>;
}

export function PlugInIcon() {
  return <IconWrapper>⎓</IconWrapper>;
}

export function TableIcon() {
  return <IconWrapper>▥</IconWrapper>;
}

export function UserCircleIcon() {
  return <IconWrapper>◉</IconWrapper>;
}
