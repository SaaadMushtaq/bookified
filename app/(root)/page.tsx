import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import { getAllBooks } from "@/lib/actions/book.actions";

const page = async () => {
  const response = await getAllBooks();

  const books = response?.success ? (response.data ?? []) : [];
  console.log("Books fetched from database:", books);
  return (
    <main className="wrapper container">
      <HeroSection />

      <div className="library-books-grid">
        {books?.length > 0 ? (
          books.map(({ title, author, coverURL, slug }, _id) => (
            <BookCard
              key={_id}
              title={title}
              author={author}
              coverURL={coverURL}
              slug={slug}
            />
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </main>
  );
};

export default page;
