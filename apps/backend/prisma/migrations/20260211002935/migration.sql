/*
  Warnings:

  - A unique constraint covering the columns `[user_id,query]` on the table `search_histories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `last_searched_at` to the `search_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "search_histories" ADD COLUMN     "has_played" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_searched_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "results_count" INTEGER,
ADD COLUMN     "search_count" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "search_histories_user_id_query_key" ON "search_histories"("user_id", "query");
