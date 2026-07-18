-- DropForeignKey
ALTER TABLE "DinnerPartyGuest" DROP CONSTRAINT "DinnerPartyGuest_partyId_fkey";

-- DropForeignKey
ALTER TABLE "DinnerPartyGuest" DROP CONSTRAINT "DinnerPartyGuest_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AccessCode" (
    "code" TEXT NOT NULL,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "DinnerPartyGuest" ADD CONSTRAINT "DinnerPartyGuest_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "DinnerParty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DinnerPartyGuest" ADD CONSTRAINT "DinnerPartyGuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
