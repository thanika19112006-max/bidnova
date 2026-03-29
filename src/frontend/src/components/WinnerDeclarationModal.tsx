import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface WinnerDeclarationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasBids: boolean;
  onToggleBids: () => void;
  winnerData: { item: string; highestBid: number; winner: string };
}

type Phase = "suspense" | "result";

export function WinnerDeclarationModal({
  isOpen,
  onClose,
  hasBids,
  onToggleBids,
  winnerData,
}: WinnerDeclarationModalProps) {
  const [phase, setPhase] = useState<Phase>("suspense");
  const [progress, setProgress] = useState(0);
  const prevIsOpen = useRef(false);

  // Reset & start suspense when modal opens
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setPhase("suspense");
      setProgress(0);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  // Progress bar + phase transition
  useEffect(() => {
    if (!isOpen || phase !== "suspense") return;

    const DURATION = 4000;
    const TICK = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += TICK;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        clearInterval(interval);
        setPhase("result");
      }
    }, TICK);

    return () => clearInterval(interval);
  }, [isOpen, phase]);

  // When toggling bids in result phase, re-trigger a short suspense
  const handleToggleBids = () => {
    onToggleBids();
    setPhase("suspense");
    setProgress(0);
    // Quick 1.5s suspense then reveal
    setTimeout(() => setPhase("result"), 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="winner-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(4, 8, 24, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            key="winner-card"
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 32 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "oklch(0.16 0.025 255)",
              border: "1px solid oklch(0.65 0.15 80 / 0.35)",
              boxShadow:
                "0 0 60px oklch(0.65 0.15 80 / 0.15), 0 25px 50px rgba(0,0,0,0.6)",
            }}
          >
            {/* Radial gold glow header */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 40% at 50% 0%, oklch(0.65 0.15 80 / 0.12) 0%, transparent 70%)",
              }}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              data-ocid="winner_modal.close_button"
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1.5"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-8">
              <AnimatePresence mode="wait">
                {phase === "suspense" ? (
                  <motion.div
                    key="suspense"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    {/* Pulsing trophy */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.2,
                        ease: "easeInOut",
                      }}
                      className="text-7xl mb-6 leading-none"
                    >
                      🏆
                    </motion.div>

                    <p
                      className="text-xl font-bold mb-3"
                      style={{ color: "oklch(0.92 0.12 80)" }}
                    >
                      Auction Ended
                    </p>

                    {/* Animated dots */}
                    <div className="flex items-center justify-center gap-1.5 mb-8">
                      <span className="text-gray-400 text-sm">
                        Declaring Winner
                      </span>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 0.8,
                            delay: i * 0.15,
                            ease: "easeInOut",
                          }}
                          className="inline-block text-gray-400 text-sm font-bold"
                        >
                          .
                        </motion.span>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "oklch(0.22 0.02 255)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background:
                            "linear-gradient(90deg, oklch(0.65 0.15 80), oklch(0.75 0.18 60))",
                        }}
                        transition={{ duration: 0.05 }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    className="text-center"
                  >
                    {hasBids ? (
                      <>
                        {/* Trophy */}
                        <motion.div
                          initial={{ scale: 0, rotate: -15 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 18,
                            delay: 0.05,
                          }}
                          className="text-7xl mb-4 leading-none"
                        >
                          🏆
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-xs uppercase tracking-widest font-semibold mb-2"
                          style={{ color: "oklch(0.60 0.05 255)" }}
                        >
                          Auction Ended
                        </motion.p>

                        <motion.h2
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-3xl font-bold mb-6"
                          style={{ color: "oklch(0.82 0.16 80)" }}
                        >
                          Winner Declared!
                        </motion.h2>

                        {/* Details card */}
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="rounded-xl p-4 mb-5 space-y-3 text-left"
                          style={{
                            background: "oklch(0.12 0.02 255)",
                            border: "1px solid oklch(0.65 0.15 80 / 0.2)",
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Item</span>
                            <span className="text-white font-semibold text-sm">
                              {winnerData.item}
                            </span>
                          </div>
                          <div
                            className="h-px"
                            style={{ background: "oklch(0.22 0.02 255)" }}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">
                              Winner
                            </span>
                            <span className="text-white font-bold text-sm">
                              {winnerData.winner}
                            </span>
                          </div>
                          <div
                            className="h-px"
                            style={{ background: "oklch(0.22 0.02 255)" }}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">
                              Winning Bid
                            </span>
                            <span
                              className="font-bold text-base"
                              style={{ color: "oklch(0.82 0.16 80)" }}
                            >
                              ${winnerData.highestBid.toLocaleString()}
                            </span>
                          </div>
                        </motion.div>

                        {/* Messages */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.28 }}
                          className="space-y-1.5 mb-6"
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "oklch(0.72 0.18 145)" }}
                          >
                            🎉 Congratulations! You won this auction.
                          </p>
                          <p className="text-gray-500 text-xs">
                            Auction ended. Better luck next time!
                          </p>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            delay: 0.05,
                          }}
                          className="text-7xl mb-5 leading-none"
                        >
                          😔
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-xs uppercase tracking-widest font-semibold mb-2"
                          style={{ color: "oklch(0.60 0.05 255)" }}
                        >
                          Auction Ended
                        </motion.p>

                        <motion.h2
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-2xl font-bold text-white mb-3"
                        >
                          No winner for this auction
                        </motion.h2>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-gray-500 text-sm mb-6"
                        >
                          No bids were placed for this item.
                        </motion.p>
                      </>
                    )}

                    {/* Toggle button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleBids}
                      data-ocid="winner_modal.toggle"
                      className="w-full text-xs font-semibold"
                      style={{
                        borderColor: "oklch(0.65 0.15 80 / 0.4)",
                        color: "oklch(0.82 0.16 80)",
                        background: "transparent",
                      }}
                    >
                      {hasBids ? "Switch to No Bids" : "Switch to With Bids"}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
