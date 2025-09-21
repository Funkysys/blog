-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "artist" TEXT,
ADD COLUMN     "links" JSONB,
ADD COLUMN     "team" JSONB,
ADD COLUMN     "trackList" JSONB;
