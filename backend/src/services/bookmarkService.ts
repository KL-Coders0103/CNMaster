import prisma from "../config/prisma";

export const toggleBookmark = async (userId: string, questionId: string) => {
  const existing = await prisma.bookmarkedQuestion.findUnique({
    where: {
      userId_questionId: { userId, questionId },
    },
  });

  if (existing) {
    try {
      await prisma.bookmarkedQuestion.delete({
        where: { userId_questionId: { userId, questionId } },
      });
    } catch (error: any) {
      if (error.code !== 'P2025') throw error; 
    }
    
    return { 
      success: true, 
      message: "Bookmark removed", 
      data: { bookmarked: false } 
    };
  } else {
    try {
      await prisma.bookmarkedQuestion.create({
        data: { userId, questionId },
      });
    } catch (error: any) {
      if (error.code !== 'P2002') throw error;
    }

    return { 
      success: true, 
      message: "Question bookmarked", 
      data: { bookmarked: true } 
    };
  }
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
    take: 50,
  });

  return { 
    success: true, 
    message: "Bookmarks fetched successfully", 
    data: bookmarks 
  };
};