import type { GuidanceIntakeResponses } from "@/config/guidance";
import { formatGuidanceIntakeResponses } from "@/lib/guidance-intake";

type GuidanceIntakeSummaryProps = {
  intakeResponses: GuidanceIntakeResponses | unknown;
  className?: string;
  variant?: "light" | "dark";
};

export default function GuidanceIntakeSummary({
  intakeResponses,
  className = "",
  variant = "light",
}: GuidanceIntakeSummaryProps) {
  const rows = formatGuidanceIntakeResponses(intakeResponses as GuidanceIntakeResponses);
  if (!rows) return null;

  const isDark = variant === "dark";

  return (
    <div
      className={`rounded-lg border p-4 space-y-3 ${
        isDark
          ? "border-[#BD9958]/20 bg-[#27190B]/40"
          : "border-gray-200 bg-gray-50"
      } ${className}`}
    >
      <p
        className={`text-xs uppercase tracking-wider font-medium ${
          isDark ? "text-[#BD9958]/90" : "text-gray-500"
        }`}
      >
        Pre-call questionnaire
      </p>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className={`text-xs ${isDark ? "text-[#F5E6D3]/50" : "text-gray-500"}`}>
              {row.label}
            </dt>
            <dd className={`text-sm ${isDark ? "text-[#F5E6D3]/90" : "text-gray-800"}`}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
