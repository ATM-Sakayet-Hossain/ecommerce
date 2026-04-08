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
        className="flex justify-between items-center cursor-pointer px-4 py-1 hover:bg-secondary select-none text-xl border-y border-gray-200 text-white"
      >
        <span className="text-base font-semibold">{title}</span>
        <span className="text-base font-bold">
          {open ? <FaMinusCircle /> : <FaPlusCircle />}
        </span>
      </li>

      {/* Sub Items */}
      {open && (
        <ul className="bg-green-100 text-black">
          {subItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.to}
                onClick={(e) => e.stopPropagation()} // prevent toggle
                className="pl-6 py-2 flex text-sm hover:bg-green-200"
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