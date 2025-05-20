-- CreateTable
CREATE TABLE "Renewal" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "renewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "months" INTEGER NOT NULL,
    "newEndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Renewal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Renewal" ADD CONSTRAINT "Renewal_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
