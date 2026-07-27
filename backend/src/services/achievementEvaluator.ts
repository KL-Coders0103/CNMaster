import prisma from "../config/prisma";
import { ACHIEVEMENT_CODES } from "../constants/achievementConstants";
import { unlockAchievementIfEligible } from "./achievementService";

export const evaluateQuizAchievements = async (
  userId: string,
  chapterId: string, 
  score: number, 
  maxScore: number, 
  durationInSeconds: number, 
  isFirstAttempt: boolean
) => {
  const isPerfect = score === maxScore && maxScore > 0;

  const totalQuizzes = await prisma.quizAttempt.count({
    where: { userId, status: "COMPLETED" },
  });

  const perfectScoresCount = await prisma.quizAttempt.count({
    where: { userId, status: "COMPLETED", score: { equals: prisma.quizAttempt.fields.totalMarks } },
  });

  const achievementsToUnlock: string[] = [];

  if (totalQuizzes >= 1) achievementsToUnlock.push(ACHIEVEMENT_CODES.FIRST_QUIZ);
  if (totalQuizzes >= 10) achievementsToUnlock.push(ACHIEVEMENT_CODES.QUIZ_MASTER_10);
  if (totalQuizzes >= 50) achievementsToUnlock.push(ACHIEVEMENT_CODES.QUIZ_MASTER_50);
  if (totalQuizzes >= 100) achievementsToUnlock.push(ACHIEVEMENT_CODES.QUIZ_MASTER_100);

  if (isPerfect) {
    achievementsToUnlock.push(ACHIEVEMENT_CODES.PERFECT_SCORE);
    if (perfectScoresCount >= 5) achievementsToUnlock.push(ACHIEVEMENT_CODES.PERFECT_SCORE_5);
    if (perfectScoresCount >= 25) achievementsToUnlock.push(ACHIEVEMENT_CODES.PERFECT_SCORE_25);
    
    if (isFirstAttempt) achievementsToUnlock.push(ACHIEVEMENT_CODES.NO_MISTAKE);

    const weakArea = await prisma.weakArea.findUnique({
      where: { userId_chapterId: { userId, chapterId } }
    });

    if (weakArea && weakArea.mistakeCount >= 3) {
      achievementsToUnlock.push(ACHIEVEMENT_CODES.WEAK_AREA_CONQUEROR);
      await prisma.weakArea.update({
        where: { id: weakArea.id },
        data: { mistakeCount: 0 }
      });
    }
  }

  const isFast = durationInSeconds > 0 && durationInSeconds <= 60;
  const isGoodScore = maxScore > 0 && (score / maxScore) >= 0.8;
  if (isFast && isGoodScore) {
    achievementsToUnlock.push(ACHIEVEMENT_CODES.SPEED_DEMON);
  }

  if (achievementsToUnlock.length > 0) {
    await Promise.all(
      achievementsToUnlock.map((code) => unlockAchievementIfEligible({ userId, achievementCode: code }))
    );
  }
};

export const evaluateLearningAchievements = async (userId: string) => {
  const [ completedNotesCount, uniqueChaptersData, revisionXpCount ] = await Promise.all([

    prisma.userReadingProgress.count({
      where: { userId, isCompleted: true}
    }),
    prisma.userReadingProgress.findMany({
      where: {userId, isCompleted: true},
      select: { note: { select: { chapterId: true}}},
      distinct: ['noteId']
    }),
    prisma.xpTransaction.count({
      where: { userId, source: "REVISION_COMPLETED"}
    }),
  ]);

  const uniqueCompletedChapters = new Set(
    uniqueChaptersData.map((rp) => rp.note.chapterId)
  ).size;

  const achievementsToUnlock: string[] = [];

  if (revisionXpCount >= 10) {
    achievementsToUnlock.push(ACHIEVEMENT_CODES.REVISION_KING);
  }

  if (completedNotesCount >= 1) achievementsToUnlock.push(ACHIEVEMENT_CODES.FIRST_TOPIC_COMPLETED);
  if (completedNotesCount >= 10) achievementsToUnlock.push(ACHIEVEMENT_CODES.TOPIC_MASTER_10);
  if (completedNotesCount >= 50) achievementsToUnlock.push(ACHIEVEMENT_CODES.TOPIC_MASTER_50);

  if (uniqueCompletedChapters >= 1) achievementsToUnlock.push(ACHIEVEMENT_CODES.FIRST_MODULE_COMPLETED);
  if (uniqueCompletedChapters >= 5) achievementsToUnlock.push(ACHIEVEMENT_CODES.MODULE_MASTER_5);
  if (uniqueCompletedChapters >= 10) achievementsToUnlock.push(ACHIEVEMENT_CODES.MODULE_MASTER_10);

  if (uniqueCompletedChapters >= 10 && completedNotesCount >= 50) {
    achievementsToUnlock.push(ACHIEVEMENT_CODES.CN_EXPERT);
  }

  if (achievementsToUnlock.length > 0) {
    await Promise.all(
      achievementsToUnlock.map((code) => unlockAchievementIfEligible({ userId, achievementCode: code }))
    );
  }
};

export const evaluateTimeAndRecoveryAchievements = async (userId: string) => {
  const achievementsToUnlock: string[] = [];

  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istString);
  const currentHour = istDate.getHours(); 
  const currentDay = istDate.getDay();

  if (currentHour >= 0 && currentHour < 4) {
    achievementsToUnlock.push(ACHIEVEMENT_CODES.NIGHT_OWL);
    achievementsToUnlock.push(ACHIEVEMENT_CODES.MIDNIGHT_WARRIOR);
  } else if (currentHour >= 4 && currentHour < 7) {
    achievementsToUnlock.push(ACHIEVEMENT_CODES.EARLY_BIRD);
  }

  if (currentDay === 0 || currentDay === 6) {
    achievementsToUnlock.push(ACHIEVEMENT_CODES.WEEKEND_HUSTLER);
  }

  const weakAreasCount = await prisma.weakArea.count({ where: { userId } });
  
  if (weakAreasCount) {
    const recentPerfectQuizzes = await prisma.quizAttempt.count({
      where: { 
        userId, 
        status: "COMPLETED",
        score: { gt: 0 }, 
        correctAnswers: { equals: prisma.quizAttempt.fields.totalQuestions }
      }
    });

    if (recentPerfectQuizzes >= 1) achievementsToUnlock.push(ACHIEVEMENT_CODES.BOUNCED_BACK);
    if (recentPerfectQuizzes >= 3) achievementsToUnlock.push(ACHIEVEMENT_CODES.RECOVERY_MASTER);
  }

  if (achievementsToUnlock.length > 0) {
    await Promise.all(
      achievementsToUnlock.map((code) => unlockAchievementIfEligible({ userId, achievementCode: code }))
    );
  }
};

export const evaluateMetaAchievements = async (userId: string) => {
  const totalUnlocked = await prisma.userAchievement.count({
    where: { userId }
  });

  const achievementsToUnlock: string[] = [];

  if (totalUnlocked >= 20) achievementsToUnlock.push(ACHIEVEMENT_CODES.UNSTOPPABLE);
  if (totalUnlocked >= 35) achievementsToUnlock.push(ACHIEVEMENT_CODES.LEGEND);

  if (achievementsToUnlock.length > 0) {
    await Promise.all(
      achievementsToUnlock.map((code) => unlockAchievementIfEligible({ userId, achievementCode: code }))
    );
  }
};