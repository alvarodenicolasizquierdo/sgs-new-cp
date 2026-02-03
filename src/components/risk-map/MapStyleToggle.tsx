import { motion } from "framer-motion";
import { Map, Satellite, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export type MapStyle = "light" | "dark" | "satellite";

interface MapStyleToggleProps {
  currentStyle: MapStyle;
  onStyleChange: (style: MapStyle) => void;
}

const styles: { id: MapStyle; label: string; icon: typeof Map }[] = [
  { id: "light", label: "Light", icon: Map },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "satellite", label: "Satellite", icon: Satellite },
];

export function MapStyleToggle({ currentStyle, onStyleChange }: MapStyleToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
      className={cn(
        "absolute bottom-4 right-4 z-[1000]",
        "bg-card/95 backdrop-blur-md",
        "border border-border rounded-xl p-1.5 shadow-xl",
        "flex gap-1"
      )}
    >
      {styles.map((style) => (
        <motion.button
          key={style.id}
          onClick={() => onStyleChange(style.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-2 rounded-lg",
            "text-xs font-medium transition-colors",
            currentStyle === style.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <style.icon className="h-3.5 w-3.5" />
          <span>{style.label}</span>
          
          {currentStyle === style.id && (
            <motion.div
              layoutId="activeMapStyle"
              className="absolute inset-0 bg-primary rounded-lg -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}
