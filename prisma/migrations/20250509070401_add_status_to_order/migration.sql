/*
  Warnings:

  - You are about to drop the `registration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `registration`;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(191) NOT NULL,
    `senderName` VARCHAR(191) NOT NULL,
    `senderAddress` VARCHAR(191) NOT NULL,
    `consigneeName` VARCHAR(191) NOT NULL,
    `consigneeAddress` VARCHAR(191) NOT NULL,
    `transport` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `colly` VARCHAR(191) NOT NULL,
    `weight` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `airwayBill` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_airwayBill_key`(`airwayBill`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
