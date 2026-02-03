import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Factory } from "@/data/mockFactories";
import { cn } from "@/lib/utils";
import { AlertTriangle, Building2, CheckCircle, Calendar, ShieldCheck } from "lucide-react";
import { RiskLevel } from "@/types/inspection";
import { MapStyle } from "./MapStyleToggle";

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Create custom marker icons based on risk level
const createRiskIcon = (riskLevel: RiskLevel, riskScore: number, hasCriticalIssues: boolean) => {
  const colors = {
    low: { bg: "#22c55e", border: "#16a34a", glow: "rgba(34, 197, 94, 0.4)" },
    medium: { bg: "#f59e0b", border: "#d97706", glow: "rgba(245, 158, 11, 0.4)" },
    high: { bg: "#ef4444", border: "#dc2626", glow: "rgba(239, 68, 68, 0.4)" },
  };

  const color = colors[riskLevel];
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative flex flex-col items-center group" style="filter: drop-shadow(0 4px 6px ${color.glow});">
        ${riskLevel === "high" ? `
          <span class="absolute w-12 h-12 rounded-full animate-ping" style="background: ${color.glow}; bottom: 4px; left: 50%; transform: translateX(-50%);"></span>
          <span class="absolute w-10 h-10 rounded-full animate-pulse" style="background: ${color.glow}; bottom: 8px; left: 50%; transform: translateX(-50%); opacity: 0.6;"></span>
        ` : ''}
        <div class="relative w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110" style="background: linear-gradient(135deg, ${color.bg}, ${color.border}); border: 3px solid white; box-shadow: 0 4px 12px ${color.glow};">
          <span class="text-xs font-bold text-white" style="text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${riskScore}</span>
          ${hasCriticalIssues ? `
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
              </svg>
            </div>
          ` : ''}
        </div>
        <div class="w-0 h-0 -mt-1" style="border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 12px solid white; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));"></div>
        <div class="w-0 h-0 -mt-3.5" style="border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 9px solid ${color.bg};"></div>
      </div>
    `,
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52],
  });
};

// Map tile URLs for different styles
const tileUrls: Record<MapStyle, { url: string; attribution: string }> = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
  }
};

interface MapControllerProps {
  selectedFactory: Factory | null;
  mapStyle: MapStyle;
}

function MapController({ selectedFactory, mapStyle }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedFactory) {
      map.flyTo(
        [selectedFactory.coordinates.lat, selectedFactory.coordinates.lng],
        8,
        { duration: 1.2 }
      );
    }
  }, [selectedFactory, map]);

  return null;
}

interface LeafletMapProps {
  factories: Factory[];
  selectedFactory: Factory | null;
  onFactorySelect: (factory: Factory) => void;
  mapStyle: MapStyle;
}

export function LeafletMap({ factories, selectedFactory, onFactorySelect, mapStyle }: LeafletMapProps) {
  const tile = tileUrls[mapStyle];

  return (
    <MapContainer
      center={[25, 10]}
      zoom={2.5}
      minZoom={2}
      maxZoom={18}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
      style={{ 
        background: mapStyle === "dark" ? "hsl(210 50% 8%)" : "hsl(210 20% 96%)",
        borderRadius: "0 0 0.5rem 0.5rem"
      }}
    >
      <TileLayer
        key={mapStyle}
        attribution={tile.attribution}
        url={tile.url}
      />
      
      <MapController selectedFactory={selectedFactory} mapStyle={mapStyle} />

      {factories.map((factory) => (
        <Marker
          key={factory.id}
          position={[factory.coordinates.lat, factory.coordinates.lng]}
          icon={createRiskIcon(factory.riskLevel, factory.riskScore, factory.criticalIssues > 0)}
          eventHandlers={{
            click: () => onFactorySelect(factory),
          }}
        >
          <Popup className="factory-popup">
            <div className="min-w-[260px] p-2">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{factory.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{factory.supplierName}</p>
                </div>
                <div
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-sm",
                    factory.riskLevel === "low" && "bg-gradient-to-r from-success to-emerald-600",
                    factory.riskLevel === "medium" && "bg-gradient-to-r from-warning to-amber-600",
                    factory.riskLevel === "high" && "bg-gradient-to-r from-destructive to-red-600"
                  )}
                >
                  {factory.riskLevel.toUpperCase()}
                </div>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 pb-3 border-b border-border">
                <Building2 className="h-3.5 w-3.5" />
                <span>{factory.location}, {factory.country}</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className={cn(
                    "text-xl font-bold",
                    factory.riskLevel === "low" && "text-success",
                    factory.riskLevel === "medium" && "text-warning",
                    factory.riskLevel === "high" && "text-destructive"
                  )}>
                    {factory.riskScore}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">Risk Score</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold text-foreground">{factory.passRate}%</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Pass Rate</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold text-foreground">{factory.totalInspections}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Inspections</p>
                </div>
              </div>

              {/* Critical Issues Alert */}
              {factory.criticalIssues > 0 && (
                <div className="flex items-center gap-2 text-xs text-destructive mb-3 p-2 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="font-medium">{factory.criticalIssues} critical issue{factory.criticalIssues > 1 ? 's' : ''} require attention</span>
                </div>
              )}

              {/* Meta Info */}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Last inspection: {new Date(factory.lastInspectionDate).toLocaleDateString()}</span>
                </div>

                {factory.certifications.length > 0 && (
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 mt-0.5 text-success" />
                    <span className="leading-relaxed">{factory.certifications.join(" • ")}</span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
