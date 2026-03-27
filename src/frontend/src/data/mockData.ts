export interface Auction {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  currentBid: number;
  highestBidder: string | null;
  status: "active" | "completed" | "cancelled";
  endTime: Date;
  createdBy: string;
  bidsCount: number;
  category: string;
  winner?: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string;
  bidder: string;
  amount: number;
  timestamp: Date;
  status: "winning" | "outbid" | "won" | "lost";
  currentBid: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  joinedAt: Date;
  bidsCount: number;
  auctionsCount: number;
}

const now = new Date();
const addHours = (h: number) => new Date(now.getTime() + h * 3600 * 1000);
const subtractHours = (h: number) => new Date(now.getTime() - h * 3600 * 1000);

export const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Patek Philippe Nautilus 5711",
    description:
      "Rare stainless steel sports watch. Ref 5711/1A-010, includes original box and papers. Excellent condition, 2022 model.",
    imageUrl: "https://picsum.photos/seed/watch1/600/400",
    basePrice: 80000,
    currentBid: 145000,
    highestBidder: "collector_a",
    status: "active",
    endTime: addHours(2.25),
    createdBy: "seller_1",
    bidsCount: 23,
    category: "Watches",
  },
  {
    id: "2",
    title: "Leica M6 Vintage Camera Kit",
    description:
      "1984 Leica M6 in chrome finish. Includes 50mm Summicron lens, leather case, and original strap. Fully functional.",
    imageUrl: "https://picsum.photos/seed/camera2/600/400",
    basePrice: 3000,
    currentBid: 4750,
    highestBidder: "photo_enthusiast",
    status: "active",
    endTime: addHours(5.5),
    createdBy: "seller_2",
    bidsCount: 11,
    category: "Cameras",
  },
  {
    id: "3",
    title: 'Abstract Oil Painting — "Midnight Storm"',
    description:
      'Original 36x48" oil on canvas by emerging artist Sofia Marín. Certificate of authenticity included.',
    imageUrl: "https://picsum.photos/seed/art3/600/400",
    basePrice: 1200,
    currentBid: 2800,
    highestBidder: "art_lover",
    status: "active",
    endTime: addHours(18),
    createdBy: "seller_3",
    bidsCount: 8,
    category: "Art",
  },
  {
    id: "4",
    title: "First Edition — The Great Gatsby",
    description:
      "1925 first edition, first printing. Original dust jacket with minor wear. Exceptional rarity for collectors.",
    imageUrl: "https://picsum.photos/seed/book4/600/400",
    basePrice: 15000,
    currentBid: 31500,
    highestBidder: "rare_books",
    status: "active",
    endTime: addHours(0.45),
    createdBy: "seller_4",
    bidsCount: 19,
    category: "Books",
  },
  {
    id: "5",
    title: "Ferrari 250 GTO Scale Model (1:8)",
    description:
      "Hand-crafted 1:8 scale die-cast model of the 1962 Ferrari 250 GTO. Museum grade, limited edition of 50.",
    imageUrl: "https://picsum.photos/seed/car5/600/400",
    basePrice: 2500,
    currentBid: 5200,
    highestBidder: "petrol_head",
    status: "active",
    endTime: addHours(12),
    createdBy: "seller_5",
    bidsCount: 14,
    category: "Collectibles",
  },
  {
    id: "6",
    title: "Signed Michael Jordan Basketball",
    description:
      "Official NBA game ball signed by Michael Jordan during the 1998 Finals. COA from PSA/DNA.",
    imageUrl: "https://picsum.photos/seed/sports6/600/400",
    basePrice: 8000,
    currentBid: 22000,
    highestBidder: "sports_fan",
    status: "active",
    endTime: addHours(36),
    createdBy: "seller_6",
    bidsCount: 31,
    category: "Sports",
  },
  {
    id: "7",
    title: "Rolex Submariner Date (Black)",
    description:
      "Rolex Submariner Ref 116610LN. Unworn with stickers. Full set including inner and outer box.",
    imageUrl: "https://picsum.photos/seed/watch7/600/400",
    basePrice: 12000,
    currentBid: 18500,
    highestBidder: null,
    status: "completed",
    endTime: subtractHours(3),
    createdBy: "seller_7",
    bidsCount: 27,
    category: "Watches",
    winner: "watch_collector",
  },
  {
    id: "8",
    title: "Vintage Vinyl Collection (50 Records)",
    description:
      "Curated collection of 50 original pressings: Beatles, Stones, Zeppelin. All in VG+ or better condition.",
    imageUrl: "https://picsum.photos/seed/vinyl8/600/400",
    basePrice: 800,
    currentBid: 2100,
    highestBidder: null,
    status: "completed",
    endTime: subtractHours(12),
    createdBy: "seller_8",
    bidsCount: 16,
    category: "Music",
    winner: "vinyl_devotee",
  },
];

