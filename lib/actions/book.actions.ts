"use server";

import { CreateBook, TextSegment } from "@/types";
import { connectToDatabase } from "@/database/mongoose";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";

export const getAllBooks = async () => {
  try {
    await connectToDatabase();

    const books = await Book.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: serializeData(books),
    };
  } catch (error) {
    console.error("Error getting books", error);
    return {
      success: false,
      error: error,
    };
  }
};

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        book: serializeData(existingBook),
        exists: true,
      };
    }
    return {
      exists: false,
    };
  } catch (error) {
    console.log("Error checking book exists", error);
    return {
      exists: false,
      error: error,
    };
  }
};

export const createBook = async (book: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(book.title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    const { auth } = await import("@clerk/nextjs/server");
    const { userId } = await auth();

    // Todo: Check subscription limit before creating book

    const newBook = await Book.create({
      ...book,
      clerkId: userId,
      slug,
      totalSegments: 0,
    });

    return {
      success: true,
      book: serializeData(newBook),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error,
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();
    console.log("Saving book segments...");
    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        bookId,
        clerkId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);

    await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

    console.log("Book segments saved successfully");
    return {
      success: true,
      data: {
        segmentsCreated: segments.length,
      },
    };
  } catch (error) {
    console.error("Error saving book segments", error);
    await BookSegment.deleteMany({ bookId });
    await Book.findByIdAndDelete(bookId);
    console.log("Deleted book and segments due to error");
    return {
      success: false,
      error: error,
    };
  }
};
