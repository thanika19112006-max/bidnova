import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ChatWidget } from "./components/ChatWidget";
import { Navbar } from "./components/Navbar";
import { AuctionProvider } from "./context/AuctionContext";
import AdminDashboard from "./pages/AdminDashboard";
import AuctionStatus from "./pages/AuctionStatus";
import Home from "./pages/Home";
import LiveAuction from "./pages/LiveAuction";
import Login from "./pages/Login";
import MyBidding from "./pages/MyBidding";
import PostAuction from "./pages/PostAuction";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";

function AppLayout() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <Outlet />
      <ChatWidget />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <AuctionProvider>
      <Toaster position="top-right" richColors />
      <Outlet />
    </AuctionProvider>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: AppLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: Home,
});
const userHomeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/userhome",
  component: UserDashboard,
});
const postAuctionRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/postauction",
  component: PostAuction,
});
const liveAuctionRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/liveauction/$id",
  component: LiveAuction,
});
const auctionRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/auction/$id",
  component: LiveAuction,
});
const auctionStatusRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/auctionstatus",
  component: AuctionStatus,
});
const myBiddingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/mybidding",
  component: MyBidding,
});
const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin",
  component: AdminDashboard,
});
const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: UserProfile,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  layoutRoute.addChildren([
    homeRoute,
    userHomeRoute,
    postAuctionRoute,
    liveAuctionRoute,
    auctionRoute,
    auctionStatusRoute,
    myBiddingRoute,
    adminRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
