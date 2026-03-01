/*
  Warnings:

  - The primary key for the `artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `playlists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `track_artists` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "playlist_tracks" DROP CONSTRAINT "playlist_tracks_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "track_artists" DROP CONSTRAINT "track_artists_artist_id_fkey";

-- AlterTable
ALTER TABLE "artists" DROP CONSTRAINT "artists_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "artists_id_seq";

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "artist_id" SET DATA TYPE TEXT,
ALTER COLUMN "playlist_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "playlist_tracks" ALTER COLUMN "playlist_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "playlists" DROP CONSTRAINT "playlists_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "playlists_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "playlists_id_seq";

-- AlterTable
ALTER TABLE "track_artists" DROP CONSTRAINT "track_artists_pkey",
ALTER COLUMN "artist_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "track_artists_pkey" PRIMARY KEY ("track_id", "artist_id");

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlists"("id") ON DELETE SET NULL ON UPDATE CASCADE;
