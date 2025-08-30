// src/App.js
import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    const q = query.trim();
    if (!q) {
      setError("Please enter a book title.");
      setBooks([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      if (!data.docs || data.docs.length === 0) {
        setError("No results found.");
        setBooks([]);
      } else {
        setBooks(data.docs.slice(0, 12));
      }
    } catch (e) {
      setError("Network error — please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") searchBooks();
  };

  return (
    <div className="container">
      <h1 className="title">📚 Book Finder</h1>

      <div className="search">
        <input
          className="input"
          placeholder="Search book by title (e.g., harry potter)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          className="button"
          onClick={searchBooks}
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {books.map((b, idx) => {
          const coverId = b.cover_i;
          const coverUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            : null;
          return (
            <div className="card" key={idx}>
              {coverUrl ? (
                <img src={coverUrl} alt={b.title} className="cover" />
              ) : (
                <div className="placeholder">No Image</div>
              )}
              <div className="meta">
                <div className="book-title">{b.title}</div>
                <div className="book-author">
                  {b.author_name ? b.author_name.join(", ") : "Unknown author"}
                </div>
                <div className="book-year">{b.first_publish_year ?? "—"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
