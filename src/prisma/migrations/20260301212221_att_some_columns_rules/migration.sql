/*
  Warnings:

  - You are about to alter the column `name` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "date" SET DATA TYPE DATE;
