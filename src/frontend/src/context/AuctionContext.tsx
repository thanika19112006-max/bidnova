import { type ReactNode, createContext, useContext, useReducer } from "react";
import {
  type Auction,
  type User,
  mockAuctions,
  mockUsers,
} from "../data/mockData";

export interface BidEntry {
  id: string;
  bidder: string;
  maskedBidder: string;
  amount: number;
  timestamp: Date;
}

export interface AuctionWithBids extends Omit<Auction, "bids"> {
  bids: BidEntry[];
}

interface AuctionState {
  auctions: AuctionWithBids[];
  users: User[];
}

type AuctionAction =
  | { type: "PLACE_BID"; auctionId: string; bidder: string; amount: number }
  | { type: "EXTEND_AUCTION"; auctionId: string; seconds: number }
  | { type: "CANCEL_AUCTION"; auctionId: string }
  | { type: "ADD_AUCTION"; auction: AuctionWithBids }
  | { type: "TOGGLE_USER_ROLE"; userId: string }
  | { type: "MARK_COMPLETED"; auctionId: string };

function maskName(name: string): string {
  if (name.length <= 2) return `${name[0]}*`;
  return `${name[0]}***${name[name.length - 1]}`;
}

function auctionReducer(
  state: AuctionState,
  action: AuctionAction,
): AuctionState {
  switch (action.type) {
    case "PLACE_BID": {
      return {
        ...state,
        auctions: state.auctions.map((a) => {
          if (a.id !== action.auctionId) return a;
          const newBid: BidEntry = {
            id: `bid-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            bidder: action.bidder,
            maskedBidder: maskName(action.bidder),
            amount: action.amount,
            timestamp: new Date(),
          };
          return {
            ...a,
            currentBid: action.amount,
            highestBidder: action.bidder,
            bidsCount: a.bidsCount + 1,
            bids: [newBid, ...a.bids],
          };
        }),
      };
    }
    case "EXTEND_AUCTION": {
      return {
        ...state,
        auctions: state.auctions.map((a) =>
          a.id === action.auctionId
            ? {
                ...a,
                endTime: new Date(a.endTime.getTime() + action.seconds * 1000),
              }
            : a,
        ),
      };
    }
    case "CANCEL_AUCTION": {
      return {
        ...state,
        auctions: state.auctions.map((a) =>
          a.id === action.auctionId
            ? { ...a, status: "cancelled" as const }
            : a,
        ),
      };
    }
    case "MARK_COMPLETED": {
      return {
        ...state,
        auctions: state.auctions.map((a) => {
          if (a.id !== action.auctionId) return a;
          return {
            ...a,
            status: "completed" as const,
            winner: a.highestBidder ?? undefined,
          };
        }),
      };
    }
    case "ADD_AUCTION": {
      return { ...state, auctions: [action.auction, ...state.auctions] };
    }
    case "TOGGLE_USER_ROLE": {
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.userId
            ? { ...u, role: u.role === "admin" ? "user" : ("admin" as const) }
            : u,
        ),
      };
    }
    default:
      return state;
  }
}

function initAuctions(): AuctionWithBids[] {
  return mockAuctions.map((a) => ({
    ...a,
    bids: [
      {
        id: `seed-${a.id}-1`,
        bidder: a.highestBidder ?? "bidder_x",
        maskedBidder: maskName(a.highestBidder ?? "bidder_x"),
        amount: a.currentBid,
        timestamp: new Date(Date.now() - 600_000),
      },
      {
        id: `seed-${a.id}-2`,
        bidder: "collector_z",
        maskedBidder: "c*********z",
        amount: Math.round(a.currentBid * 0.9),
        timestamp: new Date(Date.now() - 1_200_000),
      },
    ],
  }));
}

const initialState: AuctionState = {
  auctions: initAuctions(),
  users: mockUsers,
};

interface AuctionContextValue {
  state: AuctionState;
  dispatch: React.Dispatch<AuctionAction>;
  getAuction: (id: string) => AuctionWithBids | undefined;
}

const AuctionContext = createContext<AuctionContextValue | null>(null);

export function AuctionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(auctionReducer, initialState);

  function getAuction(id: string) {
    return state.auctions.find((a) => a.id === id);
  }

  return (
    <AuctionContext.Provider value={{ state, dispatch, getAuction }}>
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuctions() {
  const ctx = useContext(AuctionContext);
  if (!ctx) throw new Error("useAuctions must be used inside AuctionProvider");
  return ctx;
}
