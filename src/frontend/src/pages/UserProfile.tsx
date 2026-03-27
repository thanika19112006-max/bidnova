import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BarChart2,
  Check,
  Edit2,
  Gavel,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

const RECENT_ACTIVITY = [
  { item: "Rolex Submariner Watch", amount: 4200, status: "Outbid" as const },
  { item: "Vintage Leica Camera", amount: 890, status: "Won" as const },
  { item: "Art Deco Gold Necklace", amount: 1150, status: "Active" as const },
  { item: "First Edition Novel Set", amount: 320, status: "Won" as const },
];

const statusColor: Record<"Won" | "Active" | "Outbid", string> = {
  Won: "bg-green-500/20 text-green-400 border-green-500/30",
  Active: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Outbid: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function UserProfile() {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("auth_user") ?? "{}");
  const storedName =
    localStorage.getItem("display_name") ??
    authUser?.username ??
    "BidNova User";
  const email = authUser?.email ?? "guest@bidnova.com";
  const role = authUser?.role === "admin" ? "Admin" : "Bidder";

  const [displayName, setDisplayName] = useState(storedName);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(storedName);

  const saveDisplayName = () => {
    localStorage.setItem("display_name", editValue);
    setDisplayName(editValue);
    setEditing(false);
  };

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stats = [
    { label: "Total Bids", value: "23", icon: Gavel, color: "text-blue-400" },
    { label: "Auctions Won", value: "4", icon: Award, color: "text-green-400" },
    {
      label: "Active Listings",
      value: "2",
      icon: ShoppingBag,
      color: "text-yellow-400",
    },
    { label: "Win Rate", value: "17%", icon: BarChart2, color: "text-gold" },
  ];

  return (
    <main className="min-h-screen bg-navy pb-16">
      {/* Header bar */}
      <div className="bg-navy-card border-b border-navy-surface px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            type="button"
            data-ocid="profile.button"
            onClick={() => navigate({ to: "/" })}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-white font-bold text-lg">My Profile</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-6">
        {/* Avatar & Name */}
        <Card className="bg-navy-card border-navy-surface">
          <CardContent className="pt-8 pb-6 flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-navy-surface border-2 border-gold flex items-center justify-center shadow-lg">
              <span className="text-gold font-bold text-3xl">{initials}</span>
            </div>

            {editing ? (
              <div className="flex items-center gap-2 w-full max-w-xs">
                <Input
                  data-ocid="profile.input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveDisplayName()}
                  className="bg-navy-surface border-gold text-white text-center font-semibold"
                  autoFocus
                />
                <Button
                  size="sm"
                  data-ocid="profile.save_button"
                  onClick={saveDisplayName}
                  className="bg-gold hover:bg-gold-dark text-navy"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-xl">{displayName}</h2>
                <button
                  type="button"
                  data-ocid="profile.edit_button"
                  onClick={() => {
                    setEditValue(displayName);
                    setEditing(true);
                  }}
                  className="text-gray-500 hover:text-gold transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )}

            <Badge className="bg-gold/20 text-gold border border-gold/30 text-xs">
              {role}
            </Badge>
          </CardContent>
        </Card>

        {/* Info rows */}
        <Card className="bg-navy-card border-navy-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-navy-surface">
            {[
              { label: "Email", value: email },
              { label: "Member Since", value: "January 2025" },
              { label: "Role", value: role },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center py-3"
              >
                <Label className="text-gray-400 text-sm">{row.label}</Label>
                <span className="text-white text-sm font-medium">
                  {row.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          data-ocid="profile.card"
        >
          {stats.map((s, i) => (
            <Card
              key={s.label}
              className="bg-navy-card border-navy-surface"
              data-ocid={`profile.item.${i + 1}`}
            >
              <CardContent className="pt-5 pb-4 flex flex-col items-center gap-1">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <p className="text-white font-bold text-xl">{s.value}</p>
                <p className="text-gray-400 text-xs text-center">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="bg-navy-card border-navy-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-navy-surface">
            {RECENT_ACTIVITY.map((a, i) => (
              <div
                key={a.item}
                className="flex justify-between items-center py-3"
                data-ocid={`profile.item.${i + 1}`}
              >
                <div>
                  <p className="text-white text-sm font-medium">{a.item}</p>
                  <p className="text-gold text-xs font-bold">
                    ${a.amount.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusColor[a.status]}`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
