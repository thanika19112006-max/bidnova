import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Gavel, Shield, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { AuctionCard } from "../components/AuctionCard";
import { useAuctions } from "../context/AuctionContext";
import type { Auction } from "../data/mockData";

export default function Home() {
  const navigate = useNavigate();
  const { state } = useAuctions();
  const activeAuctions = state.auctions.filter((a) => a.status === "active");
  const featuredAuctions = activeAuctions.slice(0, 3);

  function toAuction(a: (typeof state.auctions)[0]): Auction {
    const { bids: _bids, ...rest } = a;
    return rest;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
              Premium Online Auctions
            </p>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Discover &amp; Bid on{" "}
              <span className="text-gold">Exclusive Items.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Rare watches, art, collectibles, and more. Join thousands of
              bidders in real-time auctions.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={() => navigate({ to: "/auctionstatus" })}
                data-ocid="home.primary_button"
                className="bg-gold hover:bg-gold-dark text-navy font-bold px-8 py-3 text-base rounded-xl h-12"
              >
                Explore Auctions
              </Button>
              <Button
                onClick={() => navigate({ to: "/register" })}
                variant="outline"
                data-ocid="home.secondary_button"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-base rounded-xl h-12"
              >
                Create Account
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-navy-card border-b border-navy-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                label: "Active Auctions",
                value: activeAuctions.length.toString(),
                icon: Gavel,
              },
              { label: "Total Bids", value: "8,934", icon: TrendingUp },
              { label: "Happy Winners", value: "1,247", icon: Shield },
              { label: "Avg. Response", value: "< 1s", icon: Zap },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-3"
              >
                <stat.icon className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Auctions */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Featured Auctions
            </h2>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/auctionstatus" })}
              className="text-sm border-gold/30 text-gold hover:bg-gold/10"
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAuctions.map((auction, i) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-navy-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-gold/10 transition-all duration-300 hover:-translate-y-1 group border border-navy-surface"
              >
                <div className="overflow-hidden">
                  <img
                    src={auction.imageUrl}
                    alt={auction.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">
                    {auction.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {auction.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Current bid
                      </p>
                      <p className="text-gold font-bold text-lg">
                        ${auction.currentBid.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      data-ocid="home.primary_button"
                      onClick={() =>
                        navigate({
                          to: "/liveauction/$id",
                          params: { id: auction.id },
                        })
                      }
                      className="bg-gold hover:bg-gold-dark text-navy font-semibold text-xs"
                    >
                      Bid Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Auctions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-white">
                Live Auctions
              </h2>
              <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                LIVE
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={toAuction(auction)} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-navy border-t border-navy-surface mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-white">
              <Gavel className="h-6 w-6 text-gold" />
              <span className="font-display font-bold text-xl">
                Bid<span className="text-gold">Nova</span>
              </span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              {["About Us", "Careers", "Contact", "Legal"].map((link) => (
                <a
                  key={link}
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-navy-surface mt-8 pt-6 text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} BidNova. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
