/*
  Warnings:

  - Added the required column `title` to the `DinnerParty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DinnerParty" ADD COLUMN     "title" TEXT NOT NULL;
