import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Factory } from "@/data/mockFactories";
import { cn } from "@/lib/utils";
import { AlertTriangle, Building2, CheckCircle, Calendar, ShieldCheck } from "lucide-react";
import { RiskLevel } from "@/types/inspection";

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
    low: { bg: "#22c55e", border: "#16a34a" },
    medium: { bg: "#f59e0b", border: "#d97706" },
    high: { bg: "#ef4444", border: "#dc2626" },
  };

  const color = colors[riskLevel];
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative flex flex-col items-center">
        ${riskLevel === "high" ? '<span class="absolute w-10 h-10 rounded-full animate-ping" style="background: rgba(239, 68, 68, 0.3); bottom: 0; left: 50%; transform: translateX(-50%);"></span>' : ''}
        <div class="relative w-9 h-9 rounded-full flex items-center justify-center shadow-lg" style="background: ${color.bg}; border: 2px solid white;">
          <span class="text-xs font-bold text-white">${riskScore}</span>
          ${hasCriticalIssues ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border border-white rounded-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>' : ''}
        </div>
        <div class="w-0 h-0 -mt-0.5" style="border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 10px solid ${color.bg};"></div>
      </div>
    `,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
};

interface MapControllerProps {
  selectedFactory: Factory | null;
}

function MapController({ selectedFactory }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedFactory) {
      map.flyTo(
        [selectedFactory.coordinates.lat, selectedFactory.coordinates.lng],
        6,
        { duration: 1 }
      );
    }
  }, [selectedFactory, map]);

  return null;
}

interface LeafletMapProps {
  factories: Factory[];
  selectedFactory: Factory | null;
  onFactorySelect: (factory: Factory) => void;
}

export function LeafletMap({ factories, selectedFactory, onFactorySelect }: LeafletMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      scrollWheelZoom={true}
      className="w-full h-full rounded-b-lg z-0"
      style={{ background: "hsl(var(--muted))" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      <MapController selectedFactory={selectedFactory} />

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
            <div className="min-w-[240px] p-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{factory.name}</h3>
                  <p className="text-xs text-muted-foreground">{factory.supplierName}</p>
                </div>
                <div
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium text-white",
                    factory.riskLevel === "low" && "bg-success",
                    factory.riskLevel === "medium" && "bg-warning",
                    factory.riskLevel === "high" && "bg-destructive"
                  )}
                >
                  {factory.riskLevel.toUpperCase()}
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <Building2 className="h-3 w-3" />
                <span>{factory.location}, {factory.country}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-muted/50 rounded p-1.5">
                  <p className={cn(
                    "text-lg font-bold",
                    factory.riskLevel === "low" && "text-success",
                    factory.riskLevel === "medium" && "text-warning",
                    factory.riskLevel === "high" && "text-destructive"
                  )}>
                    {factory.riskScore}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Risk Score</p>
                </div>
                <div className="bg-muted/50 rounded p-1.5">
                  <p className="text-lg font-bold text-foreground">{factory.passRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Pass Rate</p>
                </div>
                <div className="bg-muted/50 rounded p-1.5">
                  <p className="text-lg font-bold text-foreground">{factory.totalInspections}</p>
                  <p className="text-[10px] text-muted-foreground">Inspections</p>
                </div>
              </div>

              {factory.criticalIssues > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-destructive mb-2">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{factory.criticalIssues} critical issue{factory.criticalIssues > 1 ? 's' : ''} pending</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Calendar className="h-3 w-3" />
                <span>Last inspection: {new Date(factory.lastInspectionDate).toLocaleDateString()}</span>
              </div>

              {factory.certifications.length > 0 && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 mt-0.5" />
                  <span>{factory.certifications.join(", ")}</span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
