"use client";
import React from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import Link from "next/link";

const MenuItem = ({ title, open, onToggle, subItems = [] }) => {
  return (
    <>
      {/* Parent Item */}
      <li
        onClick={onToggle}
        className="mx-2 my-1 flex justify-between items-center cursor-pointer rounded-lg px-4 py-2.5 hover:bg-white/10 select-none text-white border border-transparent hover:border-emerald-300/30 transition"
      >
        <span className="text-sm font-semibold tracking-wide">{title}</span>
        <span className="text-xs font-bold opacity-80">
          {open ? <FaMinusCircle /> : <FaPlusCircle />}
        </span>
      </li>

      {/* Sub Items */}
      {open && (
        <ul className="mx-2 mb-2 rounded-lg bg-white/90 text-slate-800 border border-emerald-100 overflow-hidden">
          {subItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.to}
                onClick={(e) => e.stopPropagation()} // prevent toggle
                className="pl-6 pr-3 py-2.5 flex text-sm hover:bg-emerald-100 transition"
              >
                » {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MenuItem;
