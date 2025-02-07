import React from "react";
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
} from "lucide-react";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";

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
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-500">{author}</p>
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
    </Card>
  );
};

export default BookCard;
