/*
  Warnings:

  - Added the required column `completion_rate` to the `playback_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `track_duration` to the `playback_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diversity_score` to the `recommendation_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `search_stats` to the `recommendation_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `track_stats` to the `recommendation_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "playback_histories" ADD COLUMN     "completion_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "source" VARCHAR(255),
ADD COLUMN     "track_duration" INTEGER NOT NULL,
ADD COLUMN     "was_skipped" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "recommendation_profiles" ADD COLUMN     "diversity_score" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "search_stats" JSONB NOT NULL,
ADD COLUMN     "track_stats" JSONB NOT NULL;
