"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useArtists } from "@/hook/useArtists";
import { X } from "lucide-react";
import { useState } from "react";

interface TeamSelectorProps {
  team: string[];
  onChange: (team: string[]) => void;
  className?: string;
}

const TeamSelector = ({ team, onChange, className }: TeamSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: artists = [], isLoading } = useArtists();

  // Filtrer les suggestions basées sur l'input
  const filteredSuggestions = artists.filter(
    (artist) =>
      artist.toLowerCase().includes(inputValue.toLowerCase()) &&
      !team.includes(artist) &&
      inputValue.length > 0
  );

  const addMember = (member: string) => {
    if (member.trim() && !team.includes(member.trim())) {
      onChange([...team, member.trim()]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeMember = (memberToRemove: string) => {
    onChange(team.filter((member) => member !== memberToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addMember(inputValue);
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Membres actuels */}
        {team.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {team.map((member, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                <span>{member}</span>
                <button
                  type="button"
                  onClick={() => removeMember(member)}
                  className="hover:bg-red-500 hover:text-white rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Input pour ajouter de nouveaux membres */}
        <div className="relative">
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setShowSuggestions(inputValue.length > 0)}
              placeholder="Ajouter un membre d'équipe..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => addMember(inputValue)}
              disabled={!inputValue.trim()}
              variant="outline"
              size="sm"
            >
              Ajouter
            </Button>
          </div>

          {/* Suggestions déroulantes */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
              {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addMember(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ajout rapide depuis les suggestions populaires */}
        {!showSuggestions && artists.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Artistes fréquents :
            </p>
            <div className="flex flex-wrap gap-2">
              {artists
                .filter((artist) => !team.includes(artist))
                .slice(0, 8)
                .map((artist, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addMember(artist)}
                    className="text-xs h-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    + {artist}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {isLoading && (
          <p className="text-sm text-gray-500">Chargement des artistes...</p>
        )}
      </div>
    </div>
  );
};

export default TeamSelector;
