import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CountdownTimer } from "../components/CountdownTimer";
import { mockAuctions, mockMyBids } from "../data/mockData";

export default function MyBidding() {
  const navigate = useNavigate();

  const statusConfig = {
    winning: { label: "Winning", className: "bg-green-500/20 text-green-400" },
    outbid: { label: "Outbid", className: "bg-red-500/20 text-red-400" },
    won: { label: "Won", className: "bg-gold/20 text-gold" },
    lost: { label: "Lost", className: "bg-gray-500/20 text-gray-400" },
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      <div className="bg-navy border-b border-navy-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-2xl font-bold text-white">
            My Bidding History
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track all your bids and auction outcomes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bids", value: mockMyBids.length },
            {
              label: "Winning",
              value: mockMyBids.filter((b) => b.status === "winning").length,
            },
            {
              label: "Outbid",
              value: mockMyBids.filter((b) => b.status === "outbid").length,
            },
            {
              label: "Won",
              value: mockMyBids.filter((b) => b.status === "won").length,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-navy-card rounded-xl border border-navy-surface p-4 text-center"
            >
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <div
          className="bg-navy-card rounded-2xl border border-navy-surface overflow-hidden"
          data-ocid="my_bidding.table"
        >
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-navy-surface text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Item</span>
            <span>My Bid</span>
            <span>Current Bid</span>
            <span>Status</span>
            <span>Time Left</span>
          </div>
          {mockMyBids.map((bid, i) => {
            const auction = mockAuctions.find((a) => a.id === bid.auctionId);
            const cfg = statusConfig[bid.status];
            return (
              <div
                key={bid.id}
                data-ocid={`my_bidding.item.${i + 1}`}
                className={`grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] grid-cols-1 gap-3 md:gap-4 px-6 py-4 items-center hover:bg-navy-surface cursor-pointer transition-colors ${
                  i < mockMyBids.length - 1
                    ? "border-b border-navy-surface"
                    : ""
                }`}
                onClick={() =>
                  navigate({
                    to: "/liveauction/$id",
                    params: { id: bid.auctionId },
                  })
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  navigate({
                    to: "/liveauction/$id",
                    params: { id: bid.auctionId },
                  })
                }
              >
                <div className="flex items-center gap-3">
                  <img
                    src={bid.auctionImage}
                    alt={bid.auctionTitle}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      {bid.auctionTitle}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {bid.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 md:hidden">My Bid</p>
                  <p
                    className={`font-bold text-sm ${bid.status === "winning" ? "text-green-400" : bid.status === "outbid" ? "text-red-400" : "text-white"}`}
                  >
                    ${bid.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 md:hidden">Current Bid</p>
                  <p className="font-semibold text-gold text-sm">
                    ${bid.currentBid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.className}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div>
                  {auction && auction.status === "active" ? (
                    <CountdownTimer endTime={auction.endTime} />
                  ) : (
                    <span className="text-gray-400 text-xs">Ended</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {mockMyBids.length === 0 && (
          <div data-ocid="my_bidding.empty_state" className="text-center py-16">
            <p className="text-gray-400 mb-4">
              You haven't placed any bids yet.
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              className="bg-gold hover:bg-gold-dark text-navy font-semibold"
            >
              Browse Auctions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
