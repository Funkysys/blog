"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useArtists } from "@/hook/useArtists";
import { TeamMember } from "@/types";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TeamSelectorV2Props {
  team: TeamMember[];
  onChange: (team: TeamMember[]) => void;
  className?: string;
}

const TeamSelectorV2 = ({ team, onChange, className }: TeamSelectorV2Props) => {
  const [inputName, setInputName] = useState("");
  const [inputFunction, setInputFunction] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: artists = [], isLoading } = useArtists();

  // Références pour la protection contre les régressions
  const lastValidTeamRef = useRef<TeamMember[]>([]);
  const teamLengthRef = useRef(0);
  const isIntentionalRemoval = useRef(false);

  // Surveillance des changements d'équipe avec protection
  useEffect(() => {
    console.log("👥 TeamV2: team changed to:", team, "length:", team.length);

    if (team.length > teamLengthRef.current) {
      console.log(
        "✅ Team growing from",
        teamLengthRef.current,
        "to",
        team.length
      );
      lastValidTeamRef.current = [...team];
      teamLengthRef.current = team.length;
    } else if (
      team.length < teamLengthRef.current &&
      lastValidTeamRef.current.length > team.length
    ) {
      if (isIntentionalRemoval.current) {
        console.log("✅ Intentional removal detected, allowing reduction");
        lastValidTeamRef.current = [...team];
        teamLengthRef.current = team.length;
      } else {
        console.log("🚨 Suspicious team reduction detected! Restoring...");
        setTimeout(() => {
          onChange([...lastValidTeamRef.current]);
        }, 100);
        return;
      }
    } else if (
      team.length === teamLengthRef.current &&
      JSON.stringify(team) !== JSON.stringify(lastValidTeamRef.current)
    ) {
      lastValidTeamRef.current = [...team];
    }

    if (lastValidTeamRef.current.length === 0 && team.length > 0) {
      lastValidTeamRef.current = [...team];
      teamLengthRef.current = team.length;
    }
  }, [team, onChange]);

  // Filtrer les suggestions basées sur le nom
  const filteredSuggestions = artists.filter(
    (artist) =>
      artist.toLowerCase().includes(inputName.toLowerCase()) &&
      !team.some((member) => member.name === artist) &&
      inputName.length > 0
  );

  // Ajouter un membre avec nom et fonction
  const addMember = (name: string, functionRole: string) => {
    const cleanedName = name.trim();
    const cleanedFunction = functionRole.trim();

    if (cleanedName && !team.some((member) => member.name === cleanedName)) {
      const newMember: TeamMember = {
        id: Date.now().toString(), // ID temporaire
        name: cleanedName,
        function: cleanedFunction,
      };
      const newTeam = [...team, newMember];
      console.log("➕ Adding member:", newMember);
      onChange(newTeam);
      setInputName("");
      setInputFunction("");
      setShowSuggestions(false);
    }
  };

  // Supprimer un membre
  const removeMember = (memberToRemove: TeamMember) => {
    console.log("🗑️ Intentional removal of:", memberToRemove.name);
    isIntentionalRemoval.current = true;
    const newTeam = team.filter((member) => member.id !== memberToRemove.id);
    lastValidTeamRef.current = [...newTeam];
    teamLengthRef.current = newTeam.length;
    onChange(newTeam);
    setTimeout(() => {
      isIntentionalRemoval.current = false;
    }, 500);
  };

  // Gérer l'ajout par Entrée
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputName.trim() && inputFunction.trim()) {
      e.preventDefault();
      addMember(inputName, inputFunction);
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Membres actuels */}
        {team.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {team.map((member) => (
              <Badge
                key={member.id}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                <span className="font-medium">{member.name}</span>
                <span className="text-xs opacity-75">- {member.function}</span>
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

        {/* Formulaire d'ajout */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Input
                type="text"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(inputName.length > 0)}
                placeholder="Nom de l'artiste..."
                className="w-full"
              />

              {/* Suggestions pour le nom */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                  {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setInputName(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Input
              type="text"
              value={inputFunction}
              onChange={(e) => setInputFunction(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Fonction (piano, guitare...)..."
              className="w-full"
            />
          </div>

          <Button
            type="button"
            onClick={() => addMember(inputName, inputFunction)}
            disabled={!inputName.trim() || !inputFunction.trim()}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Ajouter membre
          </Button>
        </div>

        {/* Suggestions rapides */}
        {!showSuggestions && artists.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Artistes fréquents :
            </p>
            <div className="flex flex-wrap gap-2">
              {artists
                .filter(
                  (artist) => !team.some((member) => member.name === artist)
                )
                .slice(0, 6)
                .map((artist, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputName(artist)}
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

export default TeamSelectorV2;
