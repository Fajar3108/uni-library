import React from "react";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { booksTable } from "@/database/schema";
import { desc } from "drizzle-orm";
import { Book } from "@/types/book";

const Profile = async () => {
  const latestBooks = (await db
    .select()
    .from(booksTable)
    .limit(10)
    .orderBy(desc(booksTable.createdAt))) as Book[];

  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Sign Out</Button>
      </form>
      <BookList
        title="Borrowed Book"
        books={latestBooks}
        containerClassName="mt-28"
      />
    </>
  );
};
export default Profile;
