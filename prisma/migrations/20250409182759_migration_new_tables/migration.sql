/*
  Warnings:

  - Added the required column `cpf` to the `Provider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "phone" INTEGER NOT NULL;
