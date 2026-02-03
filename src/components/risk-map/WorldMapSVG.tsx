export function WorldMapSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 500"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Ocean background */}
      <rect width="1000" height="500" fill="hsl(var(--muted) / 0.3)" />
      
      {/* Simplified but more detailed world continents */}
      <g fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5">
        {/* North America */}
        <path d="M45,60 L120,40 L180,35 L220,45 L260,70 L280,100 L285,130 L270,155 L250,175 L225,190 L195,200 L165,195 L140,180 L115,175 L95,165 L80,150 L60,145 L45,130 L35,105 L40,80 Z" />
        <path d="M200,195 L230,205 L245,225 L235,245 L210,250 L190,240 L185,220 L190,205 Z" />
        
        {/* Central America & Caribbean */}
        <path d="M175,215 L195,220 L210,235 L205,255 L185,265 L165,255 L160,240 L165,225 Z" />
        <path d="M220,225 L235,230 L240,240 L230,250 L215,245 Z" />
        
        {/* South America */}
        <path d="M210,265 L240,260 L275,275 L290,310 L285,350 L270,390 L250,420 L225,445 L200,450 L180,435 L170,400 L175,360 L185,320 L195,290 Z" />
        
        {/* Greenland */}
        <path d="M310,30 L360,25 L390,40 L395,70 L380,95 L345,100 L315,85 L305,55 Z" />
        
        {/* Iceland */}
        <path d="M395,75 L415,70 L425,80 L420,92 L405,95 L395,85 Z" />
        
        {/* UK & Ireland */}
        <path d="M420,110 L435,105 L445,115 L442,130 L430,140 L418,135 L415,120 Z" />
        <path d="M405,115 L415,112 L418,125 L410,132 L402,125 Z" />
        
        {/* Europe */}
        <path d="M445,85 L490,80 L530,90 L560,100 L580,115 L590,135 L585,155 L570,170 L545,175 L520,170 L495,165 L470,155 L450,145 L440,125 L442,105 Z" />
        <path d="M445,145 L465,150 L475,165 L468,180 L450,185 L438,175 L440,160 Z" />
        <path d="M475,170 L495,175 L505,190 L498,205 L480,210 L468,195 L470,180 Z" />
        
        {/* Scandinavia */}
        <path d="M470,55 L495,45 L520,50 L535,70 L530,95 L510,105 L485,100 L465,85 L460,65 Z" />
        
        {/* Russia */}
        <path d="M560,60 L620,50 L700,55 L780,65 L850,80 L900,100 L920,120 L915,145 L890,160 L840,165 L780,160 L720,150 L660,140 L610,135 L575,125 L560,100 Z" />
        
        {/* Africa */}
        <path d="M440,200 L480,190 L520,195 L555,210 L580,240 L590,280 L585,330 L570,375 L545,410 L505,430 L465,435 L430,420 L410,390 L405,350 L410,300 L420,260 L430,225 Z" />
        
        {/* Middle East */}
        <path d="M555,165 L590,155 L620,165 L640,185 L635,210 L615,225 L585,230 L560,220 L550,195 L552,175 Z" />
        
        {/* India */}
        <path d="M640,195 L675,185 L705,195 L720,225 L710,265 L685,295 L655,305 L630,290 L625,255 L630,220 Z" />
        
        {/* Southeast Asia */}
        <path d="M720,230 L755,220 L785,235 L795,265 L785,295 L755,310 L725,305 L710,280 L715,250 Z" />
        
        {/* China */}
        <path d="M720,120 L775,105 L830,115 L865,135 L875,165 L860,195 L825,210 L780,205 L740,190 L715,170 L710,140 Z" />
        
        {/* Japan */}
        <path d="M880,145 L900,140 L915,155 L910,175 L895,185 L875,180 L870,165 Z" />
        
        {/* Korea */}
        <path d="M855,155 L870,150 L878,165 L872,180 L858,182 L852,170 Z" />
        
        {/* Indonesia */}
        <path d="M735,320 L780,310 L820,320 L850,335 L845,355 L810,365 L765,360 L735,345 Z" />
        <path d="M820,340 L855,335 L880,350 L875,370 L845,375 L820,360 Z" />
        
        {/* Philippines */}
        <path d="M830,265 L850,260 L862,275 L858,295 L842,300 L828,290 Z" />
        
        {/* Australia */}
        <path d="M780,380 L840,365 L895,375 L935,400 L950,440 L935,475 L890,490 L835,485 L790,465 L770,430 L775,395 Z" />
        
        {/* New Zealand */}
        <path d="M950,455 L965,448 L975,460 L972,478 L958,485 L948,472 Z" />
        <path d="M940,480 L955,475 L962,490 L955,500 L942,495 Z" />
        
        {/* Taiwan */}
        <path d="M850,215 L862,210 L868,225 L862,238 L850,235 Z" />
        
        {/* Sri Lanka */}
        <path d="M665,305 L680,300 L688,315 L682,328 L668,325 Z" />
        
        {/* Madagascar */}
        <path d="M575,385 L595,375 L605,395 L600,425 L580,435 L565,420 L568,395 Z" />
      </g>
      
      {/* Grid lines for reference */}
      <g stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.4" strokeDasharray="3,3">
        {/* Latitude lines */}
        {[100, 200, 250, 300, 400].map((y) => (
          <line key={`lat-${y}`} x1="0" y1={y} x2="1000" y2={y} />
        ))}
        {/* Longitude lines */}
        {[125, 250, 375, 500, 625, 750, 875].map((x) => (
          <line key={`lng-${x}`} x1={x} y1="0" x2={x} y2="500" />
        ))}
      </g>
      
      {/* Equator - slightly more visible */}
      <line x1="0" y1="250" x2="1000" y2="250" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
