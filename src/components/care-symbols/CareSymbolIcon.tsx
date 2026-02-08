import React from "react";
import { cn } from "@/lib/utils";

interface CareSymbolIconProps {
  code: string;
  size?: number;
  className?: string;
}

/**
 * ISO 3758 textile care symbol renderer.
 * Renders proper SVG care label icons used on garment labels worldwide.
 */
export function CareSymbolIcon({ code, size = 40, className }: CareSymbolIconProps) {
  const svg = careSymbolSVGs[code];
  if (!svg) {
    return (
      <span className={cn("inline-flex items-center justify-center text-muted-foreground", className)} style={{ width: size, height: size }}>
        ?
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("flex-shrink-0", className)}
      aria-label={careSymbolDescriptions[code] || code}
      role="img"
    >
      {svg}
    </svg>
  );
}

// ─── WASH SYMBOLS (Washtub) ──────────────────────────────────────────
const WashtubBase = ({ children }: { children?: React.ReactNode }) => (
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {/* Tub body */}
    <path d="M10,28 L10,44 Q10,52 18,52 L46,52 Q54,52 54,44 L54,28 Z" />
    {/* Water line on top */}
    <path d="M6,28 Q12,24 18,28 Q24,32 30,28 Q36,24 42,28 Q48,32 54,28 Q58,25 60,28" strokeWidth="2.5" />
    {children}
  </g>
);

const WashTemp = ({ temp }: { temp: string }) => (
  <text x="32" y="44" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor" fontFamily="Arial, sans-serif" stroke="none">{temp}</text>
);

const WashDots = ({ count }: { count: number }) => {
  const positions = count === 1 ? [32] : count === 2 ? [26, 38] : [20, 32, 44];
  return (
    <>
      {positions.map((cx, i) => (
        <circle key={i} cx={cx} cy="40" r="2.5" fill="currentColor" stroke="none" />
      ))}
    </>
  );
};

const HandWashSymbol = () => (
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10,28 L10,44 Q10,52 18,52 L46,52 Q54,52 54,44 L54,28 Z" />
    <path d="M6,28 Q12,24 18,28 Q24,32 30,28 Q36,24 42,28 Q48,32 54,28 Q58,25 60,28" strokeWidth="2.5" />
    {/* Hand going into tub */}
    <path d="M32,10 L32,22 M26,14 Q32,8 38,14" strokeWidth="2.5" />
  </g>
);

const CrossOut = () => (
  <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="10" y1="8" x2="54" y2="56" />
    <line x1="54" y1="8" x2="10" y2="56" />
  </g>
);

// ─── BLEACH SYMBOLS (Triangle) ──────────────────────────────────────
const TriangleBase = ({ children }: { children?: React.ReactNode }) => (
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="32,8 6,56 58,56" />
    {children}
  </g>
);

// ─── TUMBLE DRY SYMBOLS (Square + Circle) ───────────────────────────
const TumbleDryBase = ({ children }: { children?: React.ReactNode }) => (
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="48" height="48" rx="3" />
    <circle cx="32" cy="32" r="18" />
    {children}
  </g>
);

// ─── IRON SYMBOLS ───────────────────────────────────────────────────
const IronBase = ({ children }: { children?: React.ReactNode }) => (
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {/* Iron body shape */}
    <path d="M12,24 L12,40 Q12,48 20,48 L52,48 Q56,48 56,44 L56,36 Q56,24 44,20 L24,20 Q12,20 12,24 Z" />
    {/* Handle */}
    <path d="M18,20 Q18,12 26,12 L42,12 Q46,12 46,16 L46,20" />
    {children}
  </g>
);

const IronDots = ({ count }: { count: number }) => {
  const positions = count === 1 ? [34] : count === 2 ? [28, 40] : [22, 34, 46];
  return (
    <>
      {positions.map((cx, i) => (
        <circle key={i} cx={cx} cy="36" r="2.5" fill="currentColor" stroke="none" />
      ))}
    </>
  );
};

// ─── DRY CLEAN SYMBOLS (Circle) ─────────────────────────────────────
const DryCleanBase = ({ children }: { children?: React.ReactNode }) => (
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="32" r="24" />
    {children}
  </g>
);

// ─── NATURAL DRY SYMBOLS (Square) ───────────────────────────────────
const SquareBase = ({ children }: { children?: React.ReactNode }) => (
  <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="48" height="48" rx="3" />
    {children}
  </g>
);

