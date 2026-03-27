import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type AuctionWithBids, useAuctions } from "../context/AuctionContext";

export default function PostAuction() {
  const navigate = useNavigate();
  const { dispatch } = useAuctions();
  const [form, setForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    duration: "24",
    category: "Watches",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.basePrice) {
      toast.error("Please fill in all required fields");
      return;
    }
    const price = Number.parseFloat(form.basePrice);
    if (price <= 0) {
      toast.error("Base price must be greater than 0");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newAuction: AuctionWithBids = {
      id: `user-${Date.now()}`,
      title: form.title,
      description: form.description,
      category: form.category,
      imageUrl:
        imagePreview ??
        `https://picsum.photos/seed/${form.title.slice(0, 6)}/600/400`,
      basePrice: price,
      currentBid: price,
      highestBidder: null,
      status: "active",
      endTime: new Date(
        Date.now() + Number.parseInt(form.duration) * 3600 * 1000,
      ),
      createdBy: "you",
      bidsCount: 0,
      bids: [],
    };

    dispatch({ type: "ADD_AUCTION", auction: newAuction });
    toast.success(`Auction "${form.title}" is now live!`);
    setIsSubmitting(false);
    navigate({ to: "/auctionstatus" });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.11 0.02 255)" }}
    >
      <div className="bg-navy border-b border-navy-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-2xl font-bold text-white">
            Post New Auction
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            List your item and start receiving bids
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-navy-card border border-navy-surface rounded-2xl p-8 space-y-6"
          data-ocid="post_auction.form"
        >
          <div>
            <Label className="text-white font-semibold mb-3 block">
              Item Image
            </Label>
            <button
              type="button"
              data-ocid="post_auction.upload_button"
              onClick={() => document.getElementById("imageInput")?.click()}
              className="w-full border-2 border-dashed border-navy-light rounded-xl p-8 text-center cursor-pointer hover:border-gold transition-colors"
              style={{
                background: imagePreview
                  ? `url(${imagePreview}) center/cover`
                  : undefined,
              }}
            >
              {!imagePreview ? (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    Click to upload an image
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <span className="bg-black/60 text-white text-sm px-3 py-1 rounded-lg">
                    Change image
                  </span>
                </div>
              )}
            </button>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <Label
              htmlFor="title"
              className="text-white font-semibold mb-2 block"
            >
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Rolex Submariner 2023"
              data-ocid="post_auction.input"
              className="bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold"
            />
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-white font-semibold mb-2 block"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe your item, its condition, included accessories..."
              data-ocid="post_auction.textarea"
              className="bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-white font-semibold mb-2 block">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  data-ocid="post_auction.select"
                  className="bg-navy-surface border-navy-light text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy-card border-navy-surface">
                  {[
                    "Watches",
                    "Art",
                    "Cameras",
                    "Books",
                    "Collectibles",
                    "Sports",
                    "Music",
                    "Jewelry",
                    "Vehicles",
                    "Fashion",
                    "Other",
                  ].map((c) => (
                    <SelectItem
                      key={c}
                      value={c}
                      className="text-white hover:bg-navy-surface"
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="basePrice"
                className="text-white font-semibold mb-2 block"
              >
                Base Price ($) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="basePrice"
                type="number"
                min="1"
                value={form.basePrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, basePrice: e.target.value }))
                }
                placeholder="1000"
                data-ocid="post_auction.input"
                className="bg-navy-surface border-navy-light text-white placeholder:text-gray-600 focus-visible:ring-gold"
              />
            </div>
            <div>
              <Label className="text-white font-semibold mb-2 block">
                Duration
              </Label>
              <Select
                value={form.duration}
                onValueChange={(v) => setForm((f) => ({ ...f, duration: v }))}
              >
                <SelectTrigger
                  data-ocid="post_auction.select"
                  className="bg-navy-surface border-navy-light text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy-card border-navy-surface">
                  {[
                    { v: "1", l: "1 hour" },
                    { v: "6", l: "6 hours" },
                    { v: "12", l: "12 hours" },
                    { v: "24", l: "24 hours" },
                    { v: "72", l: "3 days" },
                    { v: "168", l: "7 days" },
                  ].map((d) => (
                    <SelectItem
                      key={d.v}
                      value={d.v}
                      className="text-white hover:bg-navy-surface"
                    >
                      {d.l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            data-ocid="post_auction.submit_button"
            className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 text-base rounded-xl h-12"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Publish Auction
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
