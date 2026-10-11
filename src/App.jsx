import React, { useCallback, useEffect, useState } from "react";
import {
  FiFilm,
  FiStar,
  FiX,
  FiChevronRight,
  FiSearch,
  FiHeart,
  FiChevronLeft,
  FiTrendingUp,
  FiCalendar,
  FiPlay,
  FiLoader,
  FiAlertCircle,
  FiBookmark,
} from "react-icons/fi";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = "https://www.omdbapi.com/";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cineverse-favorites")) || [];
    } catch {
      return [];
    }
  });

  const [query, setQuery] = useState("Avengers");
  const [inputValue, setInputValue] = useState("Avengers");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("cineverse-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const searchMovies = useCallback(async (searchTerm, pageNumber = 1) => {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
      setMovies([]);
      setTotalResults(0);
      setError(
        "OMDb API key nahi mili. Project ke root folder mein .env file check karo."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
          searchTerm
        )}&type=movie&page=${pageNumber}`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search || []);
        setTotalResults(Number(data.totalResults) || 0);
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(data.Error || "Koi movie nahi mili. Dusra naam search karo.");
      }
    } catch {
      setMovies([]);
      setTotalResults(0);
      setError("Network error. Internet connection check karke dobara try karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "discover") {
      searchMovies(query, page);
    }
  }, [query, page, activeTab, searchMovies]);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = inputValue.trim();
    if (!trimmedQuery) return;

    setActiveTab("discover");
    setQuery(trimmedQuery);
    setPage(1);
    setSortBy("relevance");
    setYearFilter("all");
  };

  const toggleFavorite = (movie) => {
    setFavorites((previous) => {
      const exists = previous.some(
        (item) => item.imdbID === movie.imdbID
      );

      return exists
        ? previous.filter((item) => item.imdbID !== movie.imdbID)
        : [...previous, movie];
    });
  };

  const isFavorite = (movie) =>
    favorites.some((item) => item.imdbID === movie.imdbID);

  const openMovieDetails = async (movie) => {
    setSelectedMovie({ ...movie, Plot: "" });
    setDetailsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setSelectedMovie(data);
      }
    } catch {
      // Agar details load na hon, toh basic movie details dikhti rahengi.
    } finally {
      setDetailsLoading(false);
    }
  };

  const trendingSearches = ["Avengers", "Batman", "Spider-Man", "Inception"];

  const sourceMovies =
    activeTab === "favorites" ? favorites : movies;

  const displayedMovies = sourceMovies
    .filter((movie) => {
      if (yearFilter === "all") return true;

      const year = Number(String(movie.Year || "").slice(0, 4));
      if (!year) return false;

      if (yearFilter === "2020") return year >= 2020;
      if (yearFilter === "2010") return year >= 2010 && year < 2020;
      if (yearFilter === "2000") return year >= 2000 && year < 2010;
      if (yearFilter === "older") return year < 2000;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.Title.localeCompare(b.Title);
      }

      if (sortBy === "year-new") {
        return Number(String(b.Year).slice(0, 4)) -
          Number(String(a.Year).slice(0, 4));
      }

      if (sortBy === "year-old") {
        return Number(String(a.Year).slice(0, 4)) -
          Number(String(b.Year).slice(0, 4));
      }

      return 0;
    });

  const totalPages = Math.ceil(totalResults / 10);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setYearFilter("all");
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => changeTab("discover")}
            className="flex shrink-0 items-center gap-2"
            aria-label="CineVerse home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
              <FiFilm size={23} />
            </span>

            <span className="text-xl font-black tracking-tight sm:text-2xl">
              Cine<span className="text-orange-500">Verse</span>
            </span>
          </button>

          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={() => changeTab("discover")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                activeTab === "discover"
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Discover
            </button>

            <button
              onClick={() => changeTab("favorites")}
              className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                activeTab === "favorites"
                  ? "bg-orange-500/10 text-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FiHeart size={17} />
              <span className="hidden sm:inline">Watchlist</span>
              <span className="sm:hidden">Saved</span>

              {favorites.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs text-white">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-orange-950/60 via-[#18181b] to-[#09090b] px-5 py-10 sm:mt-10 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl sm:h-80 sm:w-80" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300 sm:text-sm">
              <FiTrendingUp size={15} />
              YOUR NEXT MOVIE NIGHT STARTS HERE
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              Discover your
              <span className="block text-orange-500">next obsession.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
              Explore movies, discover hidden gems, and build your personal
              watchlist. Your next favourite film is just one search away.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 shadow-2xl focus-within:border-orange-500/60"
            >
              <FiSearch className="ml-2 shrink-0 text-gray-400" size={21} />

              <input
                type="search"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Search movies..."
                aria-label="Search movies"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-white outline-none placeholder:text-gray-500 sm:px-2 sm:text-base"
              />

              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
              >
                <FiSearch size={17} />
                <span className="hidden xs:inline">Search</span>
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="mr-1 text-gray-500">Popular:</span>
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setInputValue(term);
                    setQuery(term);
                    setPage(1);
                    setActiveTab("discover");
                    setYearFilter("all");
                    setSortBy("relevance");
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-gray-300 transition hover:border-orange-500/50 hover:text-orange-300"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Movie section heading */}
        <section className="mt-10 sm:mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                {activeTab === "favorites" ? "YOUR COLLECTION" : "EXPLORE"}
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                {activeTab === "favorites" ? "Your Watchlist" : "Discover Movies"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {activeTab === "favorites"
                  ? `${favorites.length} saved ${
                      favorites.length === 1 ? "movie" : "movies"
                    }`
                  : `Search results for "${query}"`}
              </p>
            </div>

            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <label className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-[#18181b] px-3 py-2.5">
                <FiCalendar className="shrink-0 text-gray-500" size={16} />
                <span className="shrink-0 text-xs text-gray-400">Year</span>
                <select
                  value={yearFilter}
                  onChange={(event) => setYearFilter(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
                >
                  <option className="bg-[#18181b]" value="all">All years</option>
                  <option className="bg-[#18181b]" value="2020">2020 and newer</option>
                  <option className="bg-[#18181b]" value="2010">2010–2019</option>
                  <option className="bg-[#18181b]" value="2000">2000–2009</option>
                  <option className="bg-[#18181b]" value="older">Before 2000</option>
                </select>
              </label>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort movies"
                className="rounded-xl border border-white/10 bg-[#18181b] px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-orange-500/50"
              >
                <option className="bg-[#18181b]" value="relevance">Sort: Relevance</option>
                <option className="bg-[#18181b]" value="title">Title: A–Z</option>
                <option className="bg-[#18181b]" value="year-new">Newest first</option>
                <option className="bg-[#18181b]" value="year-old">Oldest first</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && activeTab === "discover" && (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4">
              <FiLoader className="animate-spin text-orange-500" size={36} />
              <p className="text-sm text-gray-400">Finding your next movie...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && activeTab === "discover" && (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center">
              <FiAlertCircle size={32} className="text-red-400" />
              <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300">
                {error}
              </p>
              <button
                onClick={() => searchMovies(query, page)}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold hover:bg-orange-400"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty states */}
          {!loading &&
            !error &&
            displayedMovies.length === 0 &&
            (activeTab === "favorites" || activeTab === "discover") && (
              <div className="mt-8 flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                  {activeTab === "favorites" ? (
                    <FiBookmark size={28} />
                  ) : (
                    <FiFilm size={28} />
                  )}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {activeTab === "favorites"
                    ? "Your watchlist is empty"
                    : "No movies found"}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  {activeTab === "favorites"
                    ? "Discover movies and tap the heart icon to save them here."
                    : "Try a different search or change your year filter."}
                </p>

                {activeTab === "favorites" && (
                  <button
                    onClick={() => changeTab("discover")}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold hover:bg-orange-400"
                  >
                    Discover Movies
                  </button>
                )}
              </div>
            )}

          {/* Movies grid */}
          {!loading && !error && displayedMovies.length > 0 && (
            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {displayedMovies.map((movie) => {
                const saved = isFavorite(movie);

                return (
                  <article
                    key={movie.imdbID}
                    className="group min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#18181b] transition duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-950/20"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-[#27272a]">
                      {movie.Poster && movie.Poster !== "N/A" ? (
                        <img
                          src={movie.Poster}
                          alt={`${movie.Title} poster`}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-500">
                          <FiFilm size={36} />
                          <span className="px-3 text-center text-xs">Poster unavailable</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 opacity-80" />

                      <button
                        onClick={() => toggleFavorite(movie)}
                        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                        title={saved ? "Remove from watchlist" : "Add to watchlist"}
                        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition sm:right-3 sm:top-3 ${
                          saved
                            ? "bg-orange-500 text-white"
                            : "bg-black/50 text-white hover:bg-orange-500"
                        }`}
                      >
                        <FiHeart size={17} fill={saved ? "currentColor" : "none"} />
                      </button>

                      <span className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-xs font-semibold text-gray-200">
                        {movie.Year}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="min-h-10 line-clamp-2 text-sm font-bold leading-5 text-white sm:text-base">
                        {movie.Title}
                      </h3>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FiStar className="text-orange-400" size={14} />
                          Movie
                        </span>

                        <button
                          onClick={() => openMovieDetails(movie)}
                          className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-2 text-xs font-semibold text-gray-200 transition hover:bg-orange-500 hover:text-white sm:px-3"
                        >
                          Details
                          <FiChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {activeTab === "discover" &&
            !loading &&
            !error &&
            totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((previous) => Math.max(1, previous - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-orange-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft size={17} />
                  Previous
                </button>

                <span className="rounded-xl bg-white/5 px-4 py-3 text-sm text-gray-400">
                  Page <span className="font-bold text-white">{page}</span> of{" "}
                  <span className="font-bold text-white">{totalPages}</span>
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((previous) => Math.min(totalPages, previous + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <FiChevronRight size={17} />
                </button>
              </div>
            )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-7 text-center">
          <div className="flex items-center justify-center gap-2 text-lg font-black">
            <FiFilm className="text-orange-500" />
            Cine<span className="text-orange-500">Verse</span>
          </div>

          <p className="mt-3 text-xs leading-6 text-gray-500 sm:text-sm">
            Discover films. Save favourites. Find your next obsession.
          </p>

          <p className="mt-2 text-xs text-gray-600">
            Movie data provided by OMDb API.
          </p>
        </footer>
      </main>

      {/* Movie details modal */}
      {selectedMovie && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedMovie.Title} details`}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#18181b] shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovie(null)}
              aria-label="Close movie details"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-orange-500 sm:right-4 sm:top-4"
            >
              <FiX size={22} />
            </button>

            <div className="grid sm:grid-cols-[220px_1fr]">
              <div className="relative h-56 bg-[#27272a] sm:h-full sm:min-h-[400px]">
                {selectedMovie.Poster && selectedMovie.Poster !== "N/A" ? (
                  <img
                    src={selectedMovie.Poster}
                    alt={`${selectedMovie.Title} poster`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    <FiFilm size={48} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent sm:bg-gradient-to-r" />
              </div>

              <div className="p-5 sm:p-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400">
                  <FiPlay size={13} />
                  Movie Details
                </span>

                <h2 className="mt-4 pr-8 text-2xl font-black leading-tight sm:text-3xl">
                  {selectedMovie.Title}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  {selectedMovie.Year && <span>{selectedMovie.Year}</span>}
                  {selectedMovie.Runtime && <span>{selectedMovie.Runtime}</span>}
                  {selectedMovie.Rated && <span>{selectedMovie.Rated}</span>}
                </div>

                {selectedMovie.imdbRating &&
                  selectedMovie.imdbRating !== "N/A" && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2">
                      <FiStar className="text-orange-400" size={18} />
                      <span className="font-bold text-white">
                        {selectedMovie.imdbRating}/10
                      </span>
                      <span className="text-xs text-gray-400">IMDb</span>
                    </div>
                  )}

                {detailsLoading ? (
                  <div className="mt-8 flex items-center gap-3 text-sm text-gray-400">
                    <FiLoader className="animate-spin text-orange-500" size={20} />
                    Loading movie details...
                  </div>
                ) : (
                  <>
                    <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-gray-300">
                      Storyline
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-gray-400">
                      {selectedMovie.Plot &&
                      selectedMovie.Plot !== "N/A"
                        ? selectedMovie.Plot
                        : "No storyline is available for this movie."}
                    </p>

                    {selectedMovie.Genre &&
                      selectedMovie.Genre !== "N/A" && (
                        <p className="mt-4 text-sm leading-6 text-gray-400">
                          <span className="font-semibold text-gray-200">Genre: </span>
                          {selectedMovie.Genre}
                        </p>
                      )}

                    {selectedMovie.Director &&
                      selectedMovie.Director !== "N/A" && (
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          <span className="font-semibold text-gray-200">Director: </span>
                          {selectedMovie.Director}
                        </p>
                      )}

                    {selectedMovie.Actors &&
                      selectedMovie.Actors !== "N/A" && (
                        <p className="mt-2 text-sm leading-6 text-gray-400">
                          <span className="font-semibold text-gray-200">Cast: </span>
                          {selectedMovie.Actors}
                        </p>
                      )}
                  </>
                )}

                <button
                  onClick={() => toggleFavorite(selectedMovie)}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-400"
                >
                  <FiHeart
                    size={18}
                    fill={isFavorite(selectedMovie) ? "currentColor" : "none"}
                  />
                  {isFavorite(selectedMovie)
                    ? "Remove from Watchlist"
                    : "Add to Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
