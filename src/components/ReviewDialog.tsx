import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star } from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  book_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  user?: {
    username: string;
    avatar_url: string;
  };
}

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
}

export function ReviewDialog({
  isOpen,
  onClose,
  bookId,
  bookTitle,
}: ReviewDialogProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("book_reviews")
      .select(
        `
        *,
        user:profiles!user_id(*)
      `,
      )
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching reviews:", error);
    else {
      setReviews(data || []);
      if (user) {
        const userReview = data?.find((review) => review.user_id === user.id);
        if (userReview) {
          setUserReview(userReview);
          setRating(userReview.rating);
          setReviewText(userReview.review_text);
        }
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !rating) return;

    const reviewData = {
      book_id: bookId,
      user_id: user.id,
      rating,
      review_text: reviewText.trim(),
    };

    if (userReview) {
      // Update existing review
      const { error } = await supabase
        .from("book_reviews")
        .update(reviewData)
        .eq("id", userReview.id);

      if (error) console.error("Error updating review:", error);
    } else {
      // Create new review
      const { error } = await supabase
        .from("book_reviews")
        .insert([reviewData]);

      if (error) console.error("Error creating review:", error);
    }

    fetchReviews();
    setReviewText("");
  };

  const StarRating = ({
    value,
    onSelect,
    onHover,
    size = 5,
  }: {
    value: number;
    onSelect?: (rating: number) => void;
    onHover?: (rating: number) => void;
    size?: number;
  }) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: size }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 cursor-pointer ${i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            onClick={() => onSelect?.(i + 1)}
            onMouseEnter={() => onHover?.(i + 1)}
            onMouseLeave={() => onHover?.(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Reviews for {bookTitle}</DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-4 mb-6 p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Your Rating:</p>
              <StarRating
                value={hoveredRating || rating}
                onSelect={setRating}
                onHover={setHoveredRating}
              />
            </div>
            <Textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmitReview} disabled={!rating}>
              {userReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.user?.avatar_url} />
                      <AvatarFallback>
                        {review.user?.username?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user?.username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRating value={review.rating} />
                </div>
                {review.review_text && (
                  <p className="mt-2 text-gray-600">{review.review_text}</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
