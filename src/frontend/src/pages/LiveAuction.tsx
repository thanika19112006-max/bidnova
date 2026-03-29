import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Gavel,
  Shield,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CountdownTimer } from "../components/CountdownTimer";
import { WinnerDeclarationModal } from "../components/WinnerDeclarationModal";
import { useAuctions } from "../context/AuctionContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const BOT_NAMES = [
  "Bidder_742",
  "Bidder_189",
  "Bidder_563",
  "Bidder_921",
  "Bidder_314",
  "Bidder_875",
  "Bidder_047",
  "Bidder_662",
  "Bidder_208",
  "Bidder_491",
];

const dummyWinner = { item: "Camera", highestBid: 15000, winner: "John Doe" };

function randomBot() {
  return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
}

function formatTimeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function LiveAuction() {
  const params = useParams({ strict: false });
  const auctionId = (params as { id?: string }).id ?? "";
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { getAuction, dispatch } = useAuctions();
  const auction = getAuction(auctionId);

  const [bidAmount, setBidAmount] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const [antiSnipeAlert, setAntiSnipeAlert] = useState(false);
  const [, forceRender] = useState(0);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [hasBids, setHasBids] = useState(true);
  const isWinningRef = useRef(isWinning);
  isWinningRef.current = isWinning;

  // Re-render every second for time display
  useEffect(() => {
    const t = setInterval(() => forceRender((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Bot simulation
  const runBotBid = useCallback(() => {
    const currentAuction = getAuction(auctionId);
    if (!currentAuction || currentAuction.status !== "active") return;
    if (Math.random() > 0.15) return;
    const multiplier = 1.05 + Math.random() * 0.1;
    const botAmount = Math.ceil(currentAuction.currentBid * multiplier);
    const botName = randomBot();
    dispatch({
      type: "PLACE_BID",
      auctionId,
      bidder: botName,
      amount: botAmount,
    });
    if (isWinningRef.current) {
      setIsWinning(false);
      toast.warning(`⚠️ You've been outbid on "${currentAuction.title}"!`, {
        duration: 4000,
      });
    }
  }, [auctionId, getAuction, dispatch]);

  useEffect(() => {
    const interval = setInterval(runBotBid, 3000);
    return () => clearInterval(interval);
  }, [runBotBid]);

  // Auto-show winner modal when timer hits zero — must be before early return
  useEffect(() => {
    if (!auction) return;
    const timeLeft = auction.endTime.getTime() - Date.now();
    const active = auction.status === "active";
    if (timeLeft <= 0 && active) {
      const t = setTimeout(() => setShowWinnerModal(true), 500);
      return () => clearTimeout(t);
    }
  });

  if (!auction) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <Gavel className="h-16 w-16 text-gold mx-auto mb-4 opacity-50" />
          <p className="text-white font-semibold mb-2">Auction not found</p>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-gold text-navy font-bold"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isActive = auction.status === "active";
  const timeRemaining = auction.endTime.getTime() - Date.now();
  const isEndingSoon = timeRemaining < 5 * 60 * 1000 && timeRemaining > 0;
  const isLast30s = timeRemaining < 30 * 1000 && timeRemaining > 0;
  const minBid = auction.currentBid + 1;

  const placeBid = async () => {
    const token = localStorage.getItem("auth_token");
    if (!identity && !token) {
      toast.error("Please log in to place a bid");
      navigate({ to: "/login" });
      return;
    }
    const amount = Number.parseFloat(bidAmount);
    if (Number.isNaN(amount) || amount < minBid) {
      toast.error(`Minimum bid is $${minBid.toLocaleString()}`);
      return;
    }

    if (isLast30s) {
      dispatch({ type: "EXTEND_AUCTION", auctionId, seconds: 60 });
      setAntiSnipeAlert(true);
      setTimeout(() => setAntiSnipeAlert(false), 5000);
    }

    setIsPlacing(true);
    await new Promise((r) => setTimeout(r, 700));

    const username = identity
      ? identity.getPrincipal().toString().slice(0, 8)
      : (JSON.parse(localStorage.getItem("auth_user") ?? "{}")?.username ??
        "You");

    dispatch({ type: "PLACE_BID", auctionId, bidder: username, amount });
    setIsWinning(true);
    toast.success(
      `🎉 You are the highest bidder! $${amount.toLocaleString()}`,
      { duration: 5000 },
    );
    setBidAmount("");
    setIsPlacing(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      {/* Sub-header */}
      <div className="bg-navy border-b border-navy-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to auctions
          </button>
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
            <Badge className="bg-navy-surface text-gray-300 border-navy-light text-xs">
              {auction.category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT — Image + Details */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {isEndingSoon && isActive && (
                    <Badge className="bg-red-500 text-white border-0 text-xs">
                      ⏰ Ending Soon
                    </Badge>
                  )}
                  {auction.bidsCount > 20 && isActive && (
                    <Badge className="bg-blue-500 text-white border-0 text-xs">
                      🔥 Trending
                    </Badge>
                  )}
                  {!isActive && (
                    <Badge className="bg-green-600 text-white border-0">
                      {auction.status === "completed"
                        ? "Completed"
                        : "Cancelled"}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-navy-card rounded-2xl border border-navy-surface p-6"
            >
              <p className="text-xs text-gold uppercase tracking-widest font-semibold mb-1">
                {auction.category}
              </p>
              <h1 className="font-display text-2xl font-bold text-white mb-3">
                {auction.title}
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {auction.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gold" />
                  <span>{auction.bidsCount} bids placed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  <span>Base: ${auction.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-gold" />
                  <span>Anti-sniping enabled</span>
                </div>
              </div>
            </motion.div>

            {/* Bid History Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-navy-card rounded-2xl border border-navy-surface overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-navy-surface">
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-gold" />
                  <h3 className="text-white font-semibold text-sm">
                    Bid History
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  {auction.bids.length} bids
                </span>
              </div>
              <ScrollArea className="h-56">
                <div className="p-3 space-y-1" data-ocid="live_auction.list">
                  <AnimatePresence initial={false}>
                    {auction.bids.length === 0 ? (
                      <div
                        data-ocid="live_auction.empty_state"
                        className="text-center py-8 text-gray-500 text-sm"
                      >
                        No bids yet — be the first!
                      </div>
                    ) : (
                      auction.bids.map((bid, idx) => (
                        <motion.div
                          key={bid.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25 }}
                          data-ocid={`live_auction.item.${idx + 1}`}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-navy-surface transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-gold text-xs font-bold">
                                {bid.maskedBidder[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white text-xs font-medium">
                                {bid.maskedBidder}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {formatTimeAgo(bid.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold text-sm ${idx === 0 ? "text-gold" : "text-gray-300"}`}
                            >
                              ${bid.amount.toLocaleString()}
                            </p>
                            {idx === 0 && (
                              <p className="text-xs text-gold/70">Highest</p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          {/* RIGHT — Bidding Panel */}
          <div className="space-y-4">
            {/* Current Bid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-navy-card rounded-2xl border border-navy-surface p-6"
            >
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                Current Highest Bid
              </p>
              <motion.p
                key={auction.currentBid}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-bold mb-2"
                style={{ color: "#D4B04C" }}
              >
                ${auction.currentBid.toLocaleString()}
              </motion.p>
              {auction.highestBidder && isActive && (
                <p className="text-gray-500 text-xs">
                  Highest bidder:{" "}
                  <span className="text-gray-300 font-medium">
                    {auction.highestBidder.startsWith("Bidder_")
                      ? auction.highestBidder
                      : `${auction.highestBidder.slice(0, 6)}...`}
                  </span>
                </p>
              )}
            </motion.div>

            {/* Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-navy-card rounded-2xl border p-6 ${
                isEndingSoon
                  ? "border-red-500/50 bg-red-950/20"
                  : "border-navy-surface"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock
                  className={`h-4 w-4 ${isEndingSoon ? "text-red-400" : "text-gold"}`}
                />
                <p className="text-gray-400 text-xs uppercase tracking-widest">
                  Time Remaining
                </p>
              </div>
              {isActive ? (
                <CountdownTimer endTime={auction.endTime} large />
              ) : (
                <span className="text-red-400 text-2xl font-mono font-bold">
                  Auction Ended
                </span>
              )}
              {isEndingSoon && isActive && (
                <p className="text-yellow-400 text-xs mt-3 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Anti-sniping active — bids in last 30s extend auction by 60s
                </p>
              )}
            </motion.div>

            {/* Anti-snipe alert */}
            <AnimatePresence>
              {antiSnipeAlert && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-yellow-500/10 border border-yellow-500/40 rounded-2xl px-5 py-4 flex items-center gap-3"
                >
                  <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <p className="text-yellow-300 text-sm font-medium">
                    ⚡ Auction extended! 60 seconds added.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Winning banner */}
            <AnimatePresence>
              {isWinning && isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-2xl px-5 py-4 flex items-center gap-3"
                  data-ocid="live_auction.success_state"
                >
                  <Trophy className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm font-medium">
                    🎉 You are the highest bidder!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Place Bid */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-navy-card rounded-2xl border border-navy-surface p-6"
              >
                <h3 className="text-white font-bold mb-1 text-lg">
                  Place Your Bid
                </h3>
                <p className="text-gray-500 text-xs mb-4">
                  Minimum bid:{" "}
                  <span className="text-gold font-semibold">
                    ${minBid.toLocaleString()}
                  </span>
                </p>
                <div className="flex gap-3 mb-3">
                  <Input
                    type="number"
                    min={minBid}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && placeBid()}
                    placeholder={`$${minBid.toLocaleString()} or more`}
                    data-ocid="live_auction.input"
                    className="flex-1 bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold focus-visible:ring-2 text-base h-12"
                  />
                  <Button
                    onClick={placeBid}
                    disabled={isPlacing}
                    data-ocid="live_auction.primary_button"
                    className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 h-12 text-base"
                  >
                    {isPlacing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        Placing...
                      </span>
                    ) : (
                      "Place Bid"
                    )}
                  </Button>
                </div>
                <p className="text-gray-600 text-xs">
                  By placing a bid, you agree to purchase this item if you win.
                </p>
              </motion.div>
            )}

            {/* Quick bid */}
            {isActive && (
              <div className="bg-navy-card rounded-2xl border border-navy-surface p-4">
                <p className="text-gray-500 text-xs mb-3 uppercase tracking-wide">
                  Quick Bid
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    minBid,
                    Math.round(minBid * 1.05),
                    Math.round(minBid * 1.1),
                  ].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setBidAmount(String(amount))}
                      className="border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-xs font-semibold py-2 rounded-lg"
                    >
                      +${(amount - auction.currentBid).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Winner Banner (inline, for completed auctions) */}
            {!isActive && auction.status === "completed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/40 rounded-2xl p-8 text-center"
                data-ocid="live_auction.success_state"
              >
                <div className="text-5xl mb-3">🏆</div>
                <p className="font-display text-gold font-bold text-2xl mb-1">
                  Auction Completed!
                </p>
                {auction.winner && (
                  <p className="text-gray-300 text-sm mt-2">
                    Winner:{" "}
                    <span className="text-white font-bold">
                      {auction.winner}
                    </span>
                  </p>
                )}
                <p className="text-gold font-semibold text-xl mt-2">
                  Final bid: ${auction.currentBid.toLocaleString()}
                </p>
                <Button
                  onClick={() => navigate({ to: "/" })}
                  className="mt-5 bg-gold hover:bg-gold-dark text-navy font-bold"
                >
                  Browse More Auctions
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Winner Declaration Modal */}
      <WinnerDeclarationModal
        isOpen={showWinnerModal}
        onClose={() => setShowWinnerModal(false)}
        hasBids={hasBids}
        onToggleBids={() => setHasBids((prev) => !prev)}
        winnerData={dummyWinner}
      />
    </div>
  );
}
