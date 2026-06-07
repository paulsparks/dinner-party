-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';

-- CreateTable
CREATE TABLE "DinnerParty" (
    "id" SERIAL NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "DinnerParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DinnerPartyGuest" (
    "partyId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DinnerPartyGuest_pkey" PRIMARY KEY ("partyId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DinnerPartyGuest_partyId_userId_key" ON "DinnerPartyGuest"("partyId", "userId");

-- AddForeignKey
ALTER TABLE "DinnerPartyGuest" ADD CONSTRAINT "DinnerPartyGuest_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "DinnerParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DinnerPartyGuest" ADD CONSTRAINT "DinnerPartyGuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
