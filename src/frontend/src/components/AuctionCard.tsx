import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import type { Auction } from "../data/mockData";
import { CountdownTimer } from "./CountdownTimer";

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const navigate = useNavigate();
  const isEndingSoon = auction.endTime.getTime() - Date.now() < 3600 * 1000;
  const isCompleted = auction.status === "completed";

  return (
    <div className="bg-navy-card rounded-2xl overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-gold/10 transition-all duration-300 hover:-translate-y-1 border border-navy-surface">
      <div className="relative overflow-hidden">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {isEndingSoon && !isCompleted && (
            <Badge className="bg-red-500 text-white text-xs border-0">
              Ending Soon
            </Badge>
          )}
          {auction.bidsCount > 20 && !isCompleted && (
            <Badge className="bg-blue-500 text-white text-xs border-0">
              Trending
            </Badge>
          )}
          {isCompleted && (
            <Badge className="bg-green-600 text-white text-xs border-0">
              Completed
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 leading-snug">
          {auction.title}
        </h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-1">
          {auction.category}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
              Current Bid
            </p>
            <p className="text-gold font-bold text-xl">
              ${auction.currentBid.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs mb-0.5">
              {auction.bidsCount} bids
            </p>
            {!isCompleted ? (
              <CountdownTimer endTime={auction.endTime} />
            ) : (
              <span className="text-green-400 text-xs font-medium">
                Winner: {auction.winner}
              </span>
            )}
          </div>
        </div>
        {!isCompleted ? (
          <Button
            onClick={() =>
              navigate({ to: "/liveauction/$id", params: { id: auction.id } })
            }
            data-ocid="auction_card.primary_button"
            className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold text-sm mt-auto"
          >
            Place Bid
          </Button>
        ) : (
          <Button
            onClick={() =>
              navigate({ to: "/liveauction/$id", params: { id: auction.id } })
            }
            variant="outline"
            className="w-full border-gold/30 text-gold hover:bg-navy-surface text-sm mt-auto"
          >
            View Results
          </Button>
        )}
      </div>
    </div>
  );
}
