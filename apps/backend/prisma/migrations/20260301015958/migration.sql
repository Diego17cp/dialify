/*
  Warnings:

  - The primary key for the `track_artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tracks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_track_id_fkey";

-- DropForeignKey
ALTER TABLE "playback_histories" DROP CONSTRAINT "playback_histories_track_id_fkey";

-- DropForeignKey
ALTER TABLE "playlist_tracks" DROP CONSTRAINT "playlist_tracks_track_id_fkey";

-- DropForeignKey
ALTER TABLE "track_artists" DROP CONSTRAINT "track_artists_track_id_fkey";

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "target_id" SET DATA TYPE TEXT,
ALTER COLUMN "track_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "playback_histories" ALTER COLUMN "track_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "playlist_tracks" ALTER COLUMN "track_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "track_artists" DROP CONSTRAINT "track_artists_pkey",
ALTER COLUMN "track_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "track_artists_pkey" PRIMARY KEY ("track_id", "artist_id");

-- AlterTable
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tracks_id_seq";

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playback_histories" ADD CONSTRAINT "playback_histories_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
