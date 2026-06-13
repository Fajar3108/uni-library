import React from "react";
import { Book } from "@/types/book";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoaned = false,
}: Book) => {
  return (
    <li className={cn(isLoaned && "xs:w-52 w-full")}>
      <Link
        href={`/books/${id}`}
        className={cn(isLoaned && "w-full flex flex-col items-center")}
      >
        <BookCover coverColor={coverColor} coverImage={coverUrl} />

        <div className={cn("mt-4 block", !isLoaned && "xs:max-w-40 max-w-28")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>
        {isLoaned && (
          <div className="mt-3 w-full">
            <div className="book-loaned">
              <Image
                src="/icons/calendar.svg"
                alt="Calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p className="text-light-100">10 days left to return</p>
            </div>
            <Button className="book-btn">Download Receipt</Button>
          </div>
        )}
      </Link>
    </li>
  );
};
export default BookCard;
