import { Prisma } from "@prisma/client";

export type Category = {
  id: number;
  title: string;
  slug: string;
  description: string;
};
type Track = {
  id: string;
  name: string;
  number: string;
};

type Link = {
  id: string;
  name: string;
  url: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  nbView: number;
  nbComments: number;
  userEmail: string;
  userName: string;
  userImage: string;
  catSlug: string;
  catTitle: string;
  artist: string;
  team: string[];
  trackList: Track[];
  links: Link[];
  createdAt: string;
  release: string;
};

export type PostWithCategory = Prisma.PostGetPayload<{
  include: { cat: true };
}>;

export type CommentWithUser = Prisma.CommentGetPayload<{
  include: { user: true };
}>;
