"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type SearchResult = {
  id: string;
  title: string;
  type: "album" | "artist" | "team";
  slug: string;
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/search?query=${encodeURIComponent(query)}`
      );
      setResults(data);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "album") {
      router.push(`/posts/${result.slug}`);
    } else if (result.type === "artist") {
      router.push(`/from-artists/${result.slug}`);
    } else if (result.type === "team") {
      router.push(`/from-artists/${result.slug}`);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un album, un artiste ou un membre d'équipe..."
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Recherche..." : "Rechercher"}
        </Button>
      </div>
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black border-b border-gray-100 last:border-b-0"
            >
              <span className="font-medium">{result.title}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({result.type})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
