import { CircleDot } from "lucide-react";

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium ${
        status === "active"
          ? "bg-green-100 text-green-700 border border-green-700"
          : status === "inactive"
          ? "bg-gray-100 text-gray-700 border border-gray-700"
          : "bg-yellow-100 text-yellow-700 border border-yellow-700"
      }`}
    >
      <CircleDot className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

