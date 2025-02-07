import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Heart,
  MessageCircle,
  Users,
  Star,
} from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ReviewDialog } from "./ReviewDialog";

interface BookCardProps {
  id?: string;
  ownerId?: string;
  isPersonalBook?: boolean;
  isWishlisted?: boolean;
  onWishlist?: () => void;
  onMessage?: () => void;
  onJoinCommunity?: () => void;
  title?: string;
  author?: string;
  coverUrl?: string;
  isAvailable?: boolean;
  onCheckOut?: () => void;
  onCheckIn?: () => void;
}

interface BookStats {
  averageRating: number;
  totalReviews: number;
}

const BookCard = ({
  id = "1",
  ownerId,
  isPersonalBook = false,
  isWishlisted = false,
  onWishlist = () => console.log("Wishlist clicked"),
  onMessage = () => console.log("Message clicked"),
  onJoinCommunity = () => console.log("Join community clicked"),
  title = "The Great Adventure",
  author = "John Smith",
  coverUrl = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  isAvailable = true,
  onCheckOut = () => console.log("Check out clicked"),
  onCheckIn = () => console.log("Check in clicked"),
}: BookCardProps) => {
  const [showReviews, setShowReviews] = useState(false);
  const [bookStats, setBookStats] = useState<BookStats>({
    averageRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    const fetchBookStats = async () => {
      const { data, error } = await supabase
        .from("book_reviews")
        .select("rating")
        .eq("book_id", id);

      if (!error && data) {
        const ratings = data.map((r) => r.rating);
        const average =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
        setBookStats({
          averageRating: Math.round(average * 10) / 10,
          totalReviews: ratings.length,
        });
      }
    };

    fetchBookStats();

    // Subscribe to changes
    const subscription = supabase
      .channel("book_reviews")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "book_reviews",
          filter: `book_id=eq.${id}`,
        },
        fetchBookStats,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  return (
    <Card className="w-[280px] h-[400px] bg-white overflow-hidden flex flex-col">
      <CardContent className="p-0 relative flex-grow">
        <div className="absolute top-2 right-2">
          <Badge
            variant={isAvailable ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {isAvailable ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Available
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Checked Out
              </>
            )}
          </Badge>
        </div>
        <div
          className="w-full h-[250px] bg-cover bg-center"
          style={{ backgroundImage: `url(${coverUrl})` }}
        />
        <div className="p-4">
          <div className="space-y-1">
            <h3
              className="font-semibold text-lg line-clamp-1 cursor-pointer hover:text-primary flex items-center gap-2 group"
              onClick={() => setShowReviews(true)}
            >
              {title}
              <Star className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-gray-500">{author}</p>
            {bookStats.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1">
                    {bookStats.averageRating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({bookStats.totalReviews}{" "}
                  {bookStats.totalReviews === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button
            variant={isWishlisted ? "default" : "outline"}
            size="icon"
            onClick={onWishlist}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </Button>

          {isPersonalBook && (
            <Button variant="outline" size="icon" onClick={onMessage}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}

          <Button variant="outline" size="icon" onClick={onJoinCommunity}>
            <Users className="h-4 w-4" />
          </Button>
        </div>
        <TooltipProvider>
          {isAvailable ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full" onClick={onCheckOut}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Check Out
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Check out this book</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={onCheckIn}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Check In
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return this book</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </CardFooter>
      <ReviewDialog
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        bookId={id}
        bookTitle={title}
      />
    </Card>
  );
};

export default BookCard;