// ═══════════════════════════════════════════════════════════════════════
// SVG lookup by care symbol code
// ═══════════════════════════════════════════════════════════════════════
const careSymbolSVGs: Record<string, React.ReactNode> = {
  // WASH
  W30: <WashtubBase><WashTemp temp="30" /></WashtubBase>,
  W40: <WashtubBase><WashTemp temp="40" /></WashtubBase>,
  W50: <WashtubBase><WashTemp temp="50" /></WashtubBase>,
  W60: <WashtubBase><WashTemp temp="60" /></WashtubBase>,
  W70: <WashtubBase><WashTemp temp="70" /></WashtubBase>,
  W95: <WashtubBase><WashTemp temp="95" /></WashtubBase>,
  HW: <HandWashSymbol />,
  DNW: (
    <g>
      <WashtubBase />
      <CrossOut />
    </g>
  ),

  // BLEACH
  BL: <TriangleBase />,
  NCB: (
    <TriangleBase>
      <line x1="20" y1="34" x2="44" y2="34" stroke="currentColor" strokeWidth="2.5" />
      <line x1="20" y1="42" x2="44" y2="42" stroke="currentColor" strokeWidth="2.5" />
    </TriangleBase>
  ),
  DNB: (
    <g>
      <TriangleBase />
      <CrossOut />
    </g>
  ),

  // TUMBLE DRY
  TDL: (
    <TumbleDryBase>
      <circle cx="32" cy="38" r="3" fill="currentColor" stroke="none" />
    </TumbleDryBase>
  ),
  TDN: (
    <TumbleDryBase>
      <circle cx="26" cy="38" r="3" fill="currentColor" stroke="none" />
      <circle cx="38" cy="38" r="3" fill="currentColor" stroke="none" />
    </TumbleDryBase>
  ),
  TDH: (
    <TumbleDryBase>
      <circle cx="20" cy="38" r="3" fill="currentColor" stroke="none" />
      <circle cx="32" cy="38" r="3" fill="currentColor" stroke="none" />
      <circle cx="44" cy="38" r="3" fill="currentColor" stroke="none" />
    </TumbleDryBase>
  ),
  DNTD: (
    <g>
      <TumbleDryBase />
      <CrossOut />
    </g>
  ),

  // IRON
  IL: <IronBase><IronDots count={1} /></IronBase>,
  IM: <IronBase><IronDots count={2} /></IronBase>,
  IH: <IronBase><IronDots count={3} /></IronBase>,
  DNI: (
    <g>
      <IronBase />
      <CrossOut />
    </g>
  ),

  // DRY CLEAN
  DC: (
    <DryCleanBase>
      <text x="32" y="38" textAnchor="middle" fontSize="18" fontWeight="600" fill="currentColor" fontFamily="Arial, sans-serif" stroke="none">P</text>
    </DryCleanBase>
  ),
  DCF: (
    <DryCleanBase>
      <text x="32" y="38" textAnchor="middle" fontSize="18" fontWeight="600" fill="currentColor" fontFamily="Arial, sans-serif" stroke="none">F</text>
    </DryCleanBase>
  ),
  DNDC: (
    <g>
      <DryCleanBase />
      <CrossOut />
    </g>
  ),

  // LINE DRY / FLAT DRY (natural drying)
  LD: (
    <SquareBase>
      <line x1="32" y1="16" x2="32" y2="48" stroke="currentColor" strokeWidth="2.5" />
    </SquareBase>
  ),
  FD: (
    <SquareBase>
      <line x1="16" y1="32" x2="48" y2="32" stroke="currentColor" strokeWidth="2.5" />
    </SquareBase>
  ),
};

// Human-readable descriptions for each code
const careSymbolDescriptions: Record<string, string> = {
  W30: "Machine wash at 30°C",
  W40: "Machine wash at 40°C",
  W50: "Machine wash at 50°C",
  W60: "Machine wash at 60°C",
  W70: "Machine wash at 70°C",
  W95: "Machine wash at 95°C",
  HW: "Hand wash only",
  DNW: "Do not wash",
  BL: "Bleach allowed",
  NCB: "Non-chlorine bleach only",
  DNB: "Do not bleach",
  TDL: "Tumble dry low",
  TDN: "Tumble dry normal",
  TDH: "Tumble dry high",
  DNTD: "Do not tumble dry",
  IL: "Iron low (110°C)",
  IM: "Iron medium (150°C)",
  IH: "Iron high (200°C)",
  DNI: "Do not iron",
  DC: "Dry clean (perchloroethylene)",
  DCF: "Dry clean (petroleum solvent)",
  DNDC: "Do not dry clean",
  LD: "Line dry",
  FD: "Flat dry",
};

export { careSymbolDescriptions };
