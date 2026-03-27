import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  Gavel,
  List,
  PlusCircle,
  Search,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { mockMyBids } from "../data/mockData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function UserDashboard() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("auth_user") ?? "{}");

  // Use display_name saved from profile, then fallback to username or identity
  const displayName =
    localStorage.getItem("display_name") ??
    storedUser?.username ??
    (identity ? identity.getPrincipal().toString().slice(0, 12) : "Guest");

  const activeBids = mockMyBids.filter(
    (b) => b.status === "winning" || b.status === "outbid",
  ).length;
  const wonAuctions = mockMyBids.filter((b) => b.status === "won").length;

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      <div className="bg-navy border-b border-navy-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gold text-sm font-medium mb-1">Welcome back</p>
          <h1 className="font-display text-2xl font-bold text-white">
            {displayName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's your auction activity summary
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Active Bids",
              value: activeBids,
              icon: TrendingUp,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Auctions Won",
              value: wonAuctions,
              icon: Trophy,
              color: "text-gold",
              bg: "bg-gold/10",
            },
            {
              label: "Total Bids",
              value: mockMyBids.length,
              icon: Gavel,
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
          ].map((stat) => (
            <Card key={stat.label} className="bg-navy-card border-navy-surface">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Post Auction",
                desc: "List a new item for bidding",
                icon: PlusCircle,
                path: "/postauction",
                cta: "Start Selling",
              },
              {
                label: "My Bids",
                desc: "View your bidding history",
                icon: List,
                path: "/mybidding",
                cta: "View Bids",
              },
              {
                label: "Browse Auctions",
                desc: "Find items to bid on",
                icon: Search,
                path: "/",
                cta: "Explore",
              },
            ].map((action) => (
              <Card
                key={action.label}
                className="bg-navy-card border-navy-surface hover:border-gold/30 transition-colors"
              >
                <CardContent className="p-6">
                  <action.icon className="h-8 w-8 text-gold mb-3" />
                  <h3 className="font-semibold text-white mb-1">
                    {action.label}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{action.desc}</p>
                  <Button
                    onClick={() => navigate({ to: action.path as "/" })}
                    className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold text-sm"
                  >
                    {action.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-white mb-4">
            Recent Bids
          </h2>
          <div className="bg-navy-card rounded-2xl border border-navy-surface overflow-hidden">
            {mockMyBids.slice(0, 4).map((bid, i) => (
              <div
                key={bid.id}
                className={`flex items-center gap-4 p-4 ${i < mockMyBids.length - 1 ? "border-b border-navy-surface" : ""}`}
              >
                <img
                  src={bid.auctionImage}
                  alt={bid.auctionTitle}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">
                    {bid.auctionTitle}
                  </p>
                  <p className="text-gray-400 text-xs">
                    My bid: ${bid.amount.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    bid.status === "winning"
                      ? "bg-green-500/20 text-green-400"
                      : bid.status === "outbid"
                        ? "bg-red-500/20 text-red-400"
                        : bid.status === "won"
                          ? "bg-gold/20 text-gold"
                          : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
