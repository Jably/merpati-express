-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(191) NOT NULL,
    `namaPT` VARCHAR(191) NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `invoiceDate` DATETIME(3) NOT NULL,
    `totalAmount` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Invoice_invoiceNumber_key`(`invoiceNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `id` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `no` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `pengirim` VARCHAR(191) NOT NULL,
    `kotaOrigin` VARCHAR(191) NOT NULL,
    `penerima` VARCHAR(191) NOT NULL,
    `kotaTujuan` VARCHAR(191) NOT NULL,
    `noTiket` VARCHAR(191) NOT NULL,
    `partDesc` VARCHAR(191) NOT NULL,
    `colly` INTEGER NOT NULL,
    `kg` DOUBLE NOT NULL,
    `ket` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `biayaPerKg` DOUBLE NOT NULL,
    `totalBiayaItem` DOUBLE NOT NULL,

    INDEX `InvoiceItem_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
