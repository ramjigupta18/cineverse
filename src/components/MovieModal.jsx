import React from "react";
import { FiX, FiStar, FiCalendar, FiClock } from "react-icons/fi";

const MovieModal = ({ movie, onClose, loading, error }) => {
  if (!movie && !loading && !error) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Movie details"
        onClick={(event) => event.stopPropagation()}
        className="relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Close movie details"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-orange-500"
        >
          <FiX size={21} />
        </button>

        {loading ? (
          <div className="p-12 text-center text-zinc-300">
            Loading movie details...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">
            {error}
          </div>
        ) : movie ? (
          <div 
          className="grid gap-5 p-4 sm:grid-cols-[220px_1fr] sm:gap-6 sm:p-8">
            <div>
              {movie.Poster && movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={`${movie.Title} poster`}
                  className="mx-auto max-h-80 w-full rounded-2xl object-cover sm:max-h-none"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                  No poster
                </div>
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                Movie details
              </span>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                {movie.Title}
              </h2>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <FiCalendar size={15} />
                  {movie.Year}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock size={15} />
                  {movie.Runtime || "N/A"}
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <FiStar size={15} fill="currentColor" />
                  {movie.imdbRating && movie.imdbRating !== "N/A"
                    ? movie.imdbRating
                    : "N/A"}
                </span>
              </div>

              <p className="mt-5 leading-7 text-zinc-300">
                {movie.Plot && movie.Plot !== "N/A"
                  ? movie.Plot
                  : "Plot information is not available."}
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <p>
                  <span className="text-zinc-500">Genre: </span>
                  {movie.Genre || "N/A"}
                </p>
                <p>
                  <span className="text-zinc-500">Director: </span>
                  {movie.Director || "N/A"}
                </p>
                <p>
                  <span className="text-zinc-500">Actors: </span>
                  {movie.Actors || "N/A"}
                </p>
              </div>

              {movie.imdbID && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Explore on IMDb
                </a>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default MovieModal;