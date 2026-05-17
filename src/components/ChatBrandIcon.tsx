type ChatBrandIconProps = {
  className?: string;
  size?: number;
  variant?: "fab" | "avatar";
};

/** Icône CMA — couleurs via variables CSS du thème */
export function ChatBrandIcon({ className = "", size = 40, variant = "fab" }: ChatBrandIconProps) {
  const compact = variant === "avatar";

  return (
    <svg
      className={`chat-brand-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx={compact ? 10 : 12}
        className="chat-brand-icon__bg"
      />
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx={compact ? 10 : 12}
        className="chat-brand-icon__ring"
        strokeWidth="1.5"
        fill="none"
      />

      {!compact && (
        <>
          <path
            className="chat-brand-icon__orbit"
            d="M24 8 L28 14 L22 14 Z"
            fill="var(--accent)"
            opacity="0.85"
          />
          <circle className="chat-brand-icon__dot chat-brand-icon__dot--a" cx="38" cy="14" r="2" fill="var(--accent-2)" />
          <circle className="chat-brand-icon__dot chat-brand-icon__dot--b" cx="10" cy="34" r="1.5" fill="var(--accent)" />
        </>
      )}

      <text
        x="24"
        y={compact ? "27" : "28"}
        textAnchor="middle"
        className="chat-brand-icon__letters"
        fontSize={compact ? "11" : "12"}
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
      >
        CMA
      </text>

      <text
        x="24"
        y={compact ? "36" : "37"}
        textAnchor="middle"
        className="chat-brand-icon__code"
        fontSize="7"
        fontFamily="ui-monospace, monospace"
      >
        {"</>"}
      </text>

      <g className={`chat-brand-icon__ia ${compact ? "chat-brand-icon__ia--compact" : ""}`}>
        <rect
          className="chat-brand-icon__ia-bg"
          x={compact ? 16 : 22}
          y={compact ? 27 : 26}
          width={compact ? 18 : 24}
          height={compact ? 12 : 15}
          rx={compact ? 4 : 5}
        />
        <text
          className="chat-brand-icon__ia-label"
          x={compact ? 25 : 34}
          y={compact ? 35.5 : 37.5}
          textAnchor="middle"
          fontSize={compact ? "8" : "10.5"}
          fontWeight="800"
          fontFamily="ui-monospace, monospace"
        >
          IA
        </text>
      </g>
    </svg>
  );
}
