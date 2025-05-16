/*
  Warnings:

  - You are about to drop the column `address` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `option` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `transactionStatus` on the `registration` table. All the data in the column will be lost.
  - Added the required column `colly` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consigneeAddress` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consigneeDistrict` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consigneeName` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consigneeProvince` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consigneeRegency` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consigneeVillage` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailOrderNumber` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keterangan` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderAddress` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderDistrict` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderProvince` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderRegency` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderVillage` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transport` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registration` DROP COLUMN `address`,
    DROP COLUMN `email`,
    DROP COLUMN `fullName`,
    DROP COLUMN `option`,
    DROP COLUMN `phone`,
    DROP COLUMN `price`,
    DROP COLUMN `transactionStatus`,
    ADD COLUMN `colly` VARCHAR(191) NOT NULL,
    ADD COLUMN `consigneeAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `consigneeDistrict` VARCHAR(191) NOT NULL,
    ADD COLUMN `consigneeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `consigneeProvince` VARCHAR(191) NOT NULL,
    ADD COLUMN `consigneeRegency` VARCHAR(191) NOT NULL,
    ADD COLUMN `consigneeVillage` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `destination` VARCHAR(191) NOT NULL,
    ADD COLUMN `detailOrderNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `keterangan` VARCHAR(191) NOT NULL,
    ADD COLUMN `origin` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderDistrict` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderName` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderProvince` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderRegency` VARCHAR(191) NOT NULL,
    ADD COLUMN `senderVillage` VARCHAR(191) NOT NULL,
    ADD COLUMN `service` VARCHAR(191) NOT NULL,
    ADD COLUMN `transport` VARCHAR(191) NOT NULL,
    ADD COLUMN `weight` VARCHAR(191) NOT NULL;
