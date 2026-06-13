import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { booksTable } from "@/database/schema";
import { Book } from "@/types/book";
import { desc } from "drizzle-orm";

const Home = async () => {
  const latestBooks = (await db
    .select()
    .from(booksTable)
    .limit(10)
    .orderBy(desc(booksTable.createdAt))) as Book[];

  return (
    <>
      <BookOverview book={latestBooks[0]} />
      <BookList
        title="Latest Books"
        books={latestBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
