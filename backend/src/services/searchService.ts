import prisma from "../config/prisma";

export const globalSearch = async (query: string) => {
  const sanitizedQuery = query.trim();

  if (!sanitizedQuery) {
    return { success: true, data: { chapters: [], notes: [], assignments: [] } };
  }

  const [chapters, notes, assignments] = await Promise.all([
    prisma.chapter.findMany({
      where: {
        OR: [
          { title: { contains: sanitizedQuery, mode: "insensitive" } },
          { description: { contains: sanitizedQuery, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    prisma.note.findMany({
      where: {
        OR: [
          { title: { contains: sanitizedQuery, mode: "insensitive" } },
          { description: { contains: sanitizedQuery, mode: "insensitive" } },
        ],
      },
      include: { chapter: { select: { title: true } } },
      take: 5,
    }),
    prisma.assignment.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: sanitizedQuery, mode: "insensitive" } },
          { description: { contains: sanitizedQuery, mode: "insensitive" } },
        ],
      },
      include: { chapter: { select: { title: true } } },
      take: 5,
    }),
  ]);

  return {
    success: true,
    data: {
      chapters,
      notes,
      assignments,
    },
  };
};