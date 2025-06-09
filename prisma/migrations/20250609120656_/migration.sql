/*
  Warnings:

  - You are about to drop the column `role` on the `org_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "org_members" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
