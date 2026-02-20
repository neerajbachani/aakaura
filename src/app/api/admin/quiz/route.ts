import { prisma } from "@/config/prisma";
import { authenticate } from "@/middleware/auth";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

// GET: Fetch all questions (Admin)
export const GET = errorHandler(async (req: Request) => {
  await authenticate(req); // Ensure user is admin

  const questions = await prisma.quizQuestion.findMany({
    include: {
      answers: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  return successResponse("Questions fetched successfully", questions);
});

// POST: Create a new question
export const POST = errorHandler(async (req: Request) => {
  await authenticate(req); // Ensure user is admin

  const body = await req.json();
  const { question, multiSelect, answers } = body;

  const newQuestion = await prisma.quizQuestion.create({
    data: {
      question,
      multiSelect,
      answers: {
        create: answers.map((a: any) => ({
          text: a.text,
          chakra: a.chakra,
          state: a.state,
          weight: parseFloat(a.weight) || 1.0,
        })),
      },
    },
    include: {
      answers: true,
    },
  });

  return successResponse("Question created successfully", newQuestion, 201);
});

// PUT: Update a question
export const PUT = errorHandler(async (req: Request) => {
  await authenticate(req); // Ensure user is admin

  const body = await req.json();
  const { id, question, multiSelect, answers } = body;

  if (!id) {
    throw new ApiError("Question ID is required", 400);
  }

  // Transaction to update question and replace answers
  const updatedQuestion = await prisma.$transaction(async (tx) => {
    // 1. Update question details
    await tx.quizQuestion.update({
      where: { id },
      data: {
        question,
        multiSelect,
      },
    });

    // 2. Delete existing answers
    await tx.quizAnswer.deleteMany({
      where: { questionId: id },
    });

    // 3. Create new answers
    await tx.quizAnswer.createMany({
      data: answers.map((a: any) => ({
        text: a.text,
        chakra: a.chakra,
        state: a.state,
        weight: parseFloat(a.weight) || 1.0,
        questionId: id,
      })),
    });

    return tx.quizQuestion.findUnique({
      where: { id },
      include: { answers: true },
    });
  });

  return successResponse("Question updated successfully", updatedQuestion);
});

// DELETE: Delete a question
export const DELETE = errorHandler(async (req: Request) => {
  await authenticate(req); // Ensure user is admin

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    throw new ApiError("Question ID is required", 400);
  }

  await prisma.quizQuestion.delete({
    where: { id },
  });

  return successResponse("Question deleted successfully");
});
