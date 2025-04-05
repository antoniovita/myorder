/*
  Warnings:

  - A unique constraint covering the columns `[orderId,itemId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "imgUrl" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "observation" TEXT;

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "imgUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_itemId_key" ON "OrderItem"("orderId", "itemId");
