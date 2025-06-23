/*
  Warnings:

  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `categories` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "categories_email_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "updateAt";
