import prisma from "../config/prisma";

export const getTodayChallenge =
  async () => {

    const today =
      new Date();

    today.setHours(
      0,0,0,0
    );

    let challenge =
      await prisma.dailyChallenge.findUnique({
        where: {
          date: today,
        },
      });

    if (challenge) {

      const questions =
        await prisma.question.findMany({
          where: {
            id: {
              in:
                challenge.questionIds,
            },
          },
        });

      return {
        challenge,
        questions,
      };
    }

    const randomQuestions =
      await prisma.question.findMany({
        take: 10,
      });

    challenge =
      await prisma.dailyChallenge.create({
        data: {
          date: today,

          difficulty:
            "MEDIUM",

          questionIds:
            randomQuestions.map(
              q => q.id
            ),
        },
      });

    return {
      challenge,
      questions:
        randomQuestions,
    };
  };