export const mockMyBids: Bid[] = [
  {
    id: "b1",
    auctionId: "1",
    auctionTitle: "Patek Philippe Nautilus 5711",
    auctionImage: "https://picsum.photos/seed/watch1/600/400",
    bidder: "me",
    amount: 130000,
    timestamp: subtractHours(1),
    status: "outbid",
    currentBid: 145000,
  },
  {
    id: "b2",
    auctionId: "2",
    auctionTitle: "Leica M6 Vintage Camera Kit",
    auctionImage: "https://picsum.photos/seed/camera2/600/400",
    bidder: "me",
    amount: 4750,
    timestamp: subtractHours(0.5),
    status: "winning",
    currentBid: 4750,
  },
  {
    id: "b3",
    auctionId: "7",
    auctionTitle: "Rolex Submariner Date (Black)",
    auctionImage: "https://picsum.photos/seed/watch7/600/400",
    bidder: "me",
    amount: 16000,
    timestamp: subtractHours(5),
    status: "lost",
    currentBid: 18500,
  },
  {
    id: "b4",
    auctionId: "3",
    auctionTitle: 'Abstract Oil Painting — "Midnight Storm"',
    auctionImage: "https://picsum.photos/seed/art3/600/400",
    bidder: "me",
    amount: 2800,
    timestamp: subtractHours(2),
    status: "winning",
    currentBid: 2800,
  },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    username: "collector_a",
    email: "collector@example.com",
    role: "user",
    joinedAt: subtractHours(720),
    bidsCount: 47,
    auctionsCount: 3,
  },
  {
    id: "u2",
    username: "photo_enthusiast",
    email: "photo@example.com",
    role: "user",
    joinedAt: subtractHours(480),
    bidsCount: 23,
    auctionsCount: 1,
  },
  {
    id: "u3",
    username: "art_lover",
    email: "art@example.com",
    role: "user",
    joinedAt: subtractHours(240),
    bidsCount: 15,
    auctionsCount: 0,
  },
  {
    id: "u4",
    username: "rare_books",
    email: "books@example.com",
    role: "user",
    joinedAt: subtractHours(1200),
    bidsCount: 89,
    auctionsCount: 5,
  },
  {
    id: "u5",
    username: "admin_vault",
    email: "admin@bidvault.io",
    role: "admin",
    joinedAt: subtractHours(2400),
    bidsCount: 0,
    auctionsCount: 0,
  },
];

export const mockAnalytics = {
  totalUsers: 1247,
  activeAuctions: 6,
  completedAuctions: 342,
  totalBids: 8934,
  totalRevenue: 2850000,
  dailyBids: [
    { day: "Mon", bids: 124 },
    { day: "Tue", bids: 187 },
    { day: "Wed", bids: 203 },
    { day: "Thu", bids: 156 },
    { day: "Fri", bids: 289 },
    { day: "Sat", bids: 341 },
    { day: "Sun", bids: 267 },
  ],
  categoryBreakdown: [
    { name: "Watches", value: 38 },
    { name: "Art", value: 22 },
    { name: "Collectibles", value: 18 },
    { name: "Cameras", value: 12 },
    { name: "Other", value: 10 },
  ],
};
