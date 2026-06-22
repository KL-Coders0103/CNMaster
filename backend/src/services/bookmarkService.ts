import prisma from "../config/prisma";

export const toggleBookmark = async (userId: string, questionId: string) => {
  const existing = await prisma.bookmarkedQuestion.findUnique({
    where: {
      userId_questionId: { userId, questionId },
    },
  });

  if (existing) {
    await prisma.bookmarkedQuestion.delete({
      where: { id: existing.id },
    });
    return { 
      success: true, 
      message: "Bookmark removed", 
      data: { bookmarked: false } 
    };
  }

  await prisma.bookmarkedQuestion.create({
    data: { userId, questionId },
  });

  return { 
    success: true, 
    message: "Question bookmarked", 
    data: { bookmarked: true } 
  };
};

export const fetchBookmarks = async (userId: string) => {
  const bookmarks = await prisma.bookmarkedQuestion.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          chapter: { select: { title: true } } 
        }
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { 
    success: true, 
    message: "Bookmarks fetched successfully", 
    data: bookmarks 
  };
};