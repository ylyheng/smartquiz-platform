import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const startAttempt = async (req, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const studentId = req.user.id;

    const existing = await prisma.attempt.findFirst({
      where: { quizId, studentId, status: 'in-progress' },
    });
    if (existing) {
      return res.json({ success: true, data: { attempt: existing, resumed: true } });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        quizQuestions: {
          orderBy: { order: 'asc' },
          include: { question: true },
        },
      },
    });
    if (!quiz) return next(new ApiError(404, 'Quiz not found'));

    let questions = quiz.quizQuestions.map(qq => qq.question);
    if (quiz.shuffle) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    const attempt = await prisma.attempt.create({
      data: { quizId, studentId, status: 'in-progress' },
    });

    await prisma.attemptAnswer.createMany({
      data: questions.map(q => ({
        attemptId: attempt.id,
        questionId: q.id,
      })),
    });

    const full = await prisma.attempt.findUnique({
      where: { id: attempt.id },
      include: {
        answers: {
          include: { question: true },
        },
      },
    });

    res.status(201).json({ success: true, data: { attempt: full, quizTimeLimit: quiz.timeLimit } });
  } catch (err) { next(err); }
};

export const submitAttempt = async (req, res, next) => {
  try {
    const attemptId = parseInt(req.params.id);
    const { answers } = req.body;

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { answers: { include: { question: true } } },
    });
    if (!attempt) return next(new ApiError(404, 'Attempt not found'));
    if (attempt.studentId !== req.user.id) return next(new ApiError(403, 'Not your attempt'));
    if (attempt.status !== 'in-progress') return next(new ApiError(400, 'Already submitted'));

    let totalScore = 0;
    let totalPoints = 0;

    for (const answer of attempt.answers) {
      const submittedAnswer = answers ? answers[answer.questionId] : null;
      const q = answer.question;
      totalPoints += q.points;

      let isCorrect = false;
      let score = 0;
      let feedback = null;

      if (submittedAnswer !== null && submittedAnswer !== undefined && submittedAnswer !== '') {
        if (q.type === 'mcq') {
          isCorrect = submittedAnswer === q.correctAnswer;
          score = isCorrect ? q.points : 0;
        } else {
          const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ');
          const userAns = normalize(submittedAnswer);
          const correct = normalize(q.correctAnswer);
          isCorrect = userAns === correct;
          score = isCorrect ? q.points : 0;
        }
      }

      await prisma.attemptAnswer.update({
        where: { id: answer.id },
        data: {
          answer: submittedAnswer !== null && submittedAnswer !== undefined ? String(submittedAnswer) : null,
          isCorrect,
          score,
          feedback: q.explanation,
        },
      });

      totalScore += score;
    }

    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,
        totalPoints,
        status: 'submitted',
        submittedAt: new Date(),
      },
    });

    const result = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          include: { question: true },
        },
      },
    });

    res.json({ success: true, data: { attempt: result } });
  } catch (err) { next(err); }
};

export const getAttempt = async (req, res, next) => {
  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        answers: {
          include: { question: true },
        },
        quiz: {
          select: { id: true, title: true, timeLimit: true, showResults: true },
        },
      },
    });
    if (!attempt) return next(new ApiError(404, 'Attempt not found'));
    if (attempt.studentId !== req.user.id && req.user.role !== 'lecturer') {
      return next(new ApiError(403, 'Access denied'));
    }
    res.json({ success: true, data: { attempt } });
  } catch (err) { next(err); }
};

export const listMyAttempts = async (req, res, next) => {
  try {
    const attempts = await prisma.attempt.findMany({
      where: { studentId: req.user.id },
      include: {
        quiz: { select: { id: true, title: true, timeLimit: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { startedAt: 'desc' },
    });
    res.json({ success: true, data: { attempts } });
  } catch (err) { next(err); }
};
