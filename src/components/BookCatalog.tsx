import React, { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import BookCard from "./BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  isAvailable: boolean;
}

interface BookCatalogProps {
  books?: Book[];
  viewMode?: "grid" | "list";
  onCheckOut?: (bookId: string) => void;
  onCheckIn?: (bookId: string) => void;
}

const defaultBooks: Book[] = [
  {
    id: "1",
    title: "The Great Adventure",
    author: "John Smith",
    coverUrl:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isAvailable: true,
  },
  {
    id: "2",
    title: "Mystery at Midnight",
    author: "Jane Doe",
    coverUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isAvailable: false,
  },
  {
    id: "3",
    title: "The Lost City",
    author: "Robert Johnson",
    coverUrl:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isAvailable: true,
  },
];

const BookCatalog = ({
  books = defaultBooks,
  viewMode: initialViewMode = "grid",
  onCheckOut = (bookId: string) => console.log(`Checking out book ${bookId}`),
  onCheckIn = (bookId: string) => console.log(`Checking in book ${bookId}`),
}: BookCatalogProps) => {
  const [viewMode, setViewMode] = useState(initialViewMode);

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      <div className="mb-4 flex justify-end space-x-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div
          className={`
            ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
          `}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className={
                viewMode === "list" ? "w-full flex justify-center" : ""
              }
            >
              <BookCard
                title={book.title}
                author={book.author}
                coverUrl={book.coverUrl}
                isAvailable={book.isAvailable}
                onCheckOut={() => onCheckOut(book.id)}
                onCheckIn={() => onCheckIn(book.id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BookCatalog;
