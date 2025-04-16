import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export async function getQuestById(questId: string){
    try{
        const quest = await prisma.quest.findUnique({
            where: {
                questId
            }
        });
        return quest;
    }
    catch (error){
        console.error("Error getting quest: " + error)
        throw error;
    }
}

export async function getUserQuests(userId: string) {
    try {
      const userQuestRows = await prisma.userQuest.findMany({
        where: { userId },
        include: { quest: true },
      });
      console.log(userQuestRows);
      return userQuestRows.map((i) => i.quest);
    } 
    catch (error) {
      console.error("Error getting user quests:", error);
      throw error;
    }
  }
  
 
export async function setUserQuest(userId: string, questId: string){
    try {
        if (!await prisma.user.findUnique({where:{userId}})){
            throw Error("User not found")
        }
        const newUserQuest = await prisma.userQuest.create({
            data: {
                userId: userId,
                questId: questId,
            }
        });
        return newUserQuest;
    }
    catch (error){
        console.error("Error getting quest: " + error)
        throw error;
    }
}
