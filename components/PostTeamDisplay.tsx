import { TeamMember } from "@/types";
import { formatTeamMember, getArtistSlug } from "@/utils/formatTeam";
import Link from "next/link";

interface PostTeamDisplayProps {
  team: TeamMember[];
  className?: string;
}

export const PostTeamDisplay = ({
  team,
  className = "",
}: PostTeamDisplayProps) => {
  if (!team || team.length === 0) return null;

  return (
    <div className={`team-members ${className}`}>
      {team.map((member, index) => {
        const artistSlug = getArtistSlug(member.name);

        return (
          <div key={member.id || index} className="mb-2">
            <Link
              href={`/form-artist/${artistSlug}`}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {formatTeamMember(member)}
            </Link>
          </div>
        );
      })}
    </div>
  );
};
