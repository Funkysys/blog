"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useArtists } from "@/hook/useArtists";
import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { TeamMember } from "@/types";

interface TeamSelectorProps {
  team: TeamMember[];
  onChange: (team: TeamMember[]) => void;
  className?: string;
}

const TeamSelector = ({ team, onChange, className }: TeamSelectorProps) => {
  const [inputName, setInputName] = useState("");
  const [inputFunction, setInputFunction] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: artists = [], isLoading } = useArtists();

  // Référence pour la dernière équipe valide
  const lastValidTeamRef = useRef<TeamMember[]>([]);
  const teamLengthRef = useRef(0);
  const isIntentionalRemoval = useRef(false);

  // Debug: surveiller les changements de team et protéger contre les régressions
  useEffect(() => {
    console.log('TeamSelector: team prop changed to:', team, 'length:', team.length);
    
    // Si l'équipe grandit, c'est un ajout valide
    if (team.length > teamLengthRef.current) {
      console.log('✅ Team growing from', teamLengthRef.current, 'to', team.length);
      lastValidTeamRef.current = [...team];
      teamLengthRef.current = team.length;
    }
    // Si l'équipe rétrécit sans qu'il y ait eu de clic sur une croix, c'est suspect
    else if (team.length < teamLengthRef.current && lastValidTeamRef.current.length > team.length) {
      if (isIntentionalRemoval.current) {
        console.log('✅ Intentional removal detected, allowing reduction from', teamLengthRef.current, 'to', team.length);
        lastValidTeamRef.current = [...team];
        teamLengthRef.current = team.length;
      } else {
        console.log('🚨 Suspicious team reduction detected! From', teamLengthRef.current, 'to', team.length);
        console.log('🔄 Restoring to:', lastValidTeamRef.current);
        setTimeout(() => {
          onChange([...lastValidTeamRef.current]);
        }, 100);
        return;
      }
    }
    // Si c'est la même taille mais un contenu différent, vérifier
    else if (team.length === teamLengthRef.current && JSON.stringify(team) !== JSON.stringify(lastValidTeamRef.current)) {
      console.log('⚠️ Team content changed without size change');
      lastValidTeamRef.current = [...team];
    }
    
    // Initialiser si c'est la première fois
    if (lastValidTeamRef.current.length === 0 && team.length > 0) {
      lastValidTeamRef.current = [...team];
      teamLengthRef.current = team.length;
    }
  }, [team, onChange]);

  // Filtrer les suggestions basées sur l'input
  const filteredSuggestions = artists.filter(
    (artist) =>
      artist.toLowerCase().includes(inputValue.toLowerCase()) &&
      !team.includes(artist) &&
      inputValue.length > 0
  );

  // Fonction pour nettoyer les caractères invisibles et problématiques
  const cleanMember = (member: string): string => {
    return member
      .trim()
      .replace(/\u00A0/g, " ") // Remplacer les espaces insécables
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // Supprimer les caractères de largeur zéro
      .replace(/[\u2000-\u200A]/g, " ") // Remplacer tous types d'espaces Unicode
      .replace(/[\u2028\u2029]/g, "") // Supprimer les séparateurs de ligne/paragraphe
      .replace(/[\r\n\t]/g, " ") // Remplacer retours chariot, nouvelles lignes, tabs
      .replace(/[^\x00-\x7F]/g, (char) => {
        // Garder seulement les caractères ASCII imprimables et quelques accents courants
        const keepChars = "àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß";
        return keepChars.includes(char) ? char : "";
      })
      .replace(/\s+/g, " ") // Normaliser les espaces multiples
      .trim();
  };

  const addMember = (member: string, keepInput: boolean = false) => {
    const cleanedMember = cleanMember(member);
    console.log(
      "Adding member:",
      `"${member}"`,
      "→ cleaned:",
      `"${cleanedMember}"`,
      "Current team:",
      team
    );

    if (cleanedMember && !team.includes(cleanedMember)) {
      const newTeam = [...team, cleanedMember];
      console.log("New team will be:", newTeam);
      onChange(newTeam);
      if (!keepInput) {
        setInputValue("");
        setShowSuggestions(false);
      }
    } else if (cleanedMember) {
      console.log("Member already exists in team:", cleanedMember);
    }
  };

  const addMultipleMembers = (members: string[]) => {
    console.log(
      "addMultipleMembers called with:",
      members,
      "Current team:",
      team
    );

    // Nettoyer et filtrer les membres valides
    const validMembers = members
      .map((m) => cleanMember(m))
      .filter((m) => {
        const isValid = m && !team.includes(m);
        console.log(
          `Member "${m}": valid=${isValid}, exists=${team.includes(m)}`
        );
        return isValid;
      });

    console.log("Valid members to add:", validMembers);

    if (validMembers.length > 0) {
      const newTeam = [...team, ...validMembers];
      console.log("New team will be:", newTeam);
      console.log("Calling onChange with:", newTeam);
      onChange(newTeam);
      console.log("onChange called successfully");

      // Clear input after successful addition  
      setInputValue("");
      setShowSuggestions(false);
    } else {
      console.log("No valid members to add - either empty or duplicates");
    }
  };

  const removeMember = (memberToRemove: string) => {
    console.log('🗑️ Intentional removal of:', memberToRemove);
    isIntentionalRemoval.current = true;
    const newTeam = team.filter((member) => member !== memberToRemove);
    lastValidTeamRef.current = [...newTeam]; // Mettre à jour la référence avec la nouvelle équipe
    teamLengthRef.current = newTeam.length;
    onChange(newTeam);
    // Reset le flag après un délai
    setTimeout(() => {
      isIntentionalRemoval.current = false;
    }, 500);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      // Vérifier s'il y a des virgules pour l'ajout multiple
      if (inputValue.includes(",")) {
        const members = inputValue
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m);
        addMultipleMembers(members);
      } else {
        addMember(inputValue);
      }

      setInputValue("");
      setShowSuggestions(false);
      // Garder le focus sur l'input pour continuer à ajouter
      (e.target as HTMLInputElement).focus();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input changed to:", `"${value}"`, "length:", value.length);
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // Empêcher le collage par défaut
    const pastedText = e.clipboardData.getData('text');
    console.log("Pasted text:", `"${pastedText}"`, "length:", pastedText.length);
    
    // Nettoyer le texte collé
    const cleanedText = cleanMember(pastedText);
    console.log("Cleaned pasted text:", `"${cleanedText}"`);
    
    // Remplacer le contenu de l'input avec le texte nettoyé
    setInputValue(cleanedText);
    setShowSuggestions(cleanedText.length > 0);
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
              onPaste={handlePaste}
              onFocus={() => setShowSuggestions(inputValue.length > 0)}
              placeholder="Ajouter un membre (ou plusieurs séparés par des virgules)..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                console.log(
                  "Add button clicked with input:",
                  `"${inputValue}"`
                );

                // Vérifier s'il y a des virgules
                if (inputValue.includes(",")) {
                  console.log("Multiple members detected (contains comma)");
                  const members = inputValue
                    .split(",")
                    .map((m) => m.trim())
                    .filter((m) => m);
                  console.log("Split members:", members);
                  addMultipleMembers(members);
                } else {
                  console.log("Single member detected");
                  addMember(inputValue);
                }
              }}
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
