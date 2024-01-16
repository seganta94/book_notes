import express from "express";
import axios from "axios";
import pg from "pg";
import bodyParser from "body-parser";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "123456",
  port: 5433,
});

const app = express();
const port = process.env.PORT || 3000;

db.connect();

let books = [];
db.query(`
  SELECT
    books.book_id,
    books.title,
    books.author,
    books.year,
    books.isbn,
    notes.note_id,
    notes.content,
    notes.rating
  FROM
    books
  INNER JOIN
    notes ON books.book_id = notes.book_id`, (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    books = res.rows;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
      const booksWithCovers = await fetchBooksWithCovers(books);
      res.render("index.ejs", { books: booksWithCovers });
      } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      }
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
}

db.end();
});

const fetchBooksWithCovers = async (books) => {
  const booksWithCovers = await Promise.all(
    books.map(async (book) => {
      try {
        const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`);
        book.coverUrl = response.request.res.responseUrl;
      } catch (error) {
        console.error(`Failed to fetch cover for ISBN ${book.isbn}`);
        book.coverUrl = null;
      }
      return book;
    })
  );
  return booksWithCovers;
};
