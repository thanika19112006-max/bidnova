import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";
import { AuctionCard } from "../components/AuctionCard";
import { useAuctions } from "../context/AuctionContext";
import type { Auction } from "../data/mockData";

export default function AuctionStatus() {
  const { state } = useAuctions();
  const [search, setSearch] = useState("");

  function toAuction(a: (typeof state.auctions)[0]): Auction {
    const { bids: _bids, ...rest } = a;
    return rest;
  }

  const active = state.auctions.filter(
    (a) =>
      a.status === "active" &&
      a.title.toLowerCase().includes(search.toLowerCase()),
  );
  const completed = state.auctions.filter(
    (a) =>
      (a.status === "completed" || a.status === "cancelled") &&
      a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      <div className="bg-navy border-b border-navy-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-display font-bold text-white mb-1">
            All Auctions
          </h1>
          <p className="text-gray-400 text-sm">
            Browse active and completed auctions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search auctions..."
            data-ocid="auction_status.search_input"
            className="pl-9 bg-navy-card border-navy-surface text-white placeholder:text-gray-600"
          />
        </div>

        <Tabs defaultValue="active">
          <TabsList className="bg-navy-card border border-navy-surface mb-6">
            <TabsTrigger
              value="active"
              data-ocid="auction_status.tab"
              className="text-gray-300 data-[state=active]:bg-gold data-[state=active]:text-navy font-semibold"
            >
              Active ({active.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              data-ocid="auction_status.tab"
              className="text-gray-300 data-[state=active]:bg-gold data-[state=active]:text-navy font-semibold"
            >
              Completed ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {active.length === 0 ? (
              <div
                data-ocid="auction_status.empty_state"
                className="text-center py-16 text-gray-400"
              >
                No active auctions found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {active.map((a) => (
                  <AuctionCard key={a.id} auction={toAuction(a)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completed.length === 0 ? (
              <div
                data-ocid="auction_status.empty_state"
                className="text-center py-16 text-gray-400"
              >
                No completed auctions found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completed.map((a) => (
                  <AuctionCard key={a.id} auction={toAuction(a)} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
