import React from "react";
import { FiHeart, FiFilm } from "react-icons/fi";

const Navbar = ({ page, setPage, favoritesCount }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <button
          onClick={() => setPage("home")}
          className="flex shrink-0 items-center gap-2 text-lg font-black tracking-tight sm:text-2xl"
        >
          <span className="rounded-xl bg-orange-500 p-2 text-white">
            <FiFilm size={23} />
          </span>
          <span>
            Cine<span className="text-orange-500">Verse</span>
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={() => setPage("home")}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
              page === "home"
                ? "bg-white/10 text-orange-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiFilm size={17} />
            <span className="hidden sm:inline">Discover</span>
          </button>

          <button
            className={`relative flex items-center gap-1.5 rounded-full px-2 py-2 text-xs transition sm:gap-2 sm:px-3 sm:text-sm ${
              page === "favorites"
                ? "bg-white/10 text-orange-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <FiHeart size={17} />
            <span>Watchlist</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
              {favoritesCount}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
