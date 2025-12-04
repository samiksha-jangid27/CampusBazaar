/*
  Warnings:

  - The primary key for the `_SavedListings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_SavedListings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_SavedListings" DROP CONSTRAINT "_SavedListings_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_SavedListings_AB_unique" ON "_SavedListings"("A", "B");
