-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('AVAILABLE', 'ACCEPTED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "googleId" TEXT,
    "currency" INTEGER NOT NULL DEFAULT 0,
    "hunger" INTEGER NOT NULL DEFAULT 100,
    "lastHungerUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "recipeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ingredients" TEXT[],
    "instructions" TEXT[],
    "cookingMinutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "cuisine" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("recipeId")
);

-- CreateTable
CREATE TABLE "Quest" (
    "questId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewardCurrency" INTEGER NOT NULL DEFAULT 0,
    "rewardHunger" INTEGER NOT NULL DEFAULT 0,
    "userUserId" TEXT,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("questId")
);

-- CreateTable
CREATE TABLE "UserQuest" (
    "userQuestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "QuestStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("userQuestId")
);

-- CreateTable
CREATE TABLE "Cosmetic" (
    "cosmeticId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Cosmetic_pkey" PRIMARY KEY ("cosmeticId")
);

-- CreateTable
CREATE TABLE "UserCosmetic" (
    "userId" TEXT NOT NULL,
    "cosmeticId" TEXT NOT NULL,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Achievement" (
    "userId" TEXT NOT NULL,
    "completedQuests" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_userId_questId_key" ON "UserQuest"("userId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCosmetic_userId_cosmeticId_key" ON "UserCosmetic"("userId", "cosmeticId");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_userUserId_fkey" FOREIGN KEY ("userUserId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("questId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCosmetic" ADD CONSTRAINT "UserCosmetic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCosmetic" ADD CONSTRAINT "UserCosmetic_cosmeticId_fkey" FOREIGN KEY ("cosmeticId") REFERENCES "Cosmetic"("cosmeticId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
