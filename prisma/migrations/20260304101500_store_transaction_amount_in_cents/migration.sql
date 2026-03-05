-- AlterTable
ALTER TABLE "transactions"
ALTER COLUMN "amount" TYPE INTEGER
USING ROUND("amount" * 100)::INTEGER;
