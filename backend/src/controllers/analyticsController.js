import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const overview = async (req, res, next) => {
  try {
    const lecturerId = req.user.id;

    const totalQuizzes = await prisma.quiz.count({ where: { lecturerId } });
    const totalStudents = await prisma.attempt.groupBy({
      by: ['studentId'],
      where: { quiz: { lecturerId } },
    });
    const totalAttempts = await prisma.attempt.count({
      where: { quiz: { lecturerId }, status: { not: 'in-progress' } },
    });

    const avg = await prisma.attempt.aggregate({
      _avg: { score: true },
      _sum: { totalPoints: true },
      where: { quiz: { lecturerId }, status: { not: 'in-progress' } },
    });

    const avgPercentage = avg._sum.totalPoints
      ? Math.round((avg._avg.score / avg._sum.totalPoints) * 100)
      : null;

    res.json({
      success: true,
      data: {
        totalQuizzes,
        totalStudents: totalStudents.length,
        totalAttempts,
        averageScore: avgPercentage,
      },
    });
  } catch (err) { next(err); }
};

export const quizScores = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId);

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) return next(new ApiError(404, 'Quiz not found'));
    if (quiz.lecturerId !== req.user.id) return next(new ApiError(403, 'Not your quiz'));

    const attempts = await prisma.attempt.findMany({
      where: { quizId, status: { not: 'in-progress' } },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { score: 'desc' },
    });

    const scored = attempts.map(a => ({
      id: a.id,
      student: a.student,
      score: a.score,
      totalPoints: a.totalPoints,
      percentage: a.totalPoints ? Math.round((a.score / a.totalPoints) * 100) : 0,
      submittedAt: a.submittedAt,
    }));

    res.json({ success: true, data: { scores: scored } });
  } catch (err) { next(err); }
};

export const questionBreakdown = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId);

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) return next(new ApiError(404, 'Quiz not found'));
    if (quiz.lecturerId !== req.user.id) return next(new ApiError(403, 'Not your quiz'));

    const questions = await prisma.question.findMany({
      where: { quizQuestions: { some: { quizId } } },
      include: {
        attemptAnswers: {
          where: { attempt: { quizId, status: { not: 'in-progress' } } },
        },
      },
    });

    const breakdown = questions.map(q => {
      const total = q.attemptAnswers.length;
      const correct = q.attemptAnswers.filter(a => a.isCorrect).length;
      return {
        id: q.id,
        questionText: q.questionText,
        type: q.type,
        points: q.points,
        totalAttempts: total,
        correctCount: correct,
        correctPercentage: total ? Math.round((correct / total) * 100) : null,
      };
    });

    res.json({ success: true, data: { breakdown } });
  } catch (err) { next(err); }
};

export const studentPerformance = async (req, res, next) => {
  try {
    const lecturerId = req.user.id;

    const students = await prisma.user.findMany({
      where: {
        role: 'student',
        attempts: { some: { quiz: { lecturerId }, status: { not: 'in-progress' } } },
      },
      select: {
        id: true,
        name: true,
        email: true,
        attempts: {
          where: { quiz: { lecturerId }, status: { not: 'in-progress' } },
          select: { score: true, totalPoints: true, quiz: { select: { title: true } }, submittedAt: true },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    const result = students.map(s => {
      const totalPts = s.attempts.reduce((sum, a) => sum + (a.totalPoints || 0), 0);
      const totalScore = s.attempts.reduce((sum, a) => sum + (a.score || 0), 0);
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        totalAttempts: s.attempts.length,
        averagePercentage: totalPts ? Math.round((totalScore / totalPts) * 100) : null,
        recentAttempts: s.attempts.slice(0, 5),
      };
    });

    res.json({ success: true, data: { students: result } });
  } catch (err) { next(err); }
};
