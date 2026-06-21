import prisma from "../config/prisma";

export const getAssignments =
  async (
    filters: {
      chapterId?: string;
      search?: string;
    },

    studentId?: string
  ) => {

    return prisma.assignment.findMany({
      where: {
        isPublished: true,

        ...(filters.chapterId && {
          chapterId:
            filters.chapterId,
        }),

        ...(filters.search && {
          OR: [
            {
              title: {
                contains:
                  filters.search,

                mode:
                  "insensitive",
              },
            },

            {
              description: {
                contains:
                  filters.search,

                mode:
                  "insensitive",
              },
            },
          ],
        }),
      },

      include: {

        chapter: {
          include: {
            subject: true,
          },
        },

        submissions:
          studentId
            ? {
                where: {
                  studentId,
                },

                select: {
                  status: true,
                },
              }
            : false,
      },

      orderBy: {
        dueDate: "asc",
      },
    });
  };

export const getAssignmentById =
  async (assignmentId: string) => {

    return prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },

      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
      },
    });
  };

export const getStudentSubmission =
  async (
    assignmentId: string,
    studentId: string
  ) => {

    return prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
    });
  };

export const createSubmission =
  async (
    assignmentId: string,
    studentId: string,
    submissionUrl: string,
    isLateSubmission: boolean
  ) => {

    return prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId,
        submissionUrl,
        isLateSubmission,
      },
    });
  };

export const updateSubmission =
  async (
    assignmentId: string,
    studentId: string,
    submissionUrl: string,
    isLateSubmission: boolean
  ) => {

    return prisma.assignmentSubmission.update({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },

      data: {
        submissionUrl,
        submittedAt: new Date(),
        status: "SUBMITTED",
        isLateSubmission,
      },
    });
  };

export const getStudentSubmissionHistory =
  async (
    studentId: string
  ) => {

    return prisma.assignmentSubmission.findMany({
      where: {
        studentId,
      },

      include: {
        assignment: {
          include: {
            chapter: {
              include: {
                subject: true,
              },
            },
          },
        },
      },

      orderBy: {
        submittedAt: "desc",
      },
    });
  };

  export const getUpcomingAssignment =
  async (
    studentId: string
  ) => {

    return prisma.assignment.findFirst({

      where: {
        isPublished: true,

        dueDate: {
          gte: new Date(),
        },

        submissions: {
          none: {
            studentId,
          },
        },
      },

      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
      },

      orderBy: {
        dueDate: "asc",
      },
    });
  };

  export const getAssignmentAnalytics =
  async (
    studentId: string
  ) => {

    const submissions =
      await prisma.assignmentSubmission.findMany({
        where: {
          studentId,
        },

        include: {
          assignment: true,
        },
      });

    const completed =
      submissions.length;

    const pending =
      await prisma.assignment.count({
        where: {
          isPublished: true,

          submissions: {
            none: {
              studentId,
            },
          },
        },
      });

    const reviewed =
      submissions.filter(
        item =>
          item.marksObtained !==
          null
      );

    const averageMarks =
      reviewed.length === 0
        ? 0
        : Math.round(
            reviewed.reduce(
              (sum, item) =>
                sum +
                (item.marksObtained ??
                  0),
              0
            ) /
              reviewed.length
          );

    const submissionRate =
      completed + pending === 0
        ? 0
        : Math.round(
            (completed /
              (completed +
                pending)) *
              100
          );

    return {
      completed,
      pending,
      averageMarks,
      submissionRate,
    };
  };