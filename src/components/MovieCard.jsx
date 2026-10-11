import React from "react";
import { FiHeart, FiExternalLink } from "react-icons/fi";

const MovieCard = ({ movie, isFavorite, onFavorite, onDetails }) => {
  const posterAvailable =
    movie.Poster && movie.Poster !== "N/A";

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-glow">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
        {posterAvailable ? (
          <img
            src={movie.Poster}
            alt={`${movie.Title} movie poster`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-zinc-500">
            Poster unavailable
          </div>
        )}

        <button
          onClick={() => onFavorite(movie)}
          aria-label={
            isFavorite
              ? `Remove ${movie.Title} from watchlist`
              : `Add ${movie.Title} to watchlist`
          }
          className={`absolute right-3 top-3 rounded-full p-2.5 backdrop-blur-md transition ${
            isFavorite
              ? "bg-orange-500 text-white"
              : "bg-black/60 text-white hover:bg-orange-500"
          }`}
        >
          <FiHeart
            size={18}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black via-black/90 to-transparent p-4 pt-12 transition-transform duration-300 group-hover:translate-y-0 max-md:hidden">
          <button
            onClick={() => onDetails(movie)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
          >
            View Details <FiExternalLink size={15} />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3
          title={movie.Title}
          className="truncate font-semibold text-white"
        >
          {movie.Title}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm text-zinc-400">
            {movie.Year}
          </span>
          <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-300">
            {movie.Type || "Movie"}
          </span>
        </div>

        <button
          onClick={() => onDetails(movie)}
          className="mt-3 w-full rounded-lg border border-white/10 py-2 text-sm font-medium text-zinc-300 transition hover:border-orange-500 hover:text-orange-400 md:hidden"
        >
          View Details
        </button>
      </div>
    </article>
  );
};

export default MovieCard;