import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const list = async (req, res, next) => {
  try {
    const banks = await prisma.questionBank.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: { banks } });
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const bank = await prisma.questionBank.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { questions: { orderBy: { createdAt: 'desc' } } },
    });
    if (!bank) return next(new ApiError(404, 'Question bank not found'));
    res.json({ success: true, data: { bank } });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const bank = await prisma.questionBank.create({ data: { title, description } });
    res.status(201).json({ success: true, message: 'Bank created', data: { bank } });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const bank = await prisma.questionBank.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description },
    });
    res.json({ success: true, data: { bank } });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const questionIds = (await prisma.question.findMany({
      where: { bankId: id },
      select: { id: true },
    })).map(q => q.id);

    await prisma.$transaction([
      prisma.attemptAnswer.deleteMany({ where: { questionId: { in: questionIds } } }),
      prisma.quizQuestion.deleteMany({ where: { questionId: { in: questionIds } } }),
      prisma.question.deleteMany({ where: { bankId: id } }),
      prisma.questionBank.delete({ where: { id } }),
    ]);
    res.json({ success: true, message: 'Bank deleted' });
  } catch (err) { next(err); }
};
