import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const listByBank = async (req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      where: { bankId: parseInt(req.params.bankId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: { questions } });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const bankId = parseInt(req.params.bankId);
    const { type, questionText, options, correctAnswer, explanation, points } = req.body;

    const bank = await prisma.questionBank.findUnique({ where: { id: bankId } });
    if (!bank) return next(new ApiError(404, 'Question bank not found'));

    const question = await prisma.question.create({
      data: { bankId, type, questionText, options, correctAnswer, explanation, points: points || 1 },
    });
    res.status(201).json({ success: true, data: { question } });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const { type, questionText, options, correctAnswer, explanation, points } = req.body;
    const question = await prisma.question.update({
      where: { id: parseInt(req.params.id) },
      data: { type, questionText, options, correctAnswer, explanation, points },
    });
    res.json({ success: true, data: { question } });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await prisma.question.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true, message: 'Question deleted' });
  } catch (err) { next(err); }
};
