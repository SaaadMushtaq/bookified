import BookCard from "@/components/BookCard";
import HeroSection from "@/components/HeroSection";
import { sampleBooks } from "@/lib/constants";

const page = () => {
  return (
    <main className="wrapper container">
      <HeroSection />

      <div className="library-books-grid">
        {sampleBooks.map(({ title, author, coverURL, slug }, _id) => (
          <BookCard
            key={_id}
            title={title}
            author={author}
            coverURL={coverURL}
            slug={slug}
          />
        ))}
      </div>
    </main>
  );
};

export default page;
