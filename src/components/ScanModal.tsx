import { useEffect, useState } from "react";
import { X, ScanLine, Zap } from "lucide-react";
import { useApp } from "@/store/useApp";
import { toast } from "sonner";

const ScanModal = ({ onClose }: { onClose: () => void }) => {
  const addItem = useApp((s) => s.addItem);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      addItem({
        id: `scan-${Date.now()}`,
        name: "Keso",
        category: "Mejeri",
        icon: "🧀",
        daysToExpiry: 2,
      });
      toast.success("Vara skannad och tillagd!", {
        description: "Keso · går ut om 2 dagar",
      });
      setScanning(false);
      onClose();
    }, 900);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black text-white animate-scale-in">
      {/* Viewfinder */}
      <div className="relative flex-1 overflow-hidden">
        {/* Fake camera feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,#10B981_0%,transparent_40%),radial-gradient(circle_at_70%_80%,#f59e0b_0%,transparent_40%)]" />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-5 pt-12">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md active:scale-95 transition-transform"
            aria-label="Stäng"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-sm font-semibold">Skanna vara</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
            <Zap className="h-4 w-4" />
          </div>
        </div>

        {/* Reticle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-60 w-60">
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl",
            ].map((c) => (
              <div
                key={c}
                className={`absolute h-10 w-10 border-primary ${c}`}
              />
            ))}
            {/* Scanline */}
            <div
              className={`absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_12px_#10B981] ${
                scanning ? "animate-[scan_1s_ease-in-out_infinite]" : ""
              }`}
              style={{ top: scanning ? undefined : "50%" }}
            />
            <ScanLine className="absolute inset-0 m-auto h-12 w-12 text-white/20" />
          </div>
        </div>

        <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-white/70">
          Rikta kameran mot streckkoden eller bäst-före-datumet
        </p>
      </div>

      {/* Bottom action */}
      <div className="bg-black px-5 pb-10 pt-6">
        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full rounded-2xl bg-primary py-4 text-[15px] font-semibold text-primary-foreground active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {scanning ? "Skannar..." : "Simulera kameraskanning"}
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 6%; }
          50% { top: 94%; }
          100% { top: 6%; }
        }
      `}</style>
    </div>
  );
};

export default ScanModal;
