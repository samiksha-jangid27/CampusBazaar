/*
  Warnings:

  - Added the required column `subcategory` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `Listing` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "subcategory" TEXT NOT NULL,
ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "_SavedListings" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SavedListings_AB_unique" ON "_SavedListings"("A", "B");

-- CreateIndex
CREATE INDEX "_SavedListings_B_index" ON "_SavedListings"("B");

-- AddForeignKey
ALTER TABLE "_SavedListings" ADD CONSTRAINT "_SavedListings_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedListings" ADD CONSTRAINT "_SavedListings_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
