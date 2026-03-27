import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Clock,
  Sparkles,
  Tag,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Notification {
  id: number;
  icon: "outbid" | "won" | "ending" | "bid" | "welcome";
  title: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: "outbid",
    title: "You were outbid on Rolex Watch",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    icon: "won",
    title: "You won: Vintage Camera!",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 3,
    icon: "ending",
    title: "Auction ending in 5 min: Gold Necklace",
    time: "4 min ago",
    read: false,
  },
  {
    id: 4,
    icon: "bid",
    title: "New bid on your listing: Antique Vase",
    time: "30 min ago",
    read: true,
  },
  {
    id: 5,
    icon: "welcome",
    title: "BidNova: Welcome to the platform!",
    time: "2 days ago",
    read: true,
  },
];

function NotifIcon({ type }: { type: Notification["icon"] }) {
  if (type === "outbid")
    return <AlertTriangle className="h-4 w-4 text-red-400" />;
  if (type === "won") return <Trophy className="h-4 w-4 text-green-400" />;
  if (type === "ending") return <Clock className="h-4 w-4 text-yellow-400" />;
  if (type === "bid") return <Tag className="h-4 w-4 text-blue-400" />;
  return <Sparkles className="h-4 w-4 text-gold" />;
}

export function Navbar() {
  const { identity, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const isLoggedIn = !!identity || !!localStorage.getItem("auth_token");
  const shortId = identity
    ? identity.getPrincipal().toString().slice(0, 8)
    : (JSON.parse(localStorage.getItem("auth_user") ?? "{}")?.username ??
      "User");

  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const closeNotif = () => setNotifOpen(false);

  return (
    <nav className="bg-navy sticky top-0 z-50 border-b border-navy-surface shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            data-ocid="nav.link"
            className="flex items-center gap-2 text-white font-bold text-xl hover:text-gold transition-colors"
            style={{ borderRadius: "20px", overflow: "hidden" }}
          >
            <img
              src="/assets/generated/bidnova-logo-futuristic.dim_400x120.png"
              alt="BidNova"
              className="h-9 w-auto"
              style={{
                borderRadius: "20px",
                filter:
                  "drop-shadow(0 0 8px rgba(212, 175, 55, 1)) drop-shadow(0 0 18px rgba(212, 175, 55, 0.85)) drop-shadow(0 0 36px rgba(212, 175, 55, 0.55)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))",
              }}
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              data-ocid="nav.link"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Live Auctions
            </Link>
            <Link
              to="/auctionstatus"
              data-ocid="nav.link"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              All Auctions
            </Link>
            {isLoggedIn && (
              <Link
                to="/postauction"
                data-ocid="nav.link"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Sell
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    type="button"
                    data-ocid="nav.toggle"
                    onClick={() => setNotifOpen((o) => !o)}
                    onKeyDown={(e) => e.key === "Escape" && closeNotif()}
                    className="text-gray-400 hover:text-white relative p-1"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white font-bold"
                        style={{ fontSize: 9 }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={closeNotif}
                        onKeyDown={(e) => e.key === "Escape" && closeNotif()}
                        role="button"
                        tabIndex={-1}
                        aria-label="Close notifications"
                      />
                      <div
                        data-ocid="nav.popover"
                        className="absolute right-0 mt-2 w-80 bg-navy-card border border-navy-surface rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-navy-surface">
                          <span className="text-white font-semibold text-sm">
                            Notifications
                          </span>
                          <button
                            type="button"
                            data-ocid="nav.secondary_button"
                            onClick={markAllRead}
                            className="text-gold hover:text-yellow-300 text-xs font-medium transition-colors"
                          >
                            Mark all read
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.map((n) => (
                            <button
                              key={n.id}
                              type="button"
                              data-ocid="nav.item"
                              onClick={() => markRead(n.id)}
                              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-navy-surface transition-colors border-b border-navy-surface/50 last:border-0 ${
                                !n.read ? "bg-navy-surface/40" : ""
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                <NotifIcon type={n.icon} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs leading-snug ${!n.read ? "text-white font-medium" : "text-gray-400"}`}
                                >
                                  {n.title}
                                </p>
                                <p className="text-gray-500 text-xs mt-0.5">
                                  {n.time}
                                </p>
                              </div>
                              {!n.read && (
                                <span className="shrink-0 w-2 h-2 bg-gold rounded-full mt-1" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-ocid="nav.dropdown_menu"
                      className="flex items-center gap-2 text-white hover:text-gold transition-colors"
                    >
                      <Avatar className="h-8 w-8 bg-navy-surface border border-gold">
                        <AvatarFallback className="bg-navy-surface text-gold text-xs">
                          {shortId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm hidden sm:block">
                        {shortId.slice(0, 10)}
                        {shortId.length > 10 ? "..." : ""}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-navy-card border-navy-surface text-white w-48"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/profile" })}
                      data-ocid="nav.link"
                      className="hover:bg-navy-surface cursor-pointer text-gold font-medium"
                    >
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-navy-surface" />
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/userhome" })}
                      className="hover:bg-navy-surface cursor-pointer"
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/mybidding" })}
                      className="hover:bg-navy-surface cursor-pointer"
                    >
                      My Bids
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/postauction" })}
                      className="hover:bg-navy-surface cursor-pointer"
                    >
                      Post Auction
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/admin" })}
                      className="hover:bg-navy-surface cursor-pointer"
                    >
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-navy-surface" />
                    <DropdownMenuItem
                      onClick={() => {
                        clear();
                        localStorage.removeItem("auth_token");
                        localStorage.removeItem("auth_user");
                        navigate({ to: "/" });
                      }}
                      className="text-red-400 hover:bg-navy-surface cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: "/login" })}
                  data-ocid="nav.button"
                  className="text-gray-300 hover:text-white hover:bg-navy-surface text-sm"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate({ to: "/register" })}
                  data-ocid="nav.primary_button"
                  className="bg-gold hover:bg-gold-dark text-navy font-semibold text-sm"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
