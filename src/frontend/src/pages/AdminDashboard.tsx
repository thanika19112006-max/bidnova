import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  DollarSign,
  Gavel,
  TrendingUp,
  Users,
} from "lucide-react";
import { useAuctions } from "../context/AuctionContext";
import { mockAnalytics } from "../data/mockData";

// Simple SVG bar chart — no external library
function BarChart({ data }: { data: { day: string; bids: number }[] }) {
  const max = Math.max(...data.map((d) => d.bids));
  const W = 400;
  const H = 180;
  const barW = Math.floor(W / data.length) - 8;
  const pad = 20;

  return (
    <svg
      viewBox={`0 0 ${W} ${H + pad}`}
      className="w-full h-52"
      role="img"
      aria-label="Daily bids chart"
    >
      {data.map((d, i) => {
        const barH = Math.round((d.bids / max) * H);
        const x = i * (W / data.length) + 4;
        const y = H - barH + 4;
        return (
          <g key={d.day}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill="#D4B04C"
              opacity={0.85}
            />
            <text
              x={x + barW / 2}
              y={H + pad}
              textAnchor="middle"
              fontSize={11}
              fill="#9CA3AF"
            >
              {d.day}
            </text>
            <text
              x={x + barW / 2}
              y={y - 4}
              textAnchor="middle"
              fontSize={10}
              fill="#D4B04C"
            >
              {d.bids}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Simple SVG pie chart
function PieChart({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = ["#D4B04C", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6"];
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 90;
  const cy = 90;
  const r = 70;

  let startAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(startAngle + angle);
    const y2 = cy + r * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const midAngle = startAngle + angle / 2;
    const lx = cx + (r + 18) * Math.cos(midAngle);
    const ly = cy + (r + 18) * Math.sin(midAngle);
    startAngle += angle;
    return {
      path,
      color: COLORS[i % COLORS.length],
      name: d.name,
      value: d.value,
      lx,
      ly,
    };
  });

  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <svg
        viewBox="0 0 180 180"
        className="w-44 h-44 flex-shrink-0"
        role="img"
        aria-label="Category breakdown"
      >
        {slices.map((s) => (
          <path key={s.name} d={s.path} fill={s.color} opacity={0.9} />
        ))}
      </svg>
      <div className="space-y-1.5">
        {slices.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: s.color }}
            />
            <span className="text-gray-300">{s.name}</span>
            <span className="text-gray-500 ml-1">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { state, dispatch } = useAuctions();
  const { users } = state;
  const auctions = state.auctions;

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      <div className="bg-navy border-b border-navy-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gold text-sm font-medium uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-2xl font-bold text-white">
            BidNova Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: mockAnalytics.totalUsers.toLocaleString(),
              icon: Users,
              color: "text-blue-400",
            },
            {
              label: "Active Auctions",
              value: auctions.filter((a) => a.status === "active").length,
              icon: Gavel,
              color: "text-gold",
            },
            {
              label: "Completed",
              value: mockAnalytics.completedAuctions,
              icon: CheckCircle,
              color: "text-green-400",
            },
            {
              label: "Total Bids",
              value: mockAnalytics.totalBids.toLocaleString(),
              icon: TrendingUp,
              color: "text-purple-400",
            },
            {
              label: "Revenue",
              value: `$${(mockAnalytics.totalRevenue / 1_000_000).toFixed(1)}M`,
              icon: DollarSign,
              color: "text-emerald-400",
            },
          ].map((stat) => (
            <Card key={stat.label} className="bg-navy-card border-navy-surface">
              <CardContent className="p-4">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-gray-400 text-xs">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-navy-card border-navy-surface">
            <CardHeader>
              <CardTitle className="text-white text-base">
                Daily Bids (This Week)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={mockAnalytics.dailyBids} />
            </CardContent>
          </Card>

          <Card className="bg-navy-card border-navy-surface">
            <CardHeader>
              <CardTitle className="text-white text-base">
                Auctions by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <PieChart data={mockAnalytics.categoryBreakdown} />
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="bg-navy-card border border-navy-surface mb-6">
            <TabsTrigger
              value="users"
              data-ocid="admin.tab"
              className="text-gray-300 data-[state=active]:bg-gold data-[state=active]:text-navy font-semibold"
            >
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger
              value="auctions"
              data-ocid="admin.tab"
              className="text-gray-300 data-[state=active]:bg-gold data-[state=active]:text-navy font-semibold"
            >
              Auctions ({auctions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div
              className="bg-navy-card rounded-2xl border border-navy-surface overflow-hidden"
              data-ocid="admin.table"
            >
              <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-navy-surface text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Username</span>
                <span>Email</span>
                <span>Role</span>
                <span>Bids</span>
                <span>Action</span>
              </div>
              {users.map((user, i) => (
                <div
                  key={user.id}
                  data-ocid={`admin.item.${i + 1}`}
                  className={`grid md:grid-cols-[2fr_2fr_1fr_1fr_1fr] grid-cols-1 gap-3 md:gap-4 px-6 py-4 items-center ${
                    i < users.length - 1 ? "border-b border-navy-surface" : ""
                  }`}
                >
                  <p className="font-medium text-white text-sm">
                    {user.username}
                  </p>
                  <p className="text-gray-400 text-sm truncate">{user.email}</p>
                  <Badge
                    className={
                      user.role === "admin"
                        ? "bg-gold text-navy border-0"
                        : "bg-navy-surface text-gray-300 border-0"
                    }
                  >
                    {user.role}
                  </Badge>
                  <p className="text-gray-400 text-sm">{user.bidsCount}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`admin.edit_button.${i + 1}`}
                    onClick={() =>
                      dispatch({ type: "TOGGLE_USER_ROLE", userId: user.id })
                    }
                    className="text-xs border-navy-light text-gray-300 hover:bg-navy-surface"
                  >
                    {user.role === "admin" ? "Demote" : "Promote"}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="auctions">
            <div
              className="bg-navy-card rounded-2xl border border-navy-surface overflow-hidden"
              data-ocid="admin.table"
            >
              <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-navy-surface text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Title</span>
                <span>Status</span>
                <span>Current Bid</span>
                <span>Bids</span>
                <span>Action</span>
              </div>
              {auctions.map((auction, i) => (
                <div
                  key={auction.id}
                  data-ocid={`admin.item.${i + 1}`}
                  className={`grid md:grid-cols-[3fr_1fr_1fr_1fr_1fr] grid-cols-1 gap-3 md:gap-4 px-6 py-4 items-center ${
                    i < auctions.length - 1
                      ? "border-b border-navy-surface"
                      : ""
                  }`}
                >
                  <p className="font-medium text-white text-sm truncate">
                    {auction.title}
                  </p>
                  <Badge
                    className={`border-0 ${
                      auction.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : auction.status === "completed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {auction.status}
                  </Badge>
                  <p className="text-gold font-semibold text-sm">
                    ${auction.currentBid.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm">{auction.bidsCount}</p>
                  {auction.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.delete_button.${i + 1}`}
                      onClick={() =>
                        dispatch({
                          type: "CANCEL_AUCTION",
                          auctionId: auction.id,
                        })
                      }
                      className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <span className="text-gray-600 text-xs">—</span>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
