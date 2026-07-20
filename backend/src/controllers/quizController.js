import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const list = async (req, res, next) => {
  try {
    let where = {};
    if (req.user.role === 'lecturer') {
      where.lecturerId = req.user.id;
    }
    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        _count: { select: { quizQuestions: true, attempts: true } },
        lecturer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: { quizzes } });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        quizQuestions: {
          orderBy: { order: 'asc' },
          include: {
            question: true,
          },
        },
        lecturer: { select: { id: true, name: true } },
      },
    });
    if (!quiz) return next(new ApiError(404, 'Quiz not found'));

    if (req.user.role === 'lecturer' && quiz.lecturerId !== req.user.id) {
      return next(new ApiError(403, 'Not your quiz'));
    }

    res.json({ success: true, data: { quiz } });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { title, description, timeLimit, shuffle, showResults, questionIds } = req.body;

    if (!questionIds || questionIds.length === 0) {
      return next(new ApiError(400, 'At least one question is required'));
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        lecturerId: req.user.id,
        timeLimit,
        shuffle: shuffle || false,
        showResults: showResults !== false,
        quizQuestions: {
          create: questionIds.map((qId, index) => ({
            questionId: qId,
            order: index + 1,
          })),
        },
      },
      include: {
        quizQuestions: {
          orderBy: { order: 'asc' },
          include: { question: true },
        },
      },
    });
    res.status(201).json({ success: true, data: { quiz } });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, timeLimit, shuffle, showResults, questionIds } = req.body;

    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) return next(new ApiError(404, 'Quiz not found'));
    if (existing.lecturerId !== req.user.id) return next(new ApiError(403, 'Not your quiz'));

    await prisma.quizQuestion.deleteMany({ where: { quizId: id } });

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title, description, timeLimit, shuffle, showResults,
        quizQuestions: questionIds ? {
          create: questionIds.map((qId, index) => ({
            questionId: qId, order: index + 1,
          })),
        } : undefined,
      },
      include: {
        quizQuestions: {
          orderBy: { order: 'asc' },
          include: { question: true },
        },
      },
    });
    res.json({ success: true, data: { quiz } });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return next(new ApiError(404, 'Quiz not found'));
    if (quiz.lecturerId !== req.user.id) return next(new ApiError(403, 'Not your quiz'));

    const attemptIds = (await prisma.attempt.findMany({
      where: { quizId: id },
      select: { id: true },
    })).map(a => a.id);

    await prisma.$transaction([
      prisma.attemptAnswer.deleteMany({ where: { attemptId: { in: attemptIds } } }),
      prisma.attempt.deleteMany({ where: { quizId: id } }),
      prisma.quizQuestion.deleteMany({ where: { quizId: id } }),
      prisma.quiz.delete({ where: { id } }),
    ]);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (err) { next(err); }
};
