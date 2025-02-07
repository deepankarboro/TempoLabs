import React, { useState } from "react";
import LibraryHeader from "./LibraryHeader";
import BookCatalog from "./BookCatalog";
import MemberDashboard from "./MemberDashboard";

interface HomeProps {
  initialView?: "grid" | "list";
}

const Home = ({ initialView = "grid" }: HomeProps) => {
  const [currentView, setCurrentView] = useState<"grid" | "list">(initialView);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    author: "all",
    genre: "all",
    availability: "all",
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Searching for:", query);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    console.log(`Filter ${filter} changed to:`, value);
  };

  const handleViewChange = (view: "grid" | "list") => {
    setCurrentView(view);
    console.log("View changed to:", view);
  };

  const handleCheckOut = (bookId: string) => {
    console.log("Checking out book:", bookId);
  };

  const handleCheckIn = (bookId: string) => {
    console.log("Checking in book:", bookId);
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <LibraryHeader
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onViewChange={handleViewChange}
        currentView={currentView}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          <BookCatalog
            viewMode={currentView}
            onCheckOut={handleCheckOut}
            onCheckIn={handleCheckIn}
          />
        </div>
        <MemberDashboard />
      </div>
    </div>
  );
};

export default Home;
