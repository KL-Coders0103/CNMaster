import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // =========================================
  // 1. SEED ACHIEVEMENTS
  // =========================================
  console.log('Seeding achievements...');
  const achievements = [
    // 📝 Planner & Tasks
    { code: 'FIRST_TASK', title: 'First Step', description: 'Create your very first planner task.', xpReward: 10 },
    { code: 'TASK_MASTER_25', title: 'Task Master I', description: 'Complete 25 planner tasks.', xpReward: 50 },
    { code: 'TASK_MASTER_50', title: 'Task Master II', description: 'Complete 50 planner tasks.', xpReward: 100 },
    { code: 'TASK_MASTER_100', title: 'Task Master III', description: 'Complete 100 planner tasks.', xpReward: 250 },
    { code: 'TASK_MASTER_250', title: 'Task Master IV', description: 'Complete 250 planner tasks.', xpReward: 500 },
    { code: 'EARLY_BIRD', title: 'Early Bird', description: 'Complete a task before 8 AM.', xpReward: 20 },
    { code: 'NIGHT_OWL', title: 'Night Owl', description: 'Complete a task after midnight.', xpReward: 20 },
    { code: 'CONSISTENT_PLANNER', title: 'Consistent Planner', description: 'Complete all planned tasks for 3 consecutive days.', xpReward: 100 },

    // 📚 Learning Progression
    { code: 'FIRST_TOPIC_COMPLETED', title: 'Curious Mind', description: 'Complete your first topic.', xpReward: 20 },
    { code: 'TOPIC_MASTER_10', title: 'Topic Master I', description: 'Complete 10 topics.', xpReward: 50 },
    { code: 'TOPIC_MASTER_50', title: 'Topic Master II', description: 'Complete 50 topics.', xpReward: 150 },
    { code: 'FIRST_MODULE_COMPLETED', title: 'Building Blocks', description: 'Complete your first full module.', xpReward: 50 },
    { code: 'MODULE_MASTER_5', title: 'Module Master I', description: 'Complete 5 modules.', xpReward: 100 },
    { code: 'MODULE_MASTER_10', title: 'Module Master II', description: 'Complete 10 modules.', xpReward: 250 },
    { code: 'CN_EXPERT', title: 'CN Expert', description: 'Complete all Computer Networks modules.', xpReward: 1000 },
    { code: 'REVISION_KING', title: 'Revision King', description: 'Review previously completed topics 10 times.', xpReward: 100 },

    // 🎯 Quizzes & Accuracy
    { code: 'FIRST_QUIZ', title: 'Testing the Waters', description: 'Attempt your first quiz.', xpReward: 10 },
    { code: 'QUIZ_MASTER_10', title: 'Quiz Master I', description: 'Complete 10 quizzes.', xpReward: 50 },
    { code: 'QUIZ_MASTER_50', title: 'Quiz Master II', description: 'Complete 50 quizzes.', xpReward: 150 },
    { code: 'QUIZ_MASTER_100', title: 'Quiz Master III', description: 'Complete 100 quizzes.', xpReward: 300 },
    { code: 'PERFECT_SCORE', title: 'Flawless', description: 'Score 100% on a quiz.', xpReward: 50 },
    { code: 'PERFECT_SCORE_5', title: 'Sharpshooter', description: 'Score 100% on 5 different quizzes.', xpReward: 150 },
    { code: 'PERFECT_SCORE_25', title: 'Perfectionist', description: 'Score 100% on 25 different quizzes.', xpReward: 500 },
    { code: 'SPEED_DEMON', title: 'Speed Demon', description: 'Finish a quiz in under 60 seconds with a passing grade.', xpReward: 100 },
    { code: 'NO_MISTAKE', title: 'No Mistake', description: 'Answer 50 consecutive quiz questions correctly.', xpReward: 200 },

    // 🔥 Streaks
    { code: 'STREAK_3', title: 'On a Roll', description: 'Maintain a 3-day login streak.', xpReward: 30 },
    { code: 'STREAK_7', title: 'Weekly Warrior', description: 'Maintain a 7-day login streak.', xpReward: 100 },
    { code: 'STREAK_15', title: 'Habit Builder', description: 'Maintain a 15-day login streak.', xpReward: 250 },
    { code: 'STREAK_30', title: 'Unbreakable', description: 'Maintain a 30-day login streak.', xpReward: 500 },
    { code: 'STREAK_60', title: 'Dedicated', description: 'Maintain a 60-day login streak.', xpReward: 1000 },
    { code: 'STREAK_100', title: 'Century Club', description: 'Maintain a 100-day login streak.', xpReward: 2500 },

    // ⚡ XP Milestones
    { code: 'XP_100', title: 'Getting Started', description: 'Earn your first 100 XP.', xpReward: 10 },
    { code: 'XP_500', title: 'Leveling Up', description: 'Reach 500 XP.', xpReward: 50 },
    { code: 'XP_1000', title: 'Kilo-XP', description: 'Reach 1,000 XP.', xpReward: 100 },
    { code: 'XP_5000', title: 'High Achiever', description: 'Reach 5,000 XP.', xpReward: 500 },
    { code: 'XP_10000', title: '10K Club', description: 'Reach 10,000 XP.', xpReward: 1000 },

    // ⭐ Levels
    { code: 'LEVEL_2', title: 'Novice', description: 'Reach Level 2.', xpReward: 20 },
    { code: 'LEVEL_5', title: 'Apprentice', description: 'Reach Level 5.', xpReward: 50 },
    { code: 'LEVEL_10', title: 'Scholar', description: 'Reach Level 10.', xpReward: 150 },
    { code: 'LEVEL_20', title: 'Adept', description: 'Reach Level 20.', xpReward: 300 },
    { code: 'LEVEL_30', title: 'Master', description: 'Reach Level 30.', xpReward: 500 },
    { code: 'LEVEL_50', title: 'Grandmaster', description: 'Reach Level 50.', xpReward: 1000 },

    // 🧠 Resilience & Special
    { code: 'WEAK_AREA_CONQUEROR', title: 'Conqueror', description: 'Improve your score by 30% on a retaken quiz.', xpReward: 100 },
    { code: 'RECOVERY_MASTER', title: 'Comeback Kid', description: 'Recover a lost streak using a streak freeze.', xpReward: 50 },
    { code: 'BOUNCED_BACK', title: 'Bounced Back', description: 'Pass a quiz you previously failed.', xpReward: 100 },
    { code: 'MIDNIGHT_WARRIOR', title: 'Midnight Warrior', description: 'Study past midnight for 3 consecutive days.', xpReward: 150 },
    { code: 'WEEKEND_HUSTLER', title: 'Weekend Hustler', description: 'Complete 5 modules or quizzes over the weekend.', xpReward: 200 },
    { code: 'UNSTOPPABLE', title: 'Unstoppable', description: 'Earn 10 achievements in a single day.', xpReward: 500 },
    { code: 'LEGEND', title: 'Living Legend', description: 'Unlock all other achievements.', xpReward: 5000 },
  ];

  await prisma.achievement.createMany({
    data: achievements,
    skipDuplicates: true, // Prevents crashing if you run it twice
  });
  console.log(`✅ Seeded ${achievements.length} achievements.`);

  // =========================================
  // 2. SEED SUBJECTS, CHAPTERS & NOTES
  // =========================================
  console.log('Seeding Subject, Chapters, and Notes...');

  // A. Create or Find the Base Subject
  let subject = await prisma.subject.findFirst({
    where: { name: 'Computer Networks' }
  });

  if (!subject) {
    subject = await prisma.subject.create({
      data: {
        name: 'Computer Networks',
        code: 'CS401'
      }
    });
    console.log('✅ Created Subject: Computer Networks');
  }

  // B. Define Chapter & Note Data
  const chaptersData = [
    {
      title: 'Unit 1: Introduction to Networks',
      description: 'Fundamentals of computer networks, architectures, and the OSI model.',
      notes: [
        { title: '1.1 The OSI Reference Model', description: 'Detailed breakdown of the 7 layers.', pdfUrl: 'https://example.com/osi-model.pdf' },
        { title: '1.2 TCP/IP Protocol Suite', description: 'Understanding the DoD model.', pdfUrl: 'https://example.com/tcp-ip.pdf' },
        { title: '1.3 Network Topologies', description: 'Star, Bus, Ring, and Mesh architectures.', pdfUrl: 'https://example.com/topologies.pdf' }
      ]
    },
    {
      title: 'Unit 2: The Physical Layer',
      description: 'Transmission media, signaling, and encoding.',
      notes: [
        { title: '2.1 Guided Transmission Media', description: 'Twisted pair, coaxial, and fiber optics.', pdfUrl: 'https://example.com/guided-media.pdf' },
        { title: '2.2 Wireless Transmission', description: 'Radio waves, microwaves, and infrared.', pdfUrl: 'https://example.com/wireless.pdf' }
      ]
    }
  ];

  // C. Safely create Chapters and Notes
  for (const chapterData of chaptersData) {
    let chapter = await prisma.chapter.findFirst({
      where: { title: chapterData.title, subjectId: subject.id }
    });

    if (!chapter) {
      chapter = await prisma.chapter.create({
        data: {
          title: chapterData.title,
          description: chapterData.description,
          subjectId: subject.id,
          notes: {
            create: chapterData.notes
          }
        }
      });
      console.log(`✅ Created Chapter: ${chapter.title} (with ${chapterData.notes.length} notes)`);
    }
  }

  // Need a teacher/admin user ID to populate 'createdById'
let adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });

if (!adminUser) {
  adminUser = await prisma.user.findFirst(); // Fallback to any existing user
}

if (adminUser) {
  const chapter = await prisma.chapter.findFirst();

  if (chapter) {
    const existingAssignment = await prisma.assignment.findFirst({
      where: { title: 'Packet Tracer Lab 1' }
    });

    if (!existingAssignment) {
      await prisma.assignment.create({
        data: {
          title: 'Packet Tracer Lab 1',
          description: 'Configure basic subnetting and RIP routing protocol.',
          instructions: 'Submit your completed .pdf report and config screenshots.',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
          totalMarks: 50,
          assignmentUrl: 'https://example.com/assignments/lab1.pdf',
          fileType: 'PDF',
          chapterId: chapter.id,
          createdById: adminUser.id,
        },
      });
      console.log('✅ Created sample assignment!');
    }
  }
}

// =========================================
  // 4. SEED MOCK USER ANALYTICS & ACTIVITY
  // =========================================
  console.log('Seeding Analytics Mock Data...');

  const sampleUser = await prisma.user.findFirst();

  if (sampleUser) {
    // A. Seed Daily Activity (for Heatmap & Weekly Analytics)
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      pastDate.setHours(0, 0, 0, 0);

      await prisma.dailyActivity.upsert({
        where: { userId_date: { userId: sampleUser.id, date: pastDate } },
        update: {},
        create: {
          userId: sampleUser.id,
          date: pastDate,
          xpGained: Math.floor(Math.random() * 80) + 20,
        },
      });
    }

    // B. Seed Learning Progress
    await prisma.learningProgress.upsert({
      where: { userId_moduleName: { userId: sampleUser.id, moduleName: 'OSI Reference Model' } },
      update: {},
      create: {
        userId: sampleUser.id,
        moduleName: 'OSI Reference Model',
        progress: 85,
      },
    });

    // C. Seed Weak Area
    const chapter = await prisma.chapter.findFirst();
    if (chapter) {
      await prisma.weakArea.upsert({
        where: { userId_chapterId: { userId: sampleUser.id, chapterId: chapter.id } },
        update: {},
        create: {
          userId: sampleUser.id,
          chapterId: chapter.id,
          mistakeCount: 4,
        },
      });
    }

    console.log('✅ Seeded Daily Activity, Learning Progress, and Weak Areas.');
  }

  // =========================================
  // 5. SEED QUIZZES & DAILY CHALLENGE
  // =========================================
  console.log('Seeding Quizzes and Daily Challenges...');

  const chapter = await prisma.chapter.findFirst({ 
    where: { title: 'Unit 1: Introduction to Networks' } 
  });

  if (chapter) {
    // 1. Create a Daily Challenge for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dailyChallenge = await prisma.dailyChallenge.findUnique({ where: { date: today } });
    
    if (!dailyChallenge) {
      dailyChallenge = await prisma.dailyChallenge.create({
        data: {
          date: today,
          title: 'OSI Layer Basics',
          description: 'Test your knowledge on the fundamental networking layers.',
          xpReward: 50,
        }
      });
    }

    // 2. Define standard quiz questions (Prisma handles JSON serialization automatically if defined correctly, or we stringify)
    const questionsData = [
      {
        question: 'Which OSI layer is responsible for logical addressing and routing?',
        options: JSON.stringify(['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer']),
        correctAnswer: 'Network Layer',
        explanation: 'The Network Layer (Layer 3) handles packet routing and logical IP addressing.',
        difficulty: 'EASY' as const,
        marks: 10,
        chapterId: chapter.id,
        dailyChallengeId: dailyChallenge.id, // Linking this question to today's challenge
      },
      {
        question: 'Which protocol operates primarily at the Transport Layer?',
        options: JSON.stringify(['HTTP', 'TCP', 'IP', 'Ethernet']),
        correctAnswer: 'TCP',
        explanation: 'Transmission Control Protocol (TCP) ensures reliable data delivery at the Transport Layer.',
        difficulty: 'MEDIUM' as const,
        marks: 20,
        chapterId: chapter.id,
      },
      {
        question: 'What is the standard port number for HTTPS?',
        options: JSON.stringify(['80', '21', '443', '22']),
        correctAnswer: '443',
        explanation: 'HTTPS traffic is secured via TLS/SSL and operates on port 443 by default.',
        difficulty: 'EASY' as const,
        marks: 10,
        chapterId: chapter.id,
      }
    ];

    // 3. Upsert questions safely
    for (const q of questionsData) {
      const exists = await prisma.question.findFirst({ where: { question: q.question } });
      if (!exists) {
        await prisma.question.create({ data: q });
      }
    }
    console.log('✅ Seeded Questions and Daily Challenge successfully.');
  }

  // =========================================
  // 6. SEED NOTIFICATIONS
  // =========================================
  console.log('Seeding Notifications...');

  const notifyUser = await prisma.user.findFirst();

  if (notifyUser) {
    const existingNotifs = await prisma.notification.count({ where: { userId: notifyUser.id } });
    
    if (existingNotifs === 0) {
      await prisma.notification.createMany({
        data: [
          {
            userId: notifyUser.id,
            title: '🔥 Streak Warning!',
            message: 'Your streak is about to expire. Complete a lesson to keep it alive!',
            isRead: false
          },
          {
            userId: notifyUser.id,
            title: '🏆 Achievement Unlocked',
            message: 'You earned the "Early Bird" achievement and 20 XP!',
            isRead: false
          },
          {
            userId: notifyUser.id,
            title: '📅 New Assignment',
            message: 'A new assignment "Packet Tracer Lab 1" is due in 7 days.',
            isRead: true // Already read for testing purposes
          }
        ]
      });
      console.log('✅ Seeded 3 test notifications.');
    }
  }

  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });