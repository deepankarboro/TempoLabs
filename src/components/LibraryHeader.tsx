import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AuthModal } from "./auth/AuthModal";
import { useAuth } from "./auth/AuthProvider";
import { signOut } from "@/lib/auth";
import { LayoutGrid, List, Search } from "lucide-react";

interface LibraryHeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: string, value: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
  currentView?: "grid" | "list";
}

const LibraryHeader = ({
  onSearch = () => console.log("Search"),
  onFilterChange = () => console.log("Filter change"),
  onViewChange = () => console.log("View change"),
  currentView = "grid",
}: LibraryHeaderProps) => {
  const { user, profile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-full h-20 bg-white border-b px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-3xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search books..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Select onValueChange={(value) => onFilterChange("author", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Authors</SelectItem>
            <SelectItem value="fiction">Fiction Authors</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction Authors</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange("genre", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="sci-fi">Sci-Fi</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => onFilterChange("availability", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="checked-out">Checked Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button
          variant={currentView === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={currentView === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 ml-4">
        {user ? (
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        ) : (
          <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default LibraryHeader;
