-- CreateEnum
CREATE TYPE "TrackStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "status" "TrackStatus" NOT NULL DEFAULT 'PENDING';
