import { formatTeamMember, getArtistSlug } from "@/utils/formatTeam";
import Link from "next/link";

interface PostTeamDisplayProps {
  team: any;
  className?: string;
}

export const PostTeamDisplay = ({
  team,
  className = "",
}: PostTeamDisplayProps) => {
  if (!team || !Array.isArray(team) || team.length === 0) return null;

  const formatMember = (member: any): { name: string; displayText: string } => {
    if (typeof member === "string") {
      const parts = member.split(" - ");
      return {
        name: parts[0]?.trim() || member,
        displayText: member,
      };
    } else if (typeof member === "object" && member.name) {
      return {
        name: member.name,
        displayText: formatTeamMember(member),
      };
    }
    return {
      name: String(member),
      displayText: String(member),
    };
  };

  return (
    <div className={`team-members ${className}`}>
      {team.map((member: any, index: number) => {
        const { name, displayText } = formatMember(member);
        const artistSlug = getArtistSlug(name);

        return (
          <div key={index} className="mb-2">
            <Link
              href={`/from-artists/${artistSlug}`}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {displayText}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
