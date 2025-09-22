import { TeamMember } from "@/types";

export const formatTeamMember = (member: any): string => {
  if (typeof member === "object" && member.name && member.function) {
    return `${member.name} - ${member.function}`;
  }
  return String(member);
};

export const getArtistSlug = (artistName: string): string => {
  return artistName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
