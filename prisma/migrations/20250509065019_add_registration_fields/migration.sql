/*
  Warnings:

  - You are about to drop the column `consigneeDistrict` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `consigneeName` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `consigneeProvince` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `consigneeRegency` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `consigneeVillage` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `detailOrderNumber` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `senderDistrict` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `senderName` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `senderProvince` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `senderRegency` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `senderVillage` on the `registration` table. All the data in the column will be lost.
  - Added the required column `consignee` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `Registration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registration` DROP COLUMN `consigneeDistrict`,
    DROP COLUMN `consigneeName`,
    DROP COLUMN `consigneeProvince`,
    DROP COLUMN `consigneeRegency`,
    DROP COLUMN `consigneeVillage`,
    DROP COLUMN `detailOrderNumber`,
    DROP COLUMN `keterangan`,
    DROP COLUMN `orderId`,
    DROP COLUMN `senderDistrict`,
    DROP COLUMN `senderName`,
    DROP COLUMN `senderProvince`,
    DROP COLUMN `senderRegency`,
    DROP COLUMN `senderVillage`,
    ADD COLUMN `consignee` VARCHAR(191) NOT NULL,
    ADD COLUMN `orderNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender` VARCHAR(191) NOT NULL,
    MODIFY `transactionStatus` VARCHAR(191) NOT NULL DEFAULT 'pending';
