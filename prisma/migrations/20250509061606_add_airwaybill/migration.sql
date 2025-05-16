/*
  Warnings:

  - Added the required column `airwayBill` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionStatus` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registration` ADD COLUMN `airwayBill` VARCHAR(191) NOT NULL,
    ADD COLUMN `transactionStatus` VARCHAR(191) NOT NULL;
