/*
  Warnings:

  - You are about to drop the column `createdAt` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `books` table. All the data in the column will be lost.
  - Added the required column `priceRequest` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "createdAt",
DROP COLUMN "price",
DROP COLUMN "updateAt",
ADD COLUMN     "priceRequest" INTEGER NOT NULL;
