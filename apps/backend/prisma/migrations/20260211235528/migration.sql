/*
  Warnings:

  - You are about to drop the column `audio_ref` on the `tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "audio_ref",
ADD COLUMN     "bitrates" JSONB,
ADD COLUMN     "file_size" BIGINT,
ADD COLUMN     "hls_path" TEXT;

-- CreateIndex
CREATE INDEX "tracks_status_idx" ON "tracks"("status");
