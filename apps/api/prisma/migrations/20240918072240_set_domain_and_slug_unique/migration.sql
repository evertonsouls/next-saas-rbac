/*
  Warnings:

  - A unique constraint covering the columns `[slug,domain]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "organizations_domain_key";

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_domain_key" ON "organizations"("slug", "domain");
