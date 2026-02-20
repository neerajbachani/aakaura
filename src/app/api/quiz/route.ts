import { prisma } from "@/config/prisma";
import { errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(async () => {
  const questions = await prisma.quizQuestion.findMany({
    include: {
      answers: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  
  return successResponse("Quiz data fetched successfully", questions);
});
