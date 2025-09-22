import { TeamMember } from "@/types";

export const formatTeamMember = (member: TeamMember): string => {
  return `${member.name} - ${member.function}`;
};

export const getArtistSlug = (artistName: string): string => {
  return artistName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
