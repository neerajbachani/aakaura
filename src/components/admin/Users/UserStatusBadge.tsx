"use client";

interface UserStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export default function UserStatusBadge({ isActive, className = "" }: UserStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive 
        ? "bg-green-100 text-green-800" 
        : "bg-red-100 text-red-800"
    } ${className}`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